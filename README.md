# Universal Data Acquisition Pipeline Skill

Stop writing brittle scrapers. Design the data pipeline.

This Codex skill turns messy data acquisition requests into due-diligence reports, source classifications, and production-grade scraping/API pipeline plans. It is aggressive about discovering APIs, XHR endpoints, page-data routes, sitemaps, catalogs, embedded JSON, browser network routes, and rendered DOM fallback paths because structured routes are usually faster, cleaner, and less brittle than HTML scraping.

It is balanced about feasibility. If a source works, it says so. If the data is public, authenticated, licensed, partial, rate-limited, risky, blocked, or not worth collecting, it says that too.

The skill is also portable to Claude-style skill folders because the core artifact is a standard `SKILL.md` plus markdown references.

The core question is not "can we scrape this page?"

The core question is:

```text
What is the right data acquisition path, and can it become a reliable pipeline?
```

## What It Does

- Converts vague data asks into a concrete `DatasetSpec`
- Classifies source access: public, owned session, provided credentials, licensed API, partner API, internal system, or reject
- Designs the actual dataset need before collection: decision, grain, fields, freshness, history, coverage, join keys, and exclusions
- Finds public APIs and storefront/page-data endpoints
- Uses Patchright to generate local browser cookies/storage state and capture warm-session request context for category/XHR APIs when cold probes are misleading
- Derives endpoint templates, query params, headers, and pagination behavior
- Probes limits with tiny requests before broad collection
- Supports authorized owned-session Patchright/Playwright pipelines without publishing them as public results
- Adds production pipeline design: checkpoints, dedupe, raw/staged/normalized layers, quality gates, run reports, and recovery
- Uses Playwright/rendered DOM as a bounded last resort when no public structured route works
- Supports optional execution adapters, including Jacob Padilla's Stealth-Requests and Google-Colab-Selenium, under explicit source-access boundaries
- Scores technical and responsible collection feasibility with Green/Yellow/Red status
- Produces a data acquisition memo: fastest route, cheapest robust route, highest-coverage route, trapdoors, and stop conditions
- Designs reusable pipeline plans with validation and approval gates
- Produces consistent outputs: `SourcePlan`, `EndpointPlan`, `HeaderProfile`, `ProbeResults`, `FeasibilityScorecard`, `DataAcquisitionMemo`, `FeasibilityReport`, `PipelinePlan`, `SampleRows`, and `ApprovalGate`

## What It Refuses

This skill prefers public and structured data, but it can also design authenticated or licensed pipelines when the user has authorization.

It does not do auth bypass, paywall bypass, CAPTCHA solving, unauthorized private account access, credential theft, fingerprint evasion, exploit generation, or rate-limit bypass.

Cookies/session state are allowed only for explicit user-owned or authorized workflows. Those outputs must be labeled non-public and must never be published as public pipeline evidence.

The skill can detect limits and design within them using backoff, caching, checkpointing, sampling, dedupe, and explicit approval gates.

## Source Access Classes

| Class | Use Case | Publish As Public Result |
|---|---|---|
| Public | Unauthenticated APIs, pages, feeds, sitemaps, files | yes |
| Owned Session | User's own logged-in account/session | no |
| Provided Credentials | User-controlled portal credentials | no |
| Licensed API | API key or data license | depends on license |
| Partner API | Integration or partner access | depends on terms |
| Internal System | User's own app/admin/database | no |
| Restricted/Reject | Requires bypass, evasion, or unauthorized access | no |

## The Scorecard

Every serious feasibility report should make the decision obvious:

| Dimension | Meaning |
|---|---|
| Coverage | How much of the requested dataset appears reachable |
| Stability | How brittle the route looks |
| Pagination depth | Whether public pagination reaches the target scale |
| Refreshability | Whether the pipeline can run repeatedly |
| Data quality | Whether fields are complete and normalized enough |
| Engineering cost | S, M, L, or XL |
| Legal/ToS risk | low, medium, or high |
| Recommended path | official API, public XAPI, embedded JSON, sitemap plus detail, HTML, rendered DOM, or reject |
| Traffic light | Green, Yellow, or Red |

