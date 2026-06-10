# Target Patchright Category Products Case Study

Run Date: 2026-06-10

## Summary

Tiny feasibility probe for Target retail category products using the repo's Patchright warm-session helper.

Final result: **Green for bounded category product discovery**, with a caveat that endpoint parameters are browser-context and location-sensitive. Patchright headless loaded a valid Target category page, observed structured Target Redsky product endpoints, and rendered product rows without CAPTCHA, login, sitemap traversal, or broad collection.

## Target

- Site: `https://www.target.com`
- Dataset: retail category product listings
- Valid probed category: `https://www.target.com/c/shirts-men-s-clothing/target-brands/-/N-5xu28Zxmf9o`
- Category shown by page: `Target Brands : Tops`
- Result count shown by page: `167 results`

## Commands

```powershell
$env:PATCHRIGHT_HEADLESS='1'
$env:PATCHRIGHT_PROBE_MAX_ROWS='15'
$env:PATCHRIGHT_SETTLE_MS='4000'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='45000'
npm run probe:patchright -- "https://www.target.com/c/men-s-shirts-clothing/-/N-5xu2t" "outputs/target-mens-shirts-patchright-endpoints.json"
```

The first URL returned Target's unavailable page with HTTP 404, so it was treated as a bad category slug rather than a source block.

```powershell
$env:PATCHRIGHT_HEADLESS='1'
$env:PATCHRIGHT_PROBE_MAX_ROWS='15'
$env:PATCHRIGHT_SETTLE_MS='4000'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='45000'
npm run probe:patchright -- "https://www.target.com/c/shirts-men-s-clothing/target-brands/-/N-5xu28Zxmf9o" "outputs/target-shirts-brands-patchright-endpoints.json"
```

## Observed Evidence

### Page

- Status: `200`
- Title: `Target Brands : Men's Shirts & Tops : Target`
- Body evidence included `Target Brands : Tops`, `167 results`, product cards, prices, ratings, fulfillment text, and add-to-cart controls.
- Sample rendered products from page text:
  - `Men's Short Sleeve 4pk Crewneck T-Shirt - Goodfellow & Co`
  - `Men's Every Wear Short Sleeve T-Shirt - Goodfellow & Co`
- JSON-LD count: `1`
- JSON-LD shape: `WebPage` plus `BreadcrumbList`; it did not contain product rows.

### Endpoint Evidence

Patchright observed structured Target endpoints during the page load:

- Sapphire runtime page shell:
  - `GET https://sapphire-api.target.com/sapphire/runtime/api/v1/raw/www.target.com/c/shirts-men-s-clothing/target-brands/-/N-5xu28Zxmf9o?...`
  - Status `200`, content type `application/json`
- CDU orchestration taxonomy/search page:
  - `GET https://cdui-orchestrations.target.com/cdui_orchestrations/v1/pages/site_taxonomy?...`
  - Status `200`, content type `application/json`
  - Parameters included category `5xu28`, applied facet `xmf9o`, count `24`, offset `0`.
- Redsky PLP search:
  - `GET https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v2?...`
  - Status `200`, content type `application/json`
  - Parameters included category `5xu28`, faceted value `xmf9o`, count `24`, offset `0`, store/location context, and visitor context.
- Redsky product summary and fulfillment:
  - `GET https://redsky.target.com/redsky_aggregations/v1/web/product_summary_with_fulfillment_v1?...`
  - Status `200`, content type `application/json`
  - Parameters included the first page TCIN list and store/location context.

Observed product summary fields from response body start:

- `tcin`
- `item.product_classification.item_type.name`
- `item.product_description.title`
- `item.enrichment.buy_url`
- `parent.tcin`
- `parent.item.product_description.title`
- `fulfillment.shipping_options.availability_status`
- `store_positions`

Sample observed TCINs from the first page request:

- `54244241`
- `54190289`
- `54244093`
- `54244119`
- `94772270`

## DatasetSpec

```json
{
  "entity": "target_category_product",
  "description": "Products listed on a public Target category page.",
  "fields": [
    "tcin",
    "parent_tcin",
    "title",
    "brand_or_source_text",
    "buy_url",
    "category_id",
    "facet_id",
    "price_or_price_text",
    "rating",
    "review_count",
    "availability_status",
    "store_or_fulfillment_context"
  ],
  "constraints": {
    "probe_limit": "first category page only",
    "location_context": "Target responses vary by zip/store context",
    "no_broad_collection": true
  },
  "refresh_frequency": "daily or slower after approval",
  "target_rows": 167,
  "budget": "small"
}
```

