# Case Study: Travel Search Patchright Feasibility Probe

## Run Date

2026-06-10

## User Ask

Run a tiny Patchright/data-acquisition feasibility probe for public travel search results using Expedia, or a safer public travel target if Expedia blocks immediately. Do not perform broad collection, solve CAPTCHA, bypass auth, evade fingerprinting, or publish cookies/storage.

## ModeSelection

```json
{
  "mode": "warm-session-feasibility",
  "will_probe": true,
  "will_collect_beyond_sample": false,
  "runtime": "patchright",
  "primary_target": "Expedia public hotel search",
  "fallback_target": "Amtrak public booking/schedule page"
}
```

## SourceAccessClass

```json
{
  "class": "owned_session",
  "publishability": "non_public_authorized_result",
  "reason": "Patchright generated local browser storage state and local browser profiles. This case study records endpoint shapes and page evidence only; it does not include cookies, storage values, private session material, CAPTCHA-solving steps, or anti-bot bypass instructions."
}
```

## Probe Commands

Expedia hotel-search probe:

```powershell
$env:PATCHRIGHT_STORAGE_STATE='auth\worker7-expedia-travel-storage-state.json'
$env:PATCHRIGHT_USER_DATA_DIR='auth\worker7-expedia-travel-profile'
$env:PATCHRIGHT_HEADLESS='1'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='45000'
$env:PATCHRIGHT_SETTLE_MS='5000'
$env:PATCHRIGHT_PROBE_MAX_ROWS='12'
npm run probe:patchright -- "https://www.expedia.com/Hotel-Search?destination=New%20York%2C%20New%20York%2C%20United%20States%20of%20America&startDate=2026-07-01&endDate=2026-07-02&rooms=1&adults=2" "outputs/worker7-expedia-travel-search-patchright.json"
```

Safer public travel fallback probes after Expedia blocked:

```powershell
$env:PATCHRIGHT_STORAGE_STATE='auth\worker7-rome2rio-travel-storage-state.json'
$env:PATCHRIGHT_USER_DATA_DIR='auth\worker7-rome2rio-travel-profile'
$env:PATCHRIGHT_HEADLESS='1'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='45000'
$env:PATCHRIGHT_SETTLE_MS='5000'
$env:PATCHRIGHT_PROBE_MAX_ROWS='20'
npm run probe:patchright -- "https://www.rome2rio.com/map/New-York/Boston" "outputs/worker7-rome2rio-nyc-boston-patchright.json"

$env:PATCHRIGHT_STORAGE_STATE='auth\worker7-wanderu-travel-storage-state.json'
$env:PATCHRIGHT_USER_DATA_DIR='auth\worker7-wanderu-travel-profile'
$env:PATCHRIGHT_HEADLESS='1'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='45000'
$env:PATCHRIGHT_SETTLE_MS='6000'
$env:PATCHRIGHT_PROBE_MAX_ROWS='20'
npm run probe:patchright -- "https://www.wanderu.com/en-us/depart/New%20York%2C%20NY%2C%20USA/Boston%2C%20MA%2C%20USA/2026-07-01/?cur=USD" "outputs/worker7-wanderu-nyc-boston-patchright.json"
```

Official-provider fallback probe:

```powershell
$env:PATCHRIGHT_STORAGE_STATE='auth\worker7-amtrak-travel-storage-state.json'
$env:PATCHRIGHT_USER_DATA_DIR='auth\worker7-amtrak-travel-profile'
$env:PATCHRIGHT_HEADLESS='1'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='45000'
$env:PATCHRIGHT_SETTLE_MS='6000'
$env:PATCHRIGHT_PROBE_MAX_ROWS='20'
npm run probe:patchright -- "https://www.amtrak.com/tickets/departure.html?origin=NYC&destination=BOS&departureDate=2026-07-01&adults=1" "outputs/worker7-amtrak-nyc-boston-patchright.json"
```

## ProbeResults

