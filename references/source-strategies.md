# Source Strategies

Pick the fastest reliable public strategy that fits the dataset.

## Official Public API

Use when docs and unauthenticated or approved public access exist. Prefer it over reverse-engineered endpoints.

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

Use only when the data requires JavaScript rendering and no public endpoint or embedded JSON is available. Keep samples small and document the cost.

## Reject

Reject or lower feasibility when data requires private access, evasion, CAPTCHA solving, auth bypass, or rate-limit bypass.