## SourceAccessClass

```json
{
  "class": "public",
  "is_publishable_as_public_result": true,
  "authorization_basis": "Public unauthenticated category page and public browser-observed JSON responses.",
  "secret_handling": "none",
  "allowed_outputs": [
    "endpoint templates with session-like values redacted",
    "field shapes",
    "tiny product samples",
    "run diagnostics"
  ],
  "forbidden_outputs": [
    "cookies",
    "auth tokens",
    "captcha tokens",
    "session dumps",
    "private keys",
    "raw storage state"
  ],
  "notes": "Patchright generated local browser profile/storage evidence, but storage state was not published and is not required in the case study."
}
```

## SourcePlan

```json
[
  {
    "url": "https://www.target.com/c/shirts-men-s-clothing/target-brands/-/N-5xu28Zxmf9o",
    "type": "rendered",
    "reason": "Public category page validates product count and product-card rendering.",
    "confidence": 0.9
  },
  {
    "url": "https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v2",
    "type": "xapi",
    "reason": "Observed public JSON category search endpoint during Patchright page load.",
    "confidence": 0.85
  },
  {
    "url": "https://redsky.target.com/redsky_aggregations/v1/web/product_summary_with_fulfillment_v1",
    "type": "xapi",
    "reason": "Observed public JSON enrichment endpoint for TCIN product summary and fulfillment fields.",
    "confidence": 0.8
  }
]
```

## EndpointPlan

```json
[
  {
    "name": "Target category PLP search",
    "method": "GET",
    "template": "https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v2?category={category_id}&count={count}&faceted_value={facet_id}&offset={offset}&page={page_path}&platform=desktop&pricing_store_id={store_id}&store_ids={store_ids}&visitor_id={visitor_id}&zip={zip}&key={public_key}&channel=WEB",
    "path_params": [],
    "query_params": [
      "category",
      "count",
      "faceted_value",
      "offset",
      "page",
      "platform",
      "pricing_store_id",
      "store_ids",
      "visitor_id",
      "zip",
      "key",
      "channel"
    ],
    "pagination": {
      "style": "offset",
      "observed_count": 24,
      "observed_offset": 0,
      "next_probe_needed": "offset=24 only after approval"
    },
    "field_coverage": [
      "category metadata",
      "result list",
      "TCINs",
      "related categories",
      "search metadata"
    ],
    "fallback": "Rendered DOM product cards if Redsky changes.",
    "confidence": 0.85
  },
  {
    "name": "Target product summary with fulfillment",
    "method": "GET",
    "template": "https://redsky.target.com/redsky_aggregations/v1/web/product_summary_with_fulfillment_v1?tcins={tcin_csv}&store_id={store_id}&zip={zip}&state={state}&latitude={lat}&longitude={lon}&scheduled_delivery_store_id={scheduled_store_id}&key={public_key}&channel=WEB&page={page_path}",
    "path_params": [],
    "query_params": [
      "tcins",
      "store_id",
      "zip",
      "state",
      "latitude",
      "longitude",
      "scheduled_delivery_store_id",
      "key",
      "channel",
      "page"
    ],
    "pagination": {
      "style": "batch by TCIN list from PLP search",
      "observed_batch_size": 24
    },
    "field_coverage": [
      "title",
      "buy URL",
      "parent product",
      "classification",
      "fulfillment status",
      "store position"
    ],
    "fallback": "Use PLP search body and rendered DOM if this enrichment endpoint is unavailable.",
    "confidence": 0.8
  }
]
```

## HeaderProfile

```json
{
  "required": [
    "accept",
    "accept-language",
    "origin",
    "referer"
  ],
  "optional": [
    "content-type for POST telemetry only; not needed for product GET probes"
  ],
  "forbidden": [
    "captcha tokens",
    "fingerprint headers",
    "secrets in logs",
    "raw cookies",
    "raw storage state"
  ],
  "secret_inputs": [],
  "notes": "Product endpoints were observed as GET JSON calls from a public page. Keep dynamic visitor/store/location values parameterized and do not publish local profile artifacts."
}
```