| Target | Status | Title | Result |
|---|---:|---|---|
| Expedia hotel search | 429 | `Bot or Not?` | Blocked immediately by human/bot verification. Stopped. |
| Rome2Rio route page | 403 | `Just a moment...` | Cloudflare security verification page. Stopped. |
| Wanderu route page | 403 | `Just a moment...` | Cloudflare security verification page. Stopped. |
| Amtrak NYC to Boston booking page | 200 | `Amtrak - Reservations - Select Train` | Loaded public travel booking surface and exposed reference/schedule JSON endpoints. |

Expedia evidence:

- body text started with `Show us your human side...`
- page said it could not tell whether the visitor was human or bot
- captured structured-looking calls were challenge/telemetry oriented, including DataDome/captcha assets
- no hotel result rows, JSON-LD, or public inventory endpoint was observed

Rome2Rio and Wanderu evidence:

- both pages returned Cloudflare security verification text
- no route result rows, JSON-LD, or usable structured travel endpoint was observed
- no challenge solving or bypass was attempted

Amtrak page evidence:

- status: `200`
- final URL: `https://www.amtrak.com/tickets/departure.html?origin=NYC&destination=BOS&departureDate=2026-07-01&adults=1`
- title: `Amtrak - Reservations - Select Train`
- body text included `Select Your Trip`, `Revise Search`, `From to`, and `CONTINUE`
- JSON-LD count: `0`
- actual train inventory or priced trip rows were not visible in this tiny no-interaction capture

Observed Amtrak JSON endpoint candidates:

```json
[
  {
    "name": "csrf_token",
    "method": "GET",
    "status": 200,
    "url": "https://www.amtrak.com/libs/granite/csrf/token.json"
  },
  {
    "name": "station_reference",
    "method": "GET",
    "status": 200,
    "url": "https://www.amtrak.com/services/data.stations.json"
  },
  {
    "name": "popular_stations",
    "method": "GET",
    "status": 200,
    "url": "https://www.amtrak.com/services/data.popularstations.json"
  },
  {
    "name": "station_info",
    "method": "GET",
    "status": 200,
    "url": "https://www.amtrak.com/services/contentService.stationsinfo.json"
  },
  {
    "name": "routes_list",
    "method": "GET",
    "status": 200,
    "url": "https://www.amtrak.com/services/routes-list.json"
  },
  {
    "name": "static_fare_reference",
    "method": "GET",
    "status": 200,
    "url": "https://www.amtrak.com/content/amtrak/en-us/reference-data/static-fare/jcr:content/root/contentfragment.staticFare.json"
  },
  {
    "name": "static_mapping",
    "method": "GET",
    "status": 200,
    "url": "https://www.amtrak.com/services/staticmappingjson"
  },
  {
    "name": "global_errors",
    "method": "GET",
    "status": 200,
    "url": "https://www.amtrak.com/services/globalerrorjson"
  }
]
```

Observed Amtrak response-body signals:

```json
{
  "station_pair_reference_signal": [
    {
      "origin": "NYP",
      "destinations": ["WAS", "PHL", "BOS", "BBY", "ALB", " BAL"]
    },
    {
      "origin": "BOS",
      "destinations": ["NYP", "WAS", "PHL", "PVD", "NWK", "NHV"]
    }
  ],
  "fare_reference_signal": {
    "fare_classes": ["Sale", "Value", "Flex", "Private Rooms"],
    "content_source": "static fare reference JSON"
  },
  "global_error_signal": [
    "noTrainsError",
    "statusNoTrainsError",
    "noStatusError"
  ]
}
```

## EndpointPlan