Green means build the pipeline. Yellow means sample, narrow, or find another route. Red means stop.

## Modes

Use the router skill or call a focused child skill directly:

| Skill | Use It When |
|---|---|
| `universal-data-acquisition-pipeline` | Router for the whole acquisition workflow |
| `data-acquisition-core` | Shared contracts, source access, compliance, output schemas |
| `data-acquisition-design` | You know the business goal but not the exact data needed |
| `data-acquisition-feasibility` | You named a dataset and need to know whether it is collectible |
| `data-acquisition-discovery` | You want APIs, XHR/fetch routes, feeds, sitemaps, or embedded JSON |
| `data-acquisition-browser` | You need Patchright warm-session capture, Playwright rendered DOM fallback, network capture, or owned-session browser probes |
| `data-acquisition-pipeline` | Sources are known and you want a production-grade pipeline |
| `data-acquisition-publish` | You want to publish real probe-backed results |

Default ladder:

```text
Dataset Design -> Feasibility -> Endpoint Discovery -> Pagination/Limits -> Pipeline Design -> Sample Validation -> Execution
```

## 15-Second Demo

Prompt:

```text
Use $universal-data-acquisition-pipeline to find all public product metadata for Macy's.
Prefer public APIs or page-data endpoints over HTML scraping. Stop at feasibility first.
```

What the skill should discover:

```text
category sitemap -> public category discover XAPI -> product IDs -> product detail XAPI
```

The useful result is not "here is a scraper." The useful result is:

- the endpoint templates
- the params and headers that matter
- the page and category limits
- the feasibility scorecard
- the data acquisition memo
- sample rows
- a feasibility score
- a reusable pipeline plan
- an approval gate before a full run

## Case Study Snapshot

| Target | Best Source Found | Pagination/Coverage Signal | Feasibility |
|---|---|---|---|
| Macy's product metadata | Robots-listed sitemap index -> PDP sitemap shards -> product detail XAPI | One sampled PDP shard returned 50,000 product URLs and a detail XAPI sample returned rich metadata; immediate repeats showed edge sensitivity | Green-Yellow |
| Wattpad followers/following | Public user graph API | Followers on popular accounts appear publicly capped near a deep offset; following behaves differently | Yellow |
| StreetEasy listings | Public search-page JSON-LD plus sitemap indexes | Child listing sitemap files returned 403; robots disallows key detail/API paths | Yellow |

## Public API Pattern Library

The skill teaches Codex to recognize common public data routes before falling back to HTML:

- Next.js and Nuxt page data
- GraphQL and persisted queries
- Algolia indices
- Shopify product/catalog JSON
- Salesforce Commerce Cloud APIs
- Storefront XAPI and BFF routes
- sitemap-to-detail enrichment
- JSON-LD and hydration state
- mobile API mirrors
- search, autocomplete, feed, and listing endpoints

## Patchright Warm Session And Playwright Fallback

Patchright is the warm-session helper for pages that need a normal browser context before API/XHR endpoints appear. Playwright remains the plain rendered-DOM fallback.

Use browser automation only when public APIs, feeds, sitemaps, embedded JSON, and static HTML are unavailable or incomplete, or when a public page must mint ordinary browser-issued context before its structured APIs can be observed. Browser probes should stay tiny, inspect network traffic for structured routes, capture evidence, and fall back to DOM extraction only when needed.

No CAPTCHA solving, credential extraction, auth bypass, or rate-limit bypass.

Optional setup:

```powershell
npm install
npx patchright install chrome
npx playwright install chromium
```

Generate local cookies/storage state and discover endpoint candidates:

```powershell
npm run probe:patchright -- "https://example.com/category" "outputs/example-patchright-endpoints.json"
```

The Patchright helper writes a JSON report and screenshot, saves local storage state under `auth/`, and records `endpoint_candidates`, structured requests, structured responses, safe headers, and response snippets. Cookie/storage values and local paths are not printed in reports.

Run a tiny public-page Playwright fallback probe:

