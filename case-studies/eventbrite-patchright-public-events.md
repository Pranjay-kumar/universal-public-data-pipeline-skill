# Case Study: Eventbrite Patchright Public Events Probe

## Run Date

2026-06-10

## User Ask

Run a tiny Patchright/data-acquisition feasibility probe for Eventbrite public event listings. Keep the probe bounded, avoid broad collection, do not solve CAPTCHA or bypass access controls, and write a case study for case 4.

## ModeSelection

```json
{
  "mode": "warm-session-feasibility",
  "will_probe": true,
  "will_collect_beyond_sample": false,
  "runtime": "patchright",
  "target": "Eventbrite public events page for New York"
}
```

## DatasetNeed

```json
{
  "decision_or_workflow": "Determine whether public Eventbrite city/event listing pages expose enough structured data for a reusable event discovery pipeline.",
  "entity_grain": "public_event_listing_snapshot",
  "required_fields": [
    "event_id",
    "name",
    "event_url",
    "start_date_or_time",
    "venue_name",
    "locality",
    "region",
    "organizer_name",
    "price_or_ticket_status",
    "observed_at"
  ],
  "nice_to_have_fields": [
    "description",
    "image_url",
    "latitude",
    "longitude",
    "category_or_bucket",
    "continuation_token",
    "save_count_or_social_fields"
  ],
  "freshness": "daily or weekly depending on event discovery use case",
  "history": "snapshot history with first_seen, last_seen, and removed_at",
  "coverage_target": "selected public Eventbrite city/category pages, not all Eventbrite events",
  "exclusions": [
    "private events",
    "logged-in user saves or tickets",
    "checkout or attendee data",
    "organizer dashboards"
  ],
  "useless_if": [
    "public pages stop exposing event IDs",
    "API continuation tokens cannot be replayed safely within normal browser context",
    "results are materially personalized by private user state"
  ]
}
```

## SourceAccessClass

```json
{
  "class": "public_unauthenticated_with_local_warm_session",
  "publishability": "case_study_summary_public; cookies_and_storage_non_public",
  "reason": "The tested page was a public Eventbrite city listing and loaded without login. Patchright generated local browser profile/storage state during the probe, so local auth/storage files must not be published."
}
```

## Probe Commands

Patchright helper probe:

```powershell
$env:PATCHRIGHT_STORAGE_STATE='auth\eventbrite-public-events-storage-state.json'
$env:PATCHRIGHT_USER_DATA_DIR='auth\eventbrite-public-events-profile'
$env:PATCHRIGHT_HEADLESS='1'
$env:PATCHRIGHT_PROBE_MAX_ROWS='15'
$env:PATCHRIGHT_PROBE_TIMEOUT_MS='60000'
$env:PATCHRIGHT_SETTLE_MS='6000'
npm run probe:patchright -- "https://www.eventbrite.com/d/ny--new-york/events/" "outputs/eventbrite-public-events-patchright-headless.json"
```

Bounded evidence snapshot:

```powershell
# One same-page Patchright snapshot captured complete JSON-LD and only Eventbrite
# destination API response bodies into ignored local outputs.
node --input-type=module
```

Parsed evidence summary:

```powershell
node -e "const fs=require('fs'); const a=JSON.parse(fs.readFileSync('outputs/eventbrite-public-events-api-bodies.json','utf8')); /* summarize destination endpoint evidence */"
```

## ProbeResults

| Probe | Status | Final URL | Result |
|---|---:|---|---|
| Headless Patchright helper | 200 | `https://www.eventbrite.com/d/ny--new-york/events/` | Public New York events page loaded |
| Bounded Patchright snapshot | 200 | `https://www.eventbrite.com/d/ny--new-york/events/` | Captured JSON-LD, visible event links, and three Eventbrite destination API responses |

Page evidence:

- title: `New York, NY Events, Calendar & Tickets | Eventbrite`
- body text included `Best events in New York`
- body text included visible listings such as `IronStrength on the Intrepid Flight Deck with Tone House and Strong NY`, `Albany Career Fair`, and `2026 Prospect Park Soiree`
- JSON-LD count: `1`
- helper captured `285` network requests and `285` responses during the bounded page load
- no CAPTCHA or login gate was observed in this run