## ProbeResults

```json
[
  {
    "source": "Initial Target category slug",
    "status": 404,
    "content_type": "text/html plus JSON side calls",
    "sample_count": 0,
    "pagination": {},
    "limits": {
      "scope": "single page load"
    },
    "errors": [
      "Page unavailable; slug was not used for scoring except as a bad URL finding."
    ],
    "evidence": "outputs/target-mens-shirts-patchright-endpoints.json"
  },
  {
    "source": "Valid Target category page",
    "status": 200,
    "content_type": "text/html with JSON APIs",
    "sample_count": 2,
    "pagination": {
      "observed_total_text": "167 results",
      "observed_api_count": 24,
      "observed_api_offset": 0,
      "next_offset_not_run": 24
    },
    "limits": {
      "scope": "single category page; no broad collection"
    },
    "errors": [],
    "evidence": "outputs/target-shirts-brands-patchright-endpoints.json"
  }
]
```

## FeasibilityScorecard

```json
{
  "coverage": 8,
  "stability": 7,
  "pagination_depth": 7,
  "refreshability": 7,
  "data_quality": 8,
  "engineering_cost": "M",
  "legal_tos_risk": "medium",
  "recommended_path": "public_xapi",
  "traffic_light": "Green"
}
```

## DataAcquisitionMemo

```json
{
  "fastest_viable_route": "Use Patchright to load the public category once, capture the Redsky PLP and product summary templates, then replay tiny approved page windows with normal public headers and parameterized store/location context.",
  "cheapest_robust_route": "Prefer Redsky PLP search plus product summary JSON. Keep rendered DOM extraction as a fallback smoke check.",
  "highest_coverage_route": "Offset through PLP search in 24-product windows after explicit approval, then batch TCINs through product_summary_with_fulfillment_v1.",
  "coverage_ceiling": "Likely the page-advertised 167 products for this category/facet combination, subject to store, zip, availability, and Target ranking changes.",
  "main_trapdoors": [
    "Category URL slugs must be validated; one plausible slug returned 404.",
    "Responses vary by zip, store, visitor context, and fulfillment state.",
    "Some URL parameters are dynamic browser context and should stay parameterized.",
    "Endpoint names and public keys may change.",
    "Do not treat telemetry, cart, or anti-abuse collector calls as product data sources."
  ],
  "sample_before_full_run": [
    "Probe offset=24 once and compare unique TCIN continuity.",
    "Verify total count from PLP response, not only page text.",
    "Validate product summary rows against rendered product-card titles.",
    "Run at a fixed zip/store context for repeatability."
  ],
  "stop_conditions": [
    "CAPTCHA or human verification appears.",
    "Endpoint starts requiring authentication or private cookies.",
    "HTTP 403/429 or rate-limit signals appear.",
    "Product data requires cart/account state.",
    "Observed API no longer matches rendered public page."
  ],
  "recommendation": "Proceed to a small approved pagination validation before any full category scrape."
}
```

## FeasibilityReport

```json
{
  "score": 82,
  "traffic_light": "Green",
  "interpretation": "Feasible for bounded public category product acquisition.",
  "availability": "Products and result count are publicly visible on the category page.",
  "accessibility": "Headless Patchright loaded the page and product JSON without login or CAPTCHA.",
  "structure": "Strong structured JSON path via Redsky PLP and product summary endpoints.",
  "coverage": "First page showed 24-product API windows against 167 page-reported results.",
  "pagination": "Offset pagination is strongly implied by observed count=24 and offset=0; next offset was not probed to keep scope tiny.",
  "runtime": "Practical after approval if request rate is conservative and checkpointed.",
  "storage": "Small JSON records keyed by TCIN and parent TCIN.",
  "risk": "Medium terms and anti-abuse sensitivity; avoid session artifacts and broad unapproved runs.",
  "recommended_strategy": "public_xapi with rendered DOM verification",
  "confidence": 0.82
}
```

## PipelineQualityPlan