```json
[
  {
    "name": "expedia_public_hotel_search",
    "method": "GET",
    "template": "https://www.expedia.com/Hotel-Search?...",
    "observed_status": 429,
    "usable_for_collection": false,
    "reason": "Immediate human/bot verification page; structured calls were challenge assets, not hotel inventory.",
    "traffic_light": "Red"
  },
  {
    "name": "aggregator_route_pages",
    "method": "GET",
    "templates": [
      "https://www.rome2rio.com/map/{origin}/{destination}",
      "https://www.wanderu.com/en-us/depart/{origin}/{destination}/{date}/"
    ],
    "observed_status": 403,
    "usable_for_collection": false,
    "reason": "Cloudflare security verification on tiny headless Patchright probes.",
    "traffic_light": "Red"
  },
  {
    "name": "amtrak_public_booking_page",
    "method": "GET",
    "template": "https://www.amtrak.com/tickets/departure.html?origin={origin}&destination={destination}&departureDate={yyyy-mm-dd}&adults={n}",
    "observed_status": 200,
    "extract": "Page state plus reference endpoints for stations, routes, mappings, fare classes, and booking error taxonomy.",
    "limitations": "No actual train inventory/priced trip rows captured in this tiny no-interaction pass.",
    "confidence": 0.58,
    "traffic_light": "Yellow"
  },
  {
    "name": "amtrak_station_and_route_reference_json",
    "method": "GET",
    "templates": [
      "https://www.amtrak.com/services/data.stations.json",
      "https://www.amtrak.com/services/data.popularstations.json",
      "https://www.amtrak.com/services/routes-list.json",
      "https://www.amtrak.com/services/staticmappingjson"
    ],
    "observed_status": 200,
    "extract": "Station codes, popular origin/destination pairs, route/reference metadata.",
    "confidence": 0.76,
    "traffic_light": "Yellow"
  }
]
```

## HeaderProfile

```json
{
  "runtime": "Patchright Chrome persistent context",
  "safe_headers_observed": [
    "accept",
    "accept-language",
    "content-type",
    "origin",
    "referer",
    "x-requested-with"
  ],
  "do_not_publish": [
    "cookies",
    "storage state",
    "local profile data",
    "challenge tokens",
    "fingerprint material",
    "analytics identifiers"
  ]
}
```

## Key Finding

Expedia is not a viable public travel-search target from this environment without crossing an access-control boundary. It returned a `429` human/bot verification page immediately. Rome2Rio and Wanderu also blocked tiny probes with Cloudflare verification pages.

The safer fallback is an official-provider page. Amtrak loaded with status `200` and exposed several public JSON endpoints for station, route, fare-reference, and booking UI metadata. That is enough to prove a travel data path exists, but not enough to claim full search-result inventory or pricing collection. A later approved probe would need one bounded interactive sample or a documented official/API route for availability.

## FeasibilityScorecard

```json
{
  "coverage": 4,
  "stability": 5,
  "pagination_depth": 2,
  "refreshability": 5,
  "data_quality": 5,
  "engineering_cost": "M",
  "legal_tos_risk": "medium",
  "recommended_path": "official_provider_reference_endpoints_first_then_approved_interactive_availability_sample",
  "traffic_light": "Yellow"
}
```

## DataAcquisitionMemo

```json
{
  "fastest_viable_route": "Use Amtrak public station/route/reference JSON endpoints for a small travel-domain sample, then seek approval before any interactive availability probe.",
  "cheapest_robust_route": "Avoid Expedia/Rome2Rio/Wanderu from this environment. Prefer official provider endpoints or licensed/official APIs for inventory and prices.",
  "highest_coverage_route": "Use an official travel API or partner/licensed feed for availability/pricing; supplement with public reference JSON only for station and route metadata.",
  "main_trapdoors": [
    "Expedia returned 429 human/bot verification immediately",
    "Rome2Rio and Wanderu returned Cloudflare security verification",
    "Amtrak loaded but did not expose priced trip rows in the tiny no-interaction capture",
    "travel availability/pricing changes frequently and needs freshness guarantees"
  ],
  "stop_conditions": [
    "CAPTCHA or human-verification challenge appears",
    "route requires anti-bot bypass, fingerprint evasion, private tokens, login, payment flow, or rate-limit bypass",
    "availability probe begins entering passenger/payment/account flows"
  ],
  "recommendation": "Mark generic travel aggregator scraping as Red from this environment. Keep official-provider Amtrak reference and schedule exploration as Yellow until a bounded approved availability sample proves actual trip rows."
}
```

