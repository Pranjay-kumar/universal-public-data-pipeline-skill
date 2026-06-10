#!/usr/bin/env node

import { chromium } from "patchright";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const targetUrl = process.argv[2];
if (!targetUrl) {
  console.error("Usage: npm run probe:patchright -- <url> [output-json]");
  process.exit(2);
}

const outputPath = resolve(process.argv[3] || "patchright-endpoint-probe-report.json");
const storageStatePath = resolve(
  process.env.PATCHRIGHT_STORAGE_STATE || "auth/patchright-storage-state.json"
);
const userDataDir = resolve(process.env.PATCHRIGHT_USER_DATA_DIR || "auth/patchright-profile");
const maxRows = Number.parseInt(process.env.PATCHRIGHT_PROBE_MAX_ROWS || "20", 10);
const timeoutMs = Number.parseInt(process.env.PATCHRIGHT_PROBE_TIMEOUT_MS || "45000", 10);
const settleMs = Number.parseInt(process.env.PATCHRIGHT_SETTLE_MS || "3000", 10);
const channel = process.env.PATCHRIGHT_BROWSER_CHANNEL || "chrome";
const headless = process.env.PATCHRIGHT_HEADLESS === "1";

await mkdir(dirname(outputPath), { recursive: true });
await mkdir(dirname(storageStatePath), { recursive: true });
await mkdir(userDataDir, { recursive: true });

const context = await chromium.launchPersistentContext(userDataDir, {
  channel,
  headless,
  viewport: headless ? { width: 1280, height: 800 } : null,
  locale: "en-US"
});

const page = context.pages()[0] || (await context.newPage());
const requests = [];
const responses = [];
const consoleMessages = [];
const responseBodies = [];

page.on("request", (request) => {
  if (requests.length >= 500) return;
  requests.push({
    method: request.method(),
    url: request.url(),
    resourceType: request.resourceType(),
    headers: redactHeaders(request.headers())
  });
});

page.on("response", async (response) => {
  if (responses.length < 500) {
    responses.push({
      status: response.status(),
      url: response.url(),
      contentType: response.headers()["content-type"] || ""
    });
  }

  if (responseBodies.length >= 40 || !isStructuredResponse(response)) return;
  const text = await response.text().catch(() => "");
  responseBodies.push({
    status: response.status(),
    url: response.url(),
    contentType: response.headers()["content-type"] || "",
    bodyStart: text.slice(0, 2000)
  });
});

page.on("console", (message) => {
  if (consoleMessages.length >= 50) return;
  consoleMessages.push({
    type: message.type(),
    text: message.text().slice(0, 500)
  });
});

let navigation = null;
let error = null;

try {
  navigation = await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: timeoutMs
  });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(settleMs);
} catch (err) {
  error = String(err);
}

await context.storageState({ path: storageStatePath }).catch(() => {});

const title = await page.title().catch(() => "");
const finalUrl = page.url();
const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
const jsonLd = await page
  .locator('script[type="application/ld+json"]')
  .evaluateAll((nodes) => nodes.map((node) => node.textContent || ""))
  .catch(() => []);

const candidateLinks = await page
  .locator("a[href]")
  .evaluateAll((links, limit) => {
    const seen = new Set();
    const rows = [];
    for (const link of links) {
      const href = link.href;
      if (!href || seen.has(href)) continue;
      seen.add(href);
      rows.push({
        text: (link.textContent || "").trim().slice(0, 160),
        href
      });
      if (rows.length >= limit) break;
    }
    return rows;
  }, maxRows)
  .catch(() => []);

const screenshotPath = outputPath.replace(/\.json$/i, ".png");
await page.screenshot({ path: screenshotPath, fullPage: false }).catch(() => {});
await context.close();

const structuredRequests = requests.filter((request) => isStructuredUrl(request.url));
const structuredResponses = responses.filter((response) => isStructuredUrl(response.url) || isStructuredContent(response.contentType));
const endpointCandidates = summarizeEndpointCandidates(structuredRequests, structuredResponses);

const report = {
  target_url: targetUrl,
  final_url: finalUrl,
  status: navigation ? navigation.status() : null,
  error,
  title,
  body_text_start: bodyText.slice(0, 1000),
  json_ld_count: jsonLd.length,
  json_ld_start: jsonLd.map((text) => text.slice(0, 1000)),
  candidate_links: candidateLinks,
  endpoint_candidates: endpointCandidates,
  network: {
    request_count: requests.length,
    response_count: responses.length,
    structured_requests: structuredRequests.slice(0, 120),
    structured_responses: structuredResponses.slice(0, 120),
    structured_response_bodies: responseBodies
  },
  console_messages: consoleMessages,
  evidence: {
    screenshot: screenshotPath
  },
  source_access: {
    class: "owned_session",
    is_publishable_as_public_result: false,
    storage_state_generated: true,
    storage_state_path_recorded: "[redacted-local-path]",
    user_data_dir_recorded: "[redacted-local-path]"
  },
  bounds: {
    max_rows: maxRows,
    timeout_ms: timeoutMs,
    settle_ms: settleMs,
    browser_channel: channel,
    headless
  }
};

await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));

function isStructuredResponse(response) {
  return isStructuredContent(response.headers()["content-type"] || "") || isStructuredUrl(response.url());
}

function isStructuredContent(contentType) {
  const lower = contentType.toLowerCase();
  return lower.includes("json") || lower.includes("graphql") || lower.includes("text/event-stream");
}

function isStructuredUrl(url) {
  const lower = url.toLowerCase();
  return (
    lower.includes("graphql") ||
    lower.includes("/api/") ||
    lower.includes("/xapi/") ||
    lower.includes("/bff/") ||
    lower.includes("/gateway/") ||
    lower.includes("_next/data") ||
    lower.includes("page-data") ||
    lower.includes("algolia") ||
    lower.endsWith(".json")
  );
}

function summarizeEndpointCandidates(structuredRequests, structuredResponses) {
  const byUrl = new Map();
  for (const request of structuredRequests) {
    byUrl.set(request.url, {
      method: request.method,
      url: request.url,
      resourceType: request.resourceType,
      status: null,
      contentType: "",
      required_header_candidates: Object.keys(request.headers || {})
    });
  }
  for (const response of structuredResponses) {
    const existing = byUrl.get(response.url) || {
      method: "GET",
      url: response.url,
      resourceType: "",
      required_header_candidates: []
    };
    existing.status = response.status;
    existing.contentType = response.contentType;
    byUrl.set(response.url, existing);
  }
  return Array.from(byUrl.values()).slice(0, 120);
}

function redactHeaders(headers) {
  const safe = {};
  const allowList = new Set([
    "accept",
    "accept-language",
    "content-type",
    "origin",
    "referer",
    "x-requested-with"
  ]);

  for (const [key, value] of Object.entries(headers)) {
    const lower = key.toLowerCase();
    if (allowList.has(lower)) {
      safe[lower] = value;
    }
  }

  return safe;
}
