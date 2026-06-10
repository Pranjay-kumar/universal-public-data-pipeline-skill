# Case Study: StreetEasy Patchright LES Rentals Probe

## Run Date

2026-06-10

## User Ask

Test StreetEasy with Patchright to see whether the skill can get all Lower East Side apartments without going through sitemaps.

## ModeSelection

```json
{
  "mode": "warm-session-feasibility",
  "will_probe": true,
  "will_collect_beyond_sample": false,
  "runtime": "patchright",
  "target": "StreetEasy Lower East Side rentals"
}
```

## SourceAccessClass

```json
{
  "class": "owned_session",
  "publishability": "non_public_authorized_result",
  "reason": "Patchright generated local browser storage state and a local browser profile. The case study includes endpoint shapes and field observations but no cookies, storage values, private session data, or CAPTCHA-solving instructions."
}
```

## Probe Commands

Initial wrong-slug probes:

```powershell
npm run probe:patchright -- "https://streeteasy.com/for-rent/lower-east-side" "outputs/streeteasy-les-rentals-patchright-endpoints.json"
npm run probe:patchright -- "https://streeteasy.com/for-rent/lower-east-side-nyc" "outputs/streeteasy-les-rentals-current-patchright-endpoints.json"
```

Valid LES slug probe:

```powershell
$env:PATCHRIGHT_STORAGE_STATE='auth\streeteasy-les-storage-state.json'
$env:PATCHRIGHT_USER_DATA_DIR='auth\streeteasy-les-profile'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='60000'
$env:PATCHRIGHT_SETTLE_MS='10000'
npm run probe:patchright -- "https://streeteasy.com/for-rent/les" "outputs/streeteasy-les-patchright-endpoints.json"
```

## ProbeResults

| Probe | Status | Final URL | Result |
|---|---:|---|---|
| `/for-rent/lower-east-side` | 404 | same | Wrong slug; no listings |
| `/for-rent/lower-east-side-nyc` | 404 | same | Wrong slug; no listings |
| `/for-rent/les` | 200 | `https://streeteasy.com/for-rent/les` | Real LES rentals page loaded |

Valid page evidence:

- title: `Lower East Side, Manhattan NY Apartments for Rent - Updated Daily | StreetEasy`
- body text included `196 Lower East Side, Manhattan NY Apartments for Rent`
- JSON-LD contained `Apartment` entities
- pagination links included `?page=2`, `?page=3`, `?page=18`, and `Next Page`
- Patchright captured a structured `https://api-v6.streeteasy.com/` response containing `searchRentals`

Structured response evidence:

```json
{
  "url": "https://api-v6.streeteasy.com/",
  "status": 200,
  "content_type": "application/json",
  "body_signal": "searchRentals",
  "totalCount": 196,
  "sample_fields": [
    "id",
    "areaName",
    "bedroomCount",
    "buildingType",
    "fullBathroomCount",
    "geoPoint",
    "halfBathroomCount",
    "leadMedia.photo.key",
    "price",
    "sourceGroupLabel",
    "status",
    "street",
    "unit",
    "urlPath",
    "tier"
  ]
}
```

Sample structured listing IDs from the captured response snippet:

```json
[
  {
    "id": "4946711",
    "urlPath": "/building/the-suffolk/703",
    "price": 5300
  },
  {
    "id": "4979781",
    "urlPath": "/building/one-manhattan-square/16h",
    "price": 8650
  },
  {
    "id": "4989828",
    "urlPath": "/building/one-manhattan-square/17n",
    "price": 5100
  },
  {
    "id": "4993123",
    "urlPath": "/building/204-forsyth-street-new_york/3s",
    "price": 14995
  }
]
```

Sample JSON-LD listings from the public page:

```json
[
  {
    "name": "11 Stanton Street #3D",
    "url": "https://streeteasy.com/building/11-stanton-street-new_york/3d",
    "bedrooms": 1,
    "bathrooms_total": 1,
    "street_address": "11 Stanton Street",
    "neighborhood": "Lower East Side",
    "postal_code": "10002",
    "latitude": 40.7224,
    "longitude": -73.9925
  },
  {
    "name": "125 Delancey Street #1107",
    "url": "https://streeteasy.com/building/the-essex/1107",
    "bedrooms": 1,
    "bathrooms_total": 1,
    "street_address": "125 Delancey Street",
    "neighborhood": "Lower East Side",
    "postal_code": "10002",
    "latitude": 40.7179,
    "longitude": -73.9881
  }
]
```

