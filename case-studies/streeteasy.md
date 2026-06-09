# Case Study: StreetEasy Public Real Estate Listings

## Run Date

2026-06-09

## User Ask

Assess StreetEasy as a public real-estate listing data source and publish real probe-backed results.

## ModeSelection

```json
{
  "mode": "feasibility",
  "reason": "StreetEasy has public search pages and sitemap signals, but the question is whether a reusable public listing pipeline is appropriate.",
  "will_probe": true,
  "will_collect_beyond_sample": false
}
```

## DatasetNeed

```json
{
  "decision_or_workflow": "Evaluate whether public StreetEasy listing/search metadata can support market-monitoring or inventory analysis.",
  "entity_grain": "listing_or_building_snapshot",
  "required_fields": [
    "source_url",
    "listing_or_building_id",
    "address",
    "neighborhood",
    "price",
    "bedrooms",
    "bathrooms",
    "floor_size",
    "latitude",
    "longitude",
    "observed_at"
  ],
  "nice_to_have_fields": [
    "days_on_market",
    "agent_or_brokerage",
    "building_name",
    "amenities",
    "status",
    "image_urls"
  ],
  "freshness": "daily or weekly if a compliant source path exists",
  "history": "snapshot history, not one-time scraped cards",
  "coverage_target": "public search/listing metadata; avoid private, account, saved-search, message, or lead-generation data",
  "join_keys": ["source_url", "listing_or_building_id"],
  "privacy_or_risk_fields": ["agent/contact lead data", "user/saved-search data", "messages"],
  "exclusions": ["login-only pages", "contact forms", "saved searches", "messages", "private user/account data"],
  "useless_if": [
    "only the first public search page is reachable",
    "listing/detail routes are disallowed or blocked",
    "sitemap detail files are not retrievable",
    "full coverage requires bypassing access controls"
  ]
}
```

## SourcePlan

```json
[
  {
    "url": "https://streeteasy.com/robots.txt",
    "type": "docs",
    "reason": "Robots file exposes sitemap indexes and disallowed paths.",
    "confidence": 0.95
  },
  {
    "url": "https://streeteasy.com/sitemaps/secure/nyc_sitemap_index.xml",
    "type": "sitemap",
    "reason": "Public sitemap index lists NYC building, rental, sale, search, new-development, and off-market sitemap files.",
    "confidence": 0.8
  },
  {
    "url": "https://streeteasy.com/for-sale/nyc",
    "type": "html",
    "reason": "Public search page returned HTML with JSON-LD listing metadata during the first tiny probe.",
    "confidence": 0.75
  },
  {
    "url": "https://streeteasy.com/srp/_next/static/chunks/app/%5B...searchQuery%5D/page-91dc8739fd6627e2.js",
    "type": "html",
    "reason": "Public JS chunk reveals app route/API host strings but not enough to justify broad endpoint use.",
    "confidence": 0.5
  }
]
```

## ProbeResults

Robots:

```text
https://streeteasy.com/robots.txt -> 200 text/plain
```

Important robots signals observed:

- `Disallow: /building/*/documents`
- `Disallow: /sale/*`
- `Disallow: /rental/*`
- `Disallow: /building/*/floorplans`
- `Disallow: /nyc/api`
- `Disallow: */messages/new`
- `Disallow: */saved_open_houses/`
- `Disallow: */sales/rss`
- `Disallow: */rentals/rss`

Robots also listed public sitemap indexes, including:

```text
https://streeteasy.com/blog/sitemap_index.xml
https://streeteasy.com/neighborhoods/sitemap_index.xml
https://streeteasy.com/guides/sitemap_index.xml
https://streeteasy.com/business/sitemap.xml
https://streeteasy.com/sitemaps/secure/nyc_sitemap_index.xml
```

Sitemap indexes:

| URL | Status | Notes |
|---|---:|---|
| `/blog/sitemap_index.xml` | 200 | 10 child sitemaps for blog posts/pages/categories/authors/news. |
| `/neighborhoods/sitemap_index.xml` | 200 | 2 child sitemaps for neighborhood pages. |
| `/guides/sitemap_index.xml` | 200 | 4 child sitemaps for guide content. |
| `/business/sitemap.xml` | 200 | 27 business/resource URLs. |
| `/sitemaps/secure/nyc_sitemap_index.xml` | 200 | 34 child sitemap files. |

NYC secure sitemap index listed child files including:

```text
nyc_building_searches_0.xml.gz
nyc_buildings_0.xml.gz ... nyc_buildings_7.xml.gz
nyc_discussions_0.xml.gz ... nyc_discussions_1.xml.gz
nyc_new_devs_0.xml.gz
nyc_off_market_buildings_0.xml.gz ... nyc_off_market_buildings_16.xml.gz
nyc_rental_searches_0.xml.gz
nyc_rentals_0.xml.gz
nyc_sale_searches_0.xml.gz
nyc_sales_0.xml.gz
nyc_seo_aliases_0.xml.gz
```

Child sitemap gzip probes:

| URL | Transparent UA | Browser-style UA | Finding |
|---|---:|---:|---|
| `/sitemaps/secure/nyc_sales_0.xml.gz` | 403 | 403 | Child file not retrievable in tiny probes. |
| `/sitemaps/secure/nyc_rentals_0.xml.gz` | 403 | 403 | Child file not retrievable in tiny probes. |
| `/sitemaps/secure/nyc_buildings_0.xml.gz` | 403 | 403 | Child file not retrievable in tiny probes. |
| `/sitemaps/secure/nyc_new_devs_0.xml.gz` | 403 | not retried | Child file not retrievable in tiny probe. |

Search page probe:

```text
https://streeteasy.com/for-sale/nyc -> 200 text/html
```

Observed in the returned HTML:

- one `application/ld+json` script
- no `__NEXT_DATA__`
- public Next.js script chunks under `/srp/_next/static/chunks/...`
- JSON-LD graph contained `Apartment` entities with fields such as URL, address, geo coordinates, bedrooms, bathrooms, and floor size

Public JS chunk probe:

| URL | Status | Signals |
|---|---:|---|
| `/srp/_next/static/chunks/app/%5B...searchQuery%5D/page-91dc8739fd6627e2.js` | 200 | route strings including `/api-internal.streeteasy.com/graphql`, `/api-v6.streeteasy.com`, `/api/gated-fetch/`, `/graphql` |
| `/srp/_next/static/chunks/989-ec7a44a61265d142.js` | 200 | route strings including `/api-v6.streeteasy.com/` and `/graphql` |

Playwright note:

```json
{
  "attempted": true,
  "result": "not_run",
  "reason": "The local Node runtime did not have Playwright installed: Module not found: playwright.",
  "impact": "No rendered-browser network evidence was added to this case study."
}
```

## EndpointPlan

```json
[
  {
    "name": "public_search_html_with_jsonld",
    "method": "GET",
    "template": "https://streeteasy.com/for-sale/{area}",
    "path_params": ["area"],
    "query_params": [],
    "pagination": {
      "observed": false,
      "notes": "Only the first NYC sale page was sampled. No full pagination proof."
    },
    "field_coverage": ["url", "address", "geo", "bedrooms", "bathrooms", "floor_size"],
    "fallback": "public sitemap index for discovery, but child listing sitemap files returned 403 in probes",
    "confidence": 0.55
  },
  {
    "name": "secure_nyc_sitemap_index",
    "method": "GET",
    "template": "https://streeteasy.com/sitemaps/secure/nyc_sitemap_index.xml",
    "path_params": [],
    "query_params": [],
    "pagination": {
      "type": "sitemap-index",
      "child_files": 34,
      "child_file_access": "403 in sampled gzip probes"
    },
    "field_coverage": ["child sitemap URLs only"],
    "fallback": "",
    "confidence": 0.65
  }
]
```

## HeaderProfile

```json
{
  "required": ["User-Agent"],
  "optional": ["Accept", "Accept-Language", "Referer"],
  "forbidden": ["cookies", "auth tokens", "captcha tokens", "fingerprint headers"],
  "notes": "Normal browser-style headers did not make sampled child sitemap gzip files accessible. Do not escalate to stealth, cookies, CAPTCHA, or fingerprint evasion."
}
```

## SampleRows

```json
[
  {
    "source": "json_ld",
    "url": "https://streeteasy.com/building/one-wall-street/2605",
    "name": "1 Wall Street #2605",
    "bedrooms": 2,
    "bathrooms_total": 2.5,
    "street_address": "1 Wall Street",
    "neighborhood": "Financial District",
    "region": "NY",
    "postal_code": "10005",
    "latitude": 40.707123,
    "longitude": -74.01183,
    "observed_from": "https://streeteasy.com/for-sale/nyc"
  }
]
```

## FeasibilityScorecard

```json
{
  "coverage": 4,
  "stability": 5,
  "pagination_depth": 2,
  "refreshability": 3,
  "data_quality": 6,
  "engineering_cost": "M",
  "legal_tos_risk": "medium",
  "recommended_path": "embedded_json",
  "traffic_light": "Yellow"
}
```