JSON-LD sample:

```json
[
  {
    "position": 1,
    "name": "IronStrength on the Intrepid Flight Deck with Tone House and Strong NY",
    "url": "https://www.eventbrite.com/e/ironstrength-on-the-intrepid-flight-deck-with-tone-house-and-strong-ny-tickets-1987019434618",
    "startDate": "2026-06-15",
    "endDate": "2026-06-15",
    "venue": "Intrepid Museum",
    "locality": "New York",
    "region": "NY",
    "postal": "10036",
    "lat": "40.7648801",
    "lon": "-74.0008306"
  },
  {
    "position": 2,
    "name": "Albany Career Fair",
    "url": "https://www.eventbrite.com/e/albany-career-fair-tickets-1115002686049",
    "startDate": "2026-06-19",
    "endDate": "2026-06-19",
    "venue": "Marriott",
    "locality": "New York",
    "region": "NY",
    "postal": "10006"
  }
]
```

Observed Eventbrite destination endpoints:

| Endpoint | Method | Status | Evidence |
|---|---|---:|---|
| `https://www.eventbrite.com/api/v3/destination/events/?event_ids=...&expand=...&page_size=50&include_parent_events=true` | GET | 200 | Returned `pagination` and `events`; `object_count: 4`, `eventCount: 4` |
| `https://www.eventbrite.com/api/v3/destination/search/` | POST | 200 | Returned `events.pagination.object_count: 10000`, `page_size: 4`, and continuation token `eyJwYWdlIjoyfQ` |
| `https://www.eventbrite.com/api/v3/destination/city-browse/` | POST | 200 | Returned city browse content with `16` buckets |

POST body templates observed:

```json
[
  {
    "endpoint": "/api/v3/destination/search/",
    "method": "POST",
    "body_start": {
      "browse_surface": "browse",
      "event_search": {
        "page_size": 4,
        "dates": ["current_future"],
        "point_radius": {
          "radius": "5mi",
          "latitude": 40.7151,
          "longitude": -73.984
        }
      }
    }
  },
  {
    "endpoint": "/api/v3/destination/city-browse/",
    "method": "POST",
    "body": {
      "place_id": "85977539",
      "online_events_only": false,
      "expand.destination_event": [
        "event_sales_status",
        "image",
        "primary_venue",
        "saves",
        "series",
        "ticket_availability",
        "primary_organizer"
      ]
    }
  }
]
```

API sample rows:

```json
[
  {
    "event_id": "1987019434618",
    "name": "IronStrength on the Intrepid Flight Deck with Tone House and Strong NY",
    "url": "https://www.eventbrite.com/e/ironstrength-on-the-intrepid-flight-deck-with-tone-house-and-strong-ny-tickets-1987019434618",
    "venue": "Intrepid Museum",
    "organizer": "Dr. Jordan Metzl",
    "minimum_ticket_price": "0.00 USD"
  },
  {
    "event_id": "1115002686049",
    "name": "Albany Career Fair",
    "url": "https://www.eventbrite.com/e/albany-career-fair-tickets-1115002686049",
    "venue": "Marriott",
    "organizer": "Career Fair Connection",
    "minimum_ticket_price": "0.00 USD"
  },
  {
    "event_id": "1982394380958",
    "name": "2026 Prospect Park Soiree",
    "url": "https://www.eventbrite.com/e/2026-prospect-park-soiree-tickets-1982394380958",
    "venue": "Prospect Park Peninsula",
    "organizer": "Prospect Park Alliance"
  }
]
```

City browse buckets sample:

```json
[
  {
    "key": "neighbourhood_events",
    "name": "Explore by neighbourhood",
    "type": "event",
    "eventCount": 4
  },
  {
    "key": "nightlife_events",
    "name": "After 8pm",
    "type": "event",
    "eventCount": 4,
    "seeMore": "https://www.eventbrite.com/b/ny--new-york/nightlife/"
  },
  {
    "key": "best_of_city_events",
    "name": "Editor's Picks",
    "type": "event",
    "eventCount": 8
  }
]
```

## EndpointPlan

