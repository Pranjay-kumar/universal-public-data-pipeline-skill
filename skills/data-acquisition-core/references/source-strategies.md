# Source Strategies

Pick the fastest reliable strategy that fits the dataset and source access class.

## Official Public API

Use when docs and unauthenticated, licensed, partner, or otherwise approved access exists. Prefer it over reverse-engineered endpoints.

Watch for:

- API keys
- partner-only access
- rate limits
- field coverage
- terms

## Public Site API Or XAPI

Use when the public site fetches structured JSON for normal unauthenticated page loads.

Best for:

- product catalogs
- category pages
- public profiles
- search results
- listing pages
- reviews
- events
- media metadata

Document endpoint templates, params, headers, pagination, and fallback.

## Embedded JSON Or Hydration

Use when page HTML contains data blobs such as JSON-LD, app state, or static props.

Best when API endpoints are unavailable but page HTML is stable.

## Sitemap And Catalog Discovery

Use for broad discovery:

- sitemap indexes
- gzipped XML sitemaps
- category sitemaps
- product sitemaps
- public directories
- brand/category indexes

Sitemaps often provide IDs and URLs, then detail endpoints provide rich records.

## Search And Browse Endpoints

Use when the dataset is naturally queryable or category-driven.

Probe:

- result count
- max page size
- offset/cursor limits
- facets
- sort behavior
- dedupe across categories

## Static HTML

Use only when structured endpoints are unavailable. Prefer robust selectors and schema validation.

## Rendered DOM

Use only when the data requires JavaScript rendering and no public endpoint, feed, sitemap, embedded JSON, or static HTML route is sufficient. Prefer Playwright for tiny bounded probes and evidence capture.

Read `playwright-rendered-dom.md` before using this strategy.

## Reject

Reject or lower feasibility when data requires unauthorized private access, evasion, CAPTCHA solving, auth bypass, or rate-limit bypass.

## Strategy Recommendation Language

For every serious data request, name three routes even if two are inferior:

- `fastest viable route`: quickest way to prove and collect useful rows
- `cheapest robust route`: simplest refreshable design with the least moving parts
- `highest coverage route`: path most likely to maximize completeness, even if slower

Then choose one recommended route and explain why.