## DataAcquisitionMemo

```json
{
  "fastest_viable_route": "Use public search-page JSON-LD for a tiny sample of visible listing metadata.",
  "cheapest_robust_route": "For StreetEasy-owned content, use public blog/neighborhood/guide/business sitemaps. For active listing inventory, do not claim robustness from current evidence.",
  "highest_coverage_route": "The NYC secure sitemap index suggests broad listing/building coverage, but sampled child sitemap files returned 403 and should not be treated as available.",
  "coverage_ceiling": "Low to medium from first-page JSON-LD only; unknown for full NYC inventory.",
  "main_trapdoors": [
    "robots disallows sale and rental detail routes",
    "robots disallows /nyc/api",
    "child sitemap gzip files returned 403",
    "public JS reveals API/GraphQL route names but not a proven unauthenticated endpoint contract",
    "direct HTTP access became 403 after small probes"
  ],
  "sample_before_full_run": [
    "run a proper Playwright probe in an environment with Playwright installed",
    "capture network requests for one public search page",
    "verify whether JSON-LD pagination is accessible without disallowed routes",
    "avoid detail routes and API paths disallowed by robots"
  ],
  "stop_conditions": [
    "route requires login, cookies, CAPTCHA, or private tokens",
    "only disallowed /sale, /rental, or /nyc/api paths can provide the target data",
    "child sitemap access requires bypassing 403 responses"
  ],
  "recommendation": "Publish as a Yellow boundary case. StreetEasy is useful for demonstrating source discovery and restraint, not as a Green full-listing pipeline from current evidence."
}
```

## FeasibilityReport

```json
{
  "score": 48,
  "traffic_light": "Yellow",
  "interpretation": "Partial public metadata is visible, but broad active-listing collection is not justified by the probes.",
  "availability": "Public search pages and sitemap indexes exist. Search HTML includes JSON-LD listing metadata.",
  "accessibility": "Top-level pages and sitemap indexes were accessible. Listing sitemap gzip files returned 403 and robots disallows several high-value detail/API paths.",
  "structure": "JSON-LD is structured but likely first-page/search-page scoped. Public JS exposes API route strings but not a proven endpoint plan.",
  "coverage": "Unknown for broad listing inventory. Stronger for content/neighborhood/business pages than active listing data.",
  "pagination": "Not proven. Child sitemaps that could help coverage were not accessible in tiny probes.",
  "runtime": "Small samples are practical. Full runs are not recommended from current evidence.",
  "storage": "Simple if limited to JSON-LD samples or content sitemaps.",
  "risk": "Medium because robots disallows sale/rental detail and API paths and probes encountered 403s.",
  "recommended_strategy": "Use this as a source-comparison/compliance-boundary case study. Do not build a broad StreetEasy listing pipeline unless a later Playwright/network probe finds a clearly public, allowed structured route.",
  "confidence": 0.78
}
```

## PipelinePlan

```yaml
name: streeteasy_public_metadata_boundary_probe
entity: listing_or_building_snapshot
sources:
  - type: robots
    url: https://streeteasy.com/robots.txt
  - type: sitemap_index
    url: https://streeteasy.com/sitemaps/secure/nyc_sitemap_index.xml
  - type: search_html_jsonld
    url: https://streeteasy.com/for-sale/nyc
strategy: evidence-only feasibility; no full listing collection
headers:
  User-Agent: Mozilla/5.0 public-data-pipeline/0.1
  Accept: text/html,application/json,*/*
pagination:
  status: not_proven
schema:
  primary_fields:
    - source_url
    - name
    - address
    - geo
    - bedrooms
    - bathrooms
    - floor_size
limits:
  - no disallowed sale/rental detail routes
  - no /nyc/api
  - no cookies/auth/captcha/fingerprint evasion
outputs:
  - feasibility_report.md
  - sample_jsonld_rows.json
validation:
  - confirm JSON-LD parses
  - record 403s and robots restrictions
approval:
  full_run_approved: false
```

## ApprovalGate

```json
{
  "sample_validated": true,
  "full_run_approved": false,
  "recommended_next_step": "Install/run Playwright in a clean environment for one public search page to capture network evidence. Continue only if a clearly public, allowed structured route appears."
}
```

## Why This Matters

This is a useful versatility case because it is not a win-at-all-costs scraper story. The skill found public structure, sitemap signals, JSON-LD, and app route hints, then stopped when the path crossed into 403s and robots-disallowed surfaces. That is the point of public data due diligence.