```powershell
npm run probe:playwright -- "https://example.com/public-page" "outputs/example-playwright-probe.json"
```

The helper writes a JSON report and screenshot, including network requests, structured JSON/API-looking responses, JSON-LD snippets, candidate links, console messages, and probe bounds.

Authorized owned-session probe:

```powershell
$env:PATCHRIGHT_STORAGE_STATE = "auth\target-storage-state.json"
$env:PATCHRIGHT_USER_DATA_DIR = "auth\target-profile"
npm run probe:patchright -- "https://example.com/account/export" "outputs/owned-session-endpoints.json"
```

The storage state file is gitignored. Do not publish owned-session outputs as public case studies.

## Warm Session And Adapters

Some public category APIs are easiest to use after the normal browser page has minted request context. Macy's category pages are a good example: a cold runner may get edge-denied while a user-controlled browser can observe the exact XHR route, category ID, canonical path, page size, sort/facet params, and safe headers.

Warm Session Capture flow:

```text
Patchright visible browser page
-> generate local cookies/storage state
-> observe XHR/fetch/category API
-> save endpoint template + safe headers
-> keep cookies/storage local if needed
-> replay tiny probes in the same browser context
-> generate pipeline.yaml
```

Optional adapter references:

- [Stealth-Requests](https://github.com/jpjacobpadilla/Stealth-Requests): useful as a user-provided browser-like HTTP adapter with retries/parsing helpers. The skill treats it as an adapter, not as a license to bypass CAPTCHA, fingerprinting, auth, or rate limits.
- [Google-Colab-Selenium](https://github.com/jpjacobpadilla/Google-Colab-Selenium): useful as a notebook-friendly browser runtime for user-driven warm-session capture and sample validation.

If cookies or storage state are required, classify the run as `owned_session`, keep secrets local, and do not publish the result as a public case study.

## Install

Clone the repo:

```powershell
git clone https://github.com/Pranjay-kumar/universal-data-acquisition-pipeline-skill
```

Install into Codex skills:

```powershell
.\scripts\install_skills.ps1 -Target codex
```

Restart Codex or start a new thread so the skill metadata is loaded.

Install into Claude Code skills:

```powershell
.\scripts\install_skills.ps1 -Target claude
```

Claude.ai custom skills can also use the same folder contents: `SKILL.md`, `skills/`, `case-studies/`, and supporting docs.

## Try These Prompts

```text
Use $universal-data-acquisition-pipeline to assess whether we can collect all product metadata from REI. Prefer public APIs and page-data endpoints. Stop at feasibility.
```

```text
Use $universal-data-acquisition-pipeline to find public follower/following endpoints for Wattpad and determine pagination limits. Use tiny probes only.
```

```text
Use $universal-data-acquisition-pipeline to collect public event listings for NYC tech meetups. Find APIs, feeds, or embedded JSON before HTML scraping.
```

```text
Use $universal-data-acquisition-pipeline to design a refreshable public pipeline for government contract awards. Prefer official APIs or bulk datasets.
```

More examples live in [PROMPTS.md](PROMPTS.md).

## Real Results

- [Macy's product metadata pipeline](case-studies/macys.md): robots-listed sitemap index to PDP shards to product detail XAPI, with a tracked `pipeline.yaml`, sample rows, and run report.
- [Patchright warm-session test plan](case-studies/patchright-test-plan.md): 10 bounded cases for validating browser-minted cookies/storage, endpoint discovery, direct public APIs, and structured fallback paths.
- [Macy's Patchright men's shirts probe](case-studies/macys-patchright-mens-shirts.md): visible Patchright loaded the public category and pagination, but no category API was observed; best current route is SSR product grid HTML plus pagination.
- [Target Patchright category products](case-studies/target-patchright-category-products.md): Patchright observed Target Redsky PLP/product-summary JSON APIs and rendered product cards; Green for bounded category discovery.
- [Eventbrite Patchright public events](case-studies/eventbrite-patchright-public-events.md): Patchright loaded a city event page, JSON-LD, and destination APIs; Yellow until pagination/completeness is validated.
- [Wattpad followers/following](case-studies/wattpad.md): public endpoint discovery with pagination caps and responsible feasibility scoring.
- [Greenhouse and Lever public job boards](case-studies/greenhouse-lever-jobs.md): ATS public APIs, provider-specific pagination, and hiring-signal pipeline design.
- [ATS public jobs probe](case-studies/ats-public-jobs-probe.md): direct Greenhouse and Lever JSON APIs worked without Patchright; Green for selected public boards.
- [NYC Open Data Socrata probe](case-studies/nyc-open-data-socrata-probe.md): official Socrata API exposed 311 metadata, count, sampling, ordering, and pagination; Green.
- [StreetEasy public real estate listings](case-studies/streeteasy.md): JSON-LD and sitemap discovery with a clear Yellow boundary around 403s and disallowed routes.
- [StreetEasy Patchright LES rentals probe](case-studies/streeteasy-patchright-les-rentals.md): valid LES search page exposed JSON-LD, pagination, and an `api-v6` `searchRentals` response, with repeat-probe human-verification risk.
- [Travel search Patchright feasibility](case-studies/travel-search-patchright-feasibility.md): Expedia/Rome2Rio/Wanderu hit bot verification, while Amtrak exposed useful public reference JSON; Yellow overall.
- [News metadata public probe](case-studies/news-metadata-public-probe.md): NPR RSS and sampled article metadata worked directly; Green for feeds, Yellow for keyword search pages.
- [Yahoo Finance public market and news probe](case-studies/market-news-public-probe.md): chart JSON and RSS worked without browser state; Green-Yellow.
- [OpenStreetMap Nominatim public places probe](case-studies/osm-nominatim-public-places-probe.md): official Nominatim JSON worked for tiny lookup; Green for lookup, Yellow for broad collection.

Only publish case studies after using the skill on a real target and recording probe-backed evidence. Keep hypothetical examples in `PROMPTS.md` or `skills/data-acquisition-core/references/examples.md`, not in `case-studies/`.

## Skill Layout

```text
SKILL.md
agents/
  openai.yaml
skills/
  data-acquisition-core/
    SKILL.md
    references/
      workflow.md
      modes.md
      source-access.md
      endpoint-discovery.md
      probing.md
      feasibility-scoring.md
      compliance-boundaries.md
      source-strategies.md
      execution-adapters.md
      output-contracts.md
      pattern-library.md
      playwright-rendered-dom.md
      pipeline-engineering.md
      examples.md
  data-acquisition-design/
    SKILL.md
  data-acquisition-feasibility/
    SKILL.md
  data-acquisition-discovery/
    SKILL.md
  data-acquisition-browser/
    SKILL.md
    scripts/
      patchright_cookie_endpoint_probe.mjs
      playwright_probe.mjs
  data-acquisition-pipeline/
    SKILL.md
  data-acquisition-publish/
    SKILL.md
case-studies/
  patchright-test-plan.md
  macys.md
  macys-patchright-mens-shirts.md
  target-patchright-category-products.md
  eventbrite-patchright-public-events.md
  macys-product-metadata/
    pipeline.yaml
    sample-rows.jsonl
    run-report.json
  wattpad.md
  greenhouse-lever-jobs.md
  ats-public-jobs-probe.md
  nyc-open-data-socrata-probe.md
  streeteasy.md
  streeteasy-patchright-les-rentals.md
  travel-search-patchright-feasibility.md
  news-metadata-public-probe.md
  market-news-public-probe.md
  osm-nominatim-public-places-probe.md
PROMPTS.md
CONTRIBUTING.md
LICENSE
package.json
scripts/
  install_skills.ps1
```

The router `SKILL.md` stays short so Codex can trigger cheaply. Shared contracts live in `skills/data-acquisition-core/`; focused child skills reference that core instead of duplicating it.

## The Core Idea

Most public websites already fetch structured data for normal users.

The job is to classify access, find the best data path, prove it works, understand its limits, decide whether the collection is worth doing, and only then build the pipeline.

One-off HTML scraping first is usually the slow path.
