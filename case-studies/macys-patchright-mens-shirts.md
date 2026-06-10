# Case Study: Macy's Patchright Men's Shirts Probe

## Run Date

2026-06-10

## User Ask

Test whether the updated skill actually uses Patchright on Macy's and whether a men's shirts scrape would use the category API endpoint rather than sitemaps.

## ModeSelection

```json
{
  "mode": "warm-session-feasibility",
  "will_probe": true,
  "will_collect_beyond_sample": false,
  "runtime": "patchright",
  "target": "Macy's men's shirts category"
}
```

## SourceAccessClass

```json
{
  "class": "owned_session",
  "publishability": "non_public_authorized_result",
  "reason": "Patchright generated local browser storage state and a local browser profile. Reports redact storage paths and do not publish cookies or storage values."
}
```

## Probe Commands

Headless probe:

```powershell
$env:PATCHRIGHT_STORAGE_STATE='auth\macys-mens-shirts-storage-state.json'
$env:PATCHRIGHT_USER_DATA_DIR='auth\macys-mens-shirts-profile'
$env:PATCHRIGHT_HEADLESS='1'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='60000'
$env:PATCHRIGHT_SETTLE_MS='6000'
npm run probe:patchright -- "https://www.macys.com/shop/mens-clothing/mens-shirts?id=20626" "outputs/macys-mens-shirts-patchright-endpoints.json"
```

Visible probe:

```powershell
$env:PATCHRIGHT_STORAGE_STATE='auth\macys-mens-shirts-visible-storage-state.json'
$env:PATCHRIGHT_USER_DATA_DIR='auth\macys-mens-shirts-visible-profile'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='60000'
$env:PATCHRIGHT_SETTLE_MS='8000'
npm run probe:patchright -- "https://www.macys.com/shop/mens-clothing/mens-shirts?id=20626" "outputs/macys-mens-shirts-patchright-visible-endpoints.json"
```

Page 2 probe:

```powershell
npm run probe:patchright -- "https://www.macys.com/shop/mens/clothing/shirts/Pageindex/2?id=20626" "outputs/macys-mens-shirts-page2-patchright-visible-endpoints.json"
```

## ProbeResults

| Probe | Status | Final URL | Result |
|---|---:|---|---|
| Headless Patchright | 403 | `https://www.macys.com/shop/mens-clothing/mens-shirts?id=20626` | Access Denied page |
| Visible Patchright | 200 | `https://www.macys.com/shop/mens/clothing/shirts?id=20626` | Real product grid loaded |
| Visible Patchright page 2 | 200 | `https://www.macys.com/shop/mens/clothing/shirts/Pageindex/2?id=20626` | Page 2 loaded |

Visible page 1 evidence:

- title: `Men's Shirts & Tops | Macy's`
- body text included `Men's Shirts & Tops` and `(500+)`
- body text included real product cards such as `HUGO by Hugo Boss Men's Dapolino Logo T-Shirt`
- JSON-LD contained breadcrumbs for category `20626`
- product grid HTML contained product IDs and product links
- next-page link observed: `https://www.macys.com/shop/mens/clothing/shirts/Pageindex/2?id=20626`

## EndpointPlan

```json
[
  {
    "name": "visible_category_page",
    "method": "GET",
    "template": "https://www.macys.com/shop/mens/clothing/shirts/Pageindex/{page}?id=20626",
    "observed_status": 200,
    "extract": "Product card HTML, product IDs, product names, product URLs, price text, image URLs, pagination links",
    "confidence": 0.82
  },
  {
    "name": "category_api",
    "method": "GET",
    "template": "not observed during page load",
    "observed_status": null,
    "extract": "No product-grid category API call was captured in page 1 or page 2 visible Patchright probes.",
    "confidence": 0.2
  }
]
```

## Key Finding

Patchright works for Macy's only in visible Chrome mode. Headless Chrome reached Macy's access-denied page, while visible Patchright loaded the public category page and generated local browser state.

The men's shirts product grid did **not** come from an observed category API endpoint during the tested page loads. The useful product data appeared in the initial document/SSR-rendered page HTML, with ordinary pagination URLs for page 2 and beyond.

Macy's telemetry config referenced `/xapi/discover/v1/page?pathname`, but neither page 1 nor page 2 issued that endpoint in the captured network. The current high-level route is therefore:

```text
Patchright visible category page -> SSR product grid HTML -> page links -> product IDs and product card metadata
```

not:

```text
Patchright visible category page -> category API endpoint
```

## FeasibilityScorecard

```json
{
  "coverage": 7,
  "stability": 6,
  "pagination_depth": 7,
  "refreshability": 6,
  "data_quality": 6,
  "engineering_cost": "M",
  "legal_tos_risk": "medium",
  "recommended_path": "rendered_or_ssr_category_pages",
  "traffic_light": "Yellow"
}
```

## DataAcquisitionMemo

```json
{
  "fastest_viable_route": "Use Patchright visible mode to load category pages and parse SSR product card HTML for a bounded sample.",
  "cheapest_robust_route": "Use public category pagination for product tile metadata and keep PDP sitemap/product detail XAPI as enrichment/fallback paths from the older Macy's case study.",
  "highest_coverage_route": "Combine category-page pagination with PDP sitemap product discovery and checkpointed product detail enrichment.",
  "main_trapdoors": [
    "headless Patchright returned 403",
    "no category product API endpoint was observed during page load",
    "visible browser state is local-only and non-public",
    "broad pagination should be approved and paced"
  ],
  "stop_conditions": [
    "route requires CAPTCHA solving, account login, cart, checkout, private headers, or rate-limit bypass",
    "visible page starts returning access denied repeatedly"
  ],
  "recommendation": "Keep this as a Patchright warm-session proof. It proves the skill can get category products without sitemap, but it should not claim category API usage for this Macy's category."
}
```

## ApprovalGate

```json
{
  "sample_validated": true,
  "full_run_approved": false,
  "recommended_next_step": "Do not run all Macy's men's shirts yet. If approved later, run bounded pagination with checkpointing and compare SSR product cards against product detail XAPI samples."
}
```

## Evidence Files

Evidence was generated locally under `outputs/` and is ignored by git:

- `outputs/macys-mens-shirts-patchright-endpoints.json`
- `outputs/macys-mens-shirts-patchright-visible-endpoints.json`
- `outputs/macys-mens-shirts-page2-patchright-visible-endpoints.json`
- `outputs/macys-mens-shirts-visible-page.html`
- `outputs/macys-mens-shirts-visible-all-network.json`

Local browser profiles and storage state were generated under `auth/` and must not be published.
