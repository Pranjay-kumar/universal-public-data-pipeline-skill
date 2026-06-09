#!/usr/bin/env node

import { chromium } from "playwright";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const targetUrl = process.argv[2];
if (!targetUrl) {
  console.error("Usage: npm run probe:playwright -- <public-url> [output-json]");
  process.exit(2);
}

const outputPath = resolve(process.argv[3] || "playwright-probe-report.json");
const maxRows = Number.parseInt(process.env.PLAYWRIGHT_PROBE_MAX_ROWS || "20", 10);
const timeoutMs = Number.parseInt(process.env.PLAYWRIGHT_PROBE_TIMEOUT_MS || "45000", 10);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1280, height: 800 },
  locale: "en-US"
});

const requests = [];
const responses = [];
const consoleMessages = [];

page.on("request", (request) => {
  const url = request.url();
  if (requests.length < 250) {
    requests.push({
      method: request.method(),
      url,
      resourceType: request.resourceType()
    });
  }
});

page.on("response", (response) => {
  if (responses.length < 250) {
    responses.push({
      status: response.status(),
      url: response.url(),
      contentType: response.headers()["content-type"] || ""
    });
  }
});

page.on("console", (message) => {
  if (consoleMessages.length < 50) {
    consoleMessages.push({
      type: message.type(),
      text: message.text().slice(0, 500)
    });
  }
});

let navigation = null;
let error = null;

try {
  navigation = await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
    timeout: timeoutMs
  });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {});
  await page.waitForTimeout(2000);
} catch (err) {
  error = String(err);
}

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
await browser.close();

const structuredResponses = responses.filter((response) => {
  const contentType = response.contentType.toLowerCase();
  const url = response.url.toLowerCase();
  return (
    contentType.includes("json") ||
    url.includes("graphql") ||
    url.includes("/api/") ||
    url.includes("_next/data")
  );
});

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
  network: {
    request_count: requests.length,
    response_count: responses.length,
    structured_responses: structuredResponses.slice(0, 80),
    requests: requests.slice(0, 80)
  },
  console_messages: consoleMessages,
  evidence: {
    screenshot: screenshotPath
  },
  bounds: {
    max_rows: maxRows,
    timeout_ms: timeoutMs
  }
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