## EndpointPlan

```json
[
  {
    "name": "public_les_rentals_page",
    "method": "GET",
    "template": "https://streeteasy.com/for-rent/les?page={page}",
    "pagination": {
      "observed_links": ["?page=2", "?page=3", "?page=18", "Next Page"],
      "observed_total_count": 196
    },
    "extract": "JSON-LD Apartment graph and visible listing cards",
    "confidence": 0.78
  },
  {
    "name": "api_v6_search_rentals",
    "method": "unknown from redacted helper report",
    "template": "https://api-v6.streeteasy.com/",
    "pagination": {
      "observed_total_count": 196,
      "request_shape": "not fully captured because repeat deep capture hit access-denied challenge"
    },
    "extract": "searchRentals nodes with listing IDs, prices, geo points, street/unit, status, and URL paths",
    "confidence": 0.65
  }
]
```

## Key Finding

StreetEasy currently works better than the older StreetEasy case study suggested, but only when using the correct public slug and only for tiny probes.

The useful path is:

```text
Patchright visible page -> public LES rentals page -> JSON-LD + api-v6 searchRentals response -> pagination links
```

not:

```text
sitemap child files
```

However, repeated probing is fragile. A second deeper probe intended to capture the exact `api-v6` request body returned:

```text
Access to this page has been denied
Press & Hold to confirm you are a human (and not a bot).
```

No CAPTCHA solving, challenge handling, fingerprint evasion, or bypass behavior should be added.

## FeasibilityScorecard

```json
{
  "coverage": 7,
  "stability": 4,
  "pagination_depth": 7,
  "refreshability": 4,
  "data_quality": 8,
  "engineering_cost": "M",
  "legal_tos_risk": "medium",
  "recommended_path": "public_search_page_jsonld_plus_observed_api_v6",
  "traffic_light": "Yellow"
}
```

## DataAcquisitionMemo

```json
{
  "fastest_viable_route": "Use Patchright visible mode on https://streeteasy.com/for-rent/les and parse JSON-LD plus visible listing cards for a tiny sample.",
  "cheapest_robust_route": "Use public paginated search pages and JSON-LD if pages remain accessible; treat api-v6 as observed evidence but do not rely on uncaptured private request shape.",
  "highest_coverage_route": "If approved, test page 2 and page 18 once each, with long cool-downs, to validate whether pagination covers the observed totalCount of 196.",
  "main_trapdoors": [
    "wrong URL slugs return 404",
    "plain HTTP probes return 403 on many StreetEasy URLs",
    "repeat Patchright probing triggered PerimeterX human-verification page",
    "robots-disallowed detail/API paths remain out of scope",
    "api-v6 exact request shape was not captured before access denial"
  ],
  "stop_conditions": [
    "human-verification or CAPTCHA page appears",
    "route requires login, cookies from a private account, private tokens, or bypass behavior",
    "only disallowed detail or API paths can provide the desired fields"
  ],
  "recommendation": "Keep this as a Yellow case. It proves Patchright can get Lower East Side apartment data without sitemaps, but broad collection of all 196 should wait for explicit approval and careful pacing."
}
```

## ApprovalGate

```json
{
  "sample_validated": true,
  "full_run_approved": false,
  "recommended_next_step": "Do not scrape all 196 yet. If approved, validate one additional page after a cool-down and stop immediately on any access-denied or human-verification page."
}
```

## Evidence Files

Evidence was generated locally under `outputs/` and is ignored by git:

- `outputs/streeteasy-les-patchright-endpoints.json`
- `outputs/streeteasy-les-page-snapshot.json`
- `outputs/streeteasy-les-page.html`
- `outputs/streeteasy-les-api-capture.json`

Local browser profiles and storage state were generated under `auth/` and must not be published.