```json
{
  "id_strategy": "Use TCIN as row id; retain parent_tcin for variants.",
  "dedupe_strategy": "Deduplicate by TCIN per run and by parent_tcin for family-level rollups.",
  "incremental_strategy": "Refresh category offsets and compare TCIN/title/availability deltas.",
  "checkpoint_strategy": "Checkpoint category_id, facet_id, offset, zip, store_id, and timestamp.",
  "retry_backoff_strategy": "Conservative retries on transient 5xx only; stop on 403, 429, or verification page.",
  "rate_limit_strategy": "Low concurrency, cache category metadata, and no broad run without approval.",
  "schema_validation": [
    "tcin required",
    "title required",
    "buy_url should be target.com",
    "category_id must match requested category"
  ],
  "data_quality_tests": [
    "Rendered page count and API count are plausible",
    "No duplicate TCINs within page",
    "At least one product title matches rendered DOM sample",
    "Fulfillment context recorded with zip/store"
  ],
  "observability": [
    "HTTP status histogram",
    "endpoint template version",
    "row count by offset",
    "stop-condition logs"
  ],
  "failure_recovery": "Resume from last successful offset; re-warm browser context only when public templates fail.",
  "change_detection": "Alert on missing Redsky PLP endpoint, schema changes, or count collapse.",
  "secret_handling": "Do not persist or publish cookies/storage state; parameterize dynamic visitor and public key values in docs.",
  "publishability": "public_result"
}
```

## PipelinePlan

```yaml
name: target_category_products
entity: target_category_product
sources:
  - target_public_category_page
  - target_redsky_plp_search
  - target_redsky_product_summary
strategy: public_xapi_with_rendered_dom_verification
endpoint_templates:
  plp_search: redsky_aggregations/v1/web/plp_search_v2
  product_summary: redsky_aggregations/v1/web/product_summary_with_fulfillment_v1
headers:
  required:
    - accept
    - accept-language
    - origin
    - referer
params:
  category_id: 5xu28
  facet_id: xmf9o
  page_path: /c/5xu28
  count: 24
  offset: approved window only
pagination:
  type: offset
  first_offset_observed: 0
  next_offset_requires_approval: 24
schema:
  required:
    - tcin
    - title
    - buy_url
    - category_id
dedupe:
  key: tcin
checkpoints:
  - category_id
  - facet_id
  - offset
  - zip
  - store_id
limits:
  broad_collection: requires_user_approval
  stop_on:
    - captcha
    - auth_required
    - 403
    - 429
outputs:
  raw: outputs/target/raw/
  normalized: outputs/target/products.jsonl
validation:
  - compare_dom_title_sample
  - validate_unique_tcin
  - validate_count_progression
approval:
  sample_validated: true
  full_run_approved: false
```

## SampleRows

```json
[
  {
    "tcin": "54244241",
    "parent_tcin": "54264873",
    "title": "Men's Short Sleeve 4pk Crew Neck T-Shirt - Goodfellow & Co Black M: Lightweight Jersey",
    "parent_title": "Men's Short Sleeve 4pk Crewneck T-Shirt - Goodfellow & Co",
    "buy_url": "https://www.target.com/p/men-39-s-short-sleeve-4pk-crewneck-t-shirt-goodfellow-38-co-8482-black-m/-/A-54244241",
    "item_type": "Shirts",
    "source": "product_summary_with_fulfillment_v1 bodyStart"
  },
  {
    "title": "Men's Every Wear Short Sleeve T-Shirt - Goodfellow & Co",
    "price_text": "$10.00",
    "rating_text": "4.7",
    "review_count_text": "6253",
    "source": "rendered page body_text_start"
  }
]
```

## ApprovalGate

```json
{
  "sample_validated": true,
  "full_run_approved": false,
  "approved_next_step": "Optional one-page pagination validation at offset=24.",
  "not_approved": [
    "Scraping all 167 products",
    "Running multiple categories",
    "Persisting or publishing cookies/storage state",
    "Trying to bypass CAPTCHA, auth, fingerprinting, or rate limits"
  ]
}
```

## Evidence Files

- `outputs/target-mens-shirts-patchright-endpoints.json`
- `outputs/target-mens-shirts-patchright-endpoints.png`
- `outputs/target-shirts-brands-patchright-endpoints.json`
- `outputs/target-shirts-brands-patchright-endpoints.png`

Local Patchright storage/profile artifacts may have been generated under `auth/`, but they are intentionally excluded from this case study and must not be published.

