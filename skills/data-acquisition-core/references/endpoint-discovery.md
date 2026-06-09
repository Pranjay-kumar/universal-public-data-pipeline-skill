# Endpoint Discovery

Use this when a website or app may expose structured data through APIs, XHR/fetch calls, page-data routes, script bundles, or embedded JSON.

## Goal

Find the fastest allowed data path for the source access class. Prefer structured endpoint responses over HTML scraping.

## Discovery Tactics

Use multiple signals:

- Inspect rendered HTML for endpoint strings, API route names, JSON-LD, hydration blobs, script chunk URLs, build IDs, and entity IDs.
- Search script bundles for terms such as `api`, `xapi`, `graphql`, `search`, `browse`, `product`, `category`, `followers`, `following`, `page`, `offset`, `cursor`, `limit`, and `next`.
- Probe route patterns suggested by page URLs and data identifiers.
- Compare public page URLs against endpoint URLs to infer templates.
- Look for public sitemap, catalog, directory, search, and browse sources that expose IDs.
- Use normal network inspection when available to observe public XHR/fetch calls made by an unauthenticated page load.

## Endpoint Template Extraction

Represent each candidate endpoint as:

```json
{
  "template": "",
  "method": "GET",
  "path_params": [],
  "query_params": [],
  "required_headers": [],
  "optional_headers": [],
  "auth_required": false,
  "pagination": {},
  "field_coverage": [],
  "confidence": 0.0
}
```

Classify query params:

- Required identity params: `id`, `username`, `slug`, `categoryId`, `productId`
- Pagination params: `page`, `offset`, `limit`, `cursor`, `next`, `after`
- Locale/region params: `currency`, `country`, `locale`, `region`
- Sorting/filter params: `sort`, `facet`, `q`, `filter`
- Experiment/noise params: test whether they can be omitted

Minimize params. Keep the smallest request that returns the correct public data.

## Header Profile

Use normal browser-style headers only when needed:

```json
{
  "user_agent": "ordinary desktop browser or transparent pipeline UA",
  "accept": "application/json,text/html,*/*",
  "accept_language": "en-US,en;q=0.9",
  "referer_required": false,
  "origin_required": false,
  "notes": "No cookies, auth tokens, CAPTCHA state, or fingerprint headers."
}
```

Prefer the smallest header set that works. If a request only works with cookies, private tokens, CAPTCHA state, fingerprint headers, or unusual anti-bot headers, mark it restricted and do not use it.

## Endpoint Preference

Score endpoint candidates:

- `95`: Official public API with docs and stable params
- `90`: Public unauthenticated JSON endpoint used by the site
- `85`: Public page-data or XAPI endpoint with stable IDs and pagination
- `75`: Embedded JSON or hydration state
- `65`: Sitemap/catalog plus detail endpoints
- `55`: Static HTML with stable selectors
- `40`: Rendered DOM
- `20`: Vision extraction
- `0`: Auth/private/restricted

## Stop Conditions

Stop and lower feasibility if the path requires:

- login
- cookies or stored session state
- private API keys
- CAPTCHA solving
- fingerprint evasion
- header spoofing to defeat access controls
- paywall or private-account bypass
- rate-limit bypass

Rate limits may be detected and respected. Design with backoff, caching, incremental writes, dedupe, and approval gates.