## FeasibilityReport

```json
{
  "final_decision": "Yellow",
  "why_not_green": "A safer official-provider page loaded and exposed useful public JSON, but the tiny probe did not capture actual priced itinerary rows.",
  "why_not_red": "The Amtrak fallback provides real public travel-reference endpoints and a plausible path for a bounded follow-up.",
  "approved_for_full_collection": false
}
```

## PipelineQualityPlan

```json
{
  "quality_gates_before_any_full_run": [
    "prove exact availability endpoint or official API route with one bounded sample",
    "separate reference data from volatile availability/pricing data",
    "record request date, route, direction, passenger count, and fare assumptions",
    "dedupe by carrier, train/service number if present, origin, destination, departure datetime, and fare class",
    "stop on challenge, auth, payment, or account boundaries"
  ],
  "observability": [
    "status-code histogram",
    "challenge-page detector",
    "empty-result detector",
    "schema drift report",
    "sample row validation"
  ]
}
```

## PipelinePlan

```json
{
  "not_approved_to_run": true,
  "candidate_steps": [
    "Fetch Amtrak station and route reference JSON with normal browser-style headers.",
    "Normalize station codes and route pair references.",
    "After approval, run one interactive public availability sample for one route/date if it does not cross auth or challenge boundaries.",
    "If actual trip rows are captured, design a small checkpointed collector with strict route/date limits."
  ],
  "storage_layers": [
    "raw_endpoint_reports",
    "staged_station_route_reference",
    "normalized_travel_reference",
    "optional_approved_availability_samples"
  ]
}
```

## SampleRows

No inventory/priced travel result rows were collected.

Tiny reference-only sample from observed Amtrak endpoint bodies:

```json
[
  {
    "origin": "NYP",
    "destination_sample": "BOS",
    "source": "Amtrak station-pair/reference JSON",
    "row_type": "route_reference"
  },
  {
    "origin": "BOS",
    "destination_sample": "NYP",
    "source": "Amtrak station-pair/reference JSON",
    "row_type": "route_reference"
  },
  {
    "fare_class": "Value",
    "source": "Amtrak static fare reference JSON",
    "row_type": "fare_reference"
  }
]
```

## ApprovalGate

```json
{
  "sample_validated": true,
  "full_run_approved": false,
  "approved_next_step_required": "Ask before running any interactive Amtrak availability sample or any broader route/date sweep.",
  "do_not_run_without_approval": [
    "Expedia retry attempts",
    "Cloudflare or DataDome challenge handling",
    "route/date sweeps",
    "fare or inventory collection at scale"
  ]
}
```

## Evidence Files

Evidence was generated locally under `outputs/` and is ignored by git:

- `outputs/worker7-expedia-travel-search-patchright.json`
- `outputs/worker7-expedia-travel-search-patchright.png`
- `outputs/worker7-rome2rio-nyc-boston-patchright.json`
- `outputs/worker7-rome2rio-nyc-boston-patchright.png`
- `outputs/worker7-wanderu-nyc-boston-patchright.json`
- `outputs/worker7-wanderu-nyc-boston-patchright.png`
- `outputs/worker7-amtrak-nyc-boston-patchright.json`
- `outputs/worker7-amtrak-nyc-boston-patchright.png`

Local browser profiles and storage state were generated under `auth/` and must not be published.

## Final Traffic Light

Yellow.

Generic travel aggregators are Red from this environment because they immediately present bot/human verification. Official-provider travel reference data is Yellow: Amtrak produced public JSON endpoint evidence, but the tiny Patchright probe did not prove actual live itinerary/pricing extraction.