```json
[
  {
    "name": "public_city_page",
    "method": "GET",
    "template": "https://www.eventbrite.com/d/{state-or-country}--{city}/events/",
    "observed_status": 200,
    "extract": "JSON-LD event list, visible event links, event IDs, page context, public city/place signals",
    "confidence": 0.82
  },
  {
    "name": "destination_city_browse",
    "method": "POST",
    "template": "https://www.eventbrite.com/api/v3/destination/city-browse/",
    "observed_status": 200,
    "extract": "City buckets, category buckets, event IDs, organizer/venue/image/ticket availability expansions",
    "confidence": 0.78
  },
  {
    "name": "destination_search",
    "method": "POST",
    "template": "https://www.eventbrite.com/api/v3/destination/search/",
    "observed_status": 200,
    "extract": "Search result events, pagination metadata, continuation token",
    "confidence": 0.75
  },
  {
    "name": "destination_events_by_ids",
    "method": "GET",
    "template": "https://www.eventbrite.com/api/v3/destination/events/?event_ids={comma_separated_ids}&expand={fields}&page_size=50&include_parent_events=true",
    "observed_status": 200,
    "extract": "Hydrated event details for IDs discovered from page, JSON-LD, city-browse, or search",
    "confidence": 0.84
  }
]
```

## HeaderProfile

```json
{
  "required_observed": [
    "accept",
    "accept-language",
    "referer",
    "x-requested-with"
  ],
  "required_for_post_observed": [
    "content-type",
    "origin"
  ],
  "forbidden": [
    "cookies in published artifacts",
    "auth tokens",
    "captcha tokens",
    "private user headers"
  ],
  "notes": "The helper only reports allowlisted browser-style headers. Cookies and storage state were generated locally and are not included in this case study."
}
```

## Key Finding

Eventbrite is a strong public-events candidate for the skill. Headless Patchright loaded the public city listing page successfully and observed both structured page data and useful Eventbrite API calls.

The safest minimal path is:

```text
Patchright public city page -> JSON-LD event list -> event detail URLs and IDs
```

The richer path is:

```text
Patchright public city page -> observed destination API templates -> city/search buckets -> event IDs -> destination/events hydration endpoint
```

The richer route should be treated as an undocumented public web API path. It is technically viable for bounded probes, but broad collection should wait for approval, pacing, and monitoring.

## FeasibilityScorecard

```json
{
  "coverage": 8,
  "stability": 7,
  "pagination_depth": 6,
  "refreshability": 7,
  "data_quality": 8,
  "engineering_cost": "M",
  "legal_tos_risk": "medium",
  "recommended_path": "patchright_public_page_plus_json_ld_and_observed_destination_api",
  "traffic_light": "Yellow"
}
```

## DataAcquisitionMemo

```json
{
  "fastest_viable_route": "Use Patchright to load selected public city/category pages and parse JSON-LD plus visible event links for a small sample.",
  "cheapest_robust_route": "Use JSON-LD and event detail URLs as the stable baseline, then hydrate event IDs through the observed destination/events endpoint only when needed.",
  "highest_coverage_route": "Use city-browse and destination/search POST templates with continuation tokens, bounded page sizes, checkpointing, and conservative pacing.",
  "main_trapdoors": [
    "destination/search and city-browse are undocumented internal web endpoints",
    "search reported object_count 10000, which may be a cap or broad estimate rather than a completeness guarantee",
    "POST body templates include place IDs and geo parameters that must be derived carefully per market",
    "local Patchright storage state must stay private",
    "broad collection may create legal/TOS and rate-limit risk"
  ],
  "stop_conditions": [
    "CAPTCHA, human verification, login wall, or access-denied page appears",
    "endpoint requires private cookies, auth headers, or fingerprint bypass",
    "pagination becomes unstable or materially personalized",
    "responses show rate limiting or abnormal error rates"
  ],
  "recommendation": "Proceed only with bounded sample validation next. Do not claim full Eventbrite coverage from this single city probe."
}
```

## FeasibilityReport

```json
{
  "final_decision": "Yellow",
  "why_not_green": "The public page and observed endpoints work cleanly, but the richest route depends on undocumented internal APIs and continuation behavior that needs more bounded validation.",
  "why_not_red": "A public unauthenticated page returned structured JSON-LD and Eventbrite API responses with event IDs, venues, organizers, prices, and pagination signals.",
  "next_validation": [
    "Probe one category page such as free events or music events",
    "Replay one continuation token inside the same normal browser context",
    "Compare JSON-LD rows against destination/events hydrated rows",
    "Confirm dedupe keys and removed-event behavior across two snapshots"
  ]
}
```

## PipelineQualityPlan

```json
{
  "dedupe_key": "eventbrite_event_id",
  "quality_gates": [
    "event_id and event_url present",
    "name present",
    "start date present when available",
    "venue or online-event marker present",
    "source page and observed_at recorded",
    "no private cookies or storage serialized into outputs"
  ],
  "observability": [
    "status code counts by endpoint",
    "events per page or bucket",
    "continuation token count",
    "duplicate event rate",
    "missing required field rate"
  ],
  "recovery": [
    "checkpoint by city/category and continuation token",
    "fallback from API hydration to JSON-LD/page links",
    "stop on CAPTCHA/login/rate-limit signals"
  ]
}
```

## PipelinePlan

```json
{
  "full_run_approved": false,
  "bounded_pipeline_shape": [
    "Load one approved public city/category URL with Patchright",
    "Extract JSON-LD event IDs and URLs",
    "Capture observed destination API request templates",
    "Optionally hydrate only discovered IDs through destination/events",
    "Normalize to event_listing_snapshot rows",
    "Write raw endpoint evidence, staged rows, normalized rows, and run report"
  ],
  "rate_strategy": "single-city/sample-first, low concurrency, checkpointed, stop on abnormal responses",
  "storage_policy": "raw public responses can be stored locally; cookies, browser profile, and storage state stay in ignored auth paths and are not published"
}
```

## SampleRows

```json
[
  {
    "event_id": "1987019434618",
    "name": "IronStrength on the Intrepid Flight Deck with Tone House and Strong NY",
    "event_url": "https://www.eventbrite.com/e/ironstrength-on-the-intrepid-flight-deck-with-tone-house-and-strong-ny-tickets-1987019434618",
    "start_date": "2026-06-15",
    "venue_name": "Intrepid Museum",
    "locality": "New York",
    "region": "NY",
    "organizer_name": "Dr. Jordan Metzl",
    "minimum_ticket_price": "0.00 USD"
  },
  {
    "event_id": "1115002686049",
    "name": "Albany Career Fair",
    "event_url": "https://www.eventbrite.com/e/albany-career-fair-tickets-1115002686049",
    "start_date": "2026-06-19",
    "venue_name": "Marriott",
    "locality": "New York",
    "region": "NY",
    "organizer_name": "Career Fair Connection",
    "minimum_ticket_price": "0.00 USD"
  },
  {
    "event_id": "1982394380958",
    "name": "2026 Prospect Park Soiree",
    "event_url": "https://www.eventbrite.com/e/2026-prospect-park-soiree-tickets-1982394380958",
    "start_date": "2026-06-20",
    "venue_name": "Prospect Park Peninsula",
    "locality": "Brooklyn",
    "region": "NY",
    "organizer_name": "Prospect Park Alliance"
  }
]
```

## ApprovalGate

```json
{
  "sample_validated": true,
  "full_run_approved": false,
  "recommended_next_step": "Wait for user approval before any broader Eventbrite run. If approved, run one additional bounded category or continuation-token validation before designing collection."
}
```

## Evidence Files

Evidence was generated locally under `outputs/` and is ignored by git:

- `outputs/eventbrite-public-events-patchright-headless.json`
- `outputs/eventbrite-public-events-patchright-headless.png`
- `outputs/eventbrite-public-events-snapshot.json`
- `outputs/eventbrite-public-events-api-bodies.json`

Local browser profile and storage state were generated under `auth/` and must not be published:

- `auth/eventbrite-public-events-profile`
- `auth/eventbrite-public-events-storage-state.json`

## Final Verdict

Yellow. Eventbrite public event listings are technically feasible for bounded, approved collection using Patchright plus public page JSON-LD and observed destination APIs. The route should not be treated as a fully approved broad scrape yet because the richest endpoints are undocumented and pagination/completeness still need bounded validation.
