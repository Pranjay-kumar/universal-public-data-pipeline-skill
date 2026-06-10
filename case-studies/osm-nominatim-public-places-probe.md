# Case Study: OpenStreetMap Nominatim Public Places Probe

## Run Date

2026-06-10

## User Ask

Test a geospatial public data source as one of the diverse data-acquisition cases, without broad collection.

## ModeSelection

```json
{
  "mode": "public-api-feasibility",
  "will_probe": true,
  "will_collect_beyond_sample": false,
  "runtime": "curl",
  "target": "OpenStreetMap Nominatim place search"
}
```

## SourceAccessClass

```json
{
  "class": "public",
  "publishability": "public_result",
  "reason": "The tested Nominatim routes returned unauthenticated JSON over public URLs with a descriptive User-Agent. No cookies, browser storage, or account data were used."
}
```

## Probe Commands

```powershell
curl.exe -L -s -D outputs\osm-nominatim-search-headers.txt -A "universal-data-acquisition-pipeline-skill/0.1 tiny feasibility probe (contact: local-user)" "https://nominatim.openstreetmap.org/search?q=Lower%20East%20Side%2C%20Manhattan&format=jsonv2&limit=2&addressdetails=1" -o outputs\osm-nominatim-search.json
curl.exe -L -s -D outputs\osm-nominatim-status-headers.txt -A "universal-data-acquisition-pipeline-skill/0.1 tiny feasibility probe (contact: local-user)" "https://nominatim.openstreetmap.org/status?format=json" -o outputs\osm-nominatim-status.json
```

## ProbeResults

| Probe | Status | Content Type | Result |
|---|---:|---|---|
| Nominatim search | 200 | `application/json; charset=utf-8` | Returned Lower East Side place record |
| Nominatim status | 200 | `application/json; charset=utf-8` | Returned service status and data freshness |

Search evidence:

- endpoint: `https://nominatim.openstreetmap.org/search`
- query: `Lower East Side, Manhattan`
- response included `place_id`, `osm_type`, `osm_id`, `lat`, `lon`, `category`, `type`, `place_rank`, `importance`, `display_name`, `address`, and `boundingbox`
- sample result identified `Lower East Side` as a `place/neighbourhood`
- sample coordinates: `lat: 40.7159357`, `lon: -73.9868057`
- sample bounding box: `40.7059357, 40.7259357, -73.9968057, -73.9768057`

Status evidence:

- endpoint: `https://nominatim.openstreetmap.org/status?format=json`
- response included `status: 0`, `message: OK`, `data_updated`, `software_version`, and `database_version`
- observed data freshness: `2026-06-10T15:09:16+00:00`

## EndpointPlan

```json
{
  "recommended_path": "official_public_nominatim_api",
  "search_endpoint": "https://nominatim.openstreetmap.org/search",
  "status_endpoint": "https://nominatim.openstreetmap.org/status",
  "required_headers": {
    "User-Agent": "descriptive application/contact string"
  },
  "params": {
    "q": "{place query}",
    "format": "jsonv2",
    "limit": "small integer",
    "addressdetails": "1"
  },
  "sample_extract": [
    "place_id",
    "osm_type",
    "osm_id",
    "lat",
    "lon",
    "category",
    "type",
    "display_name",
    "address",
    "boundingbox"
  ]
}
```

## FeasibilityScorecard

| Dimension | Score |
|---|---|
| Coverage | High for geocoding/search samples; bulk coverage should use OSM extracts instead |
| Stability | High for official API shape |
| Pagination depth | Low by design; Nominatim is not a broad scraping endpoint |
| Refreshability | Medium for tiny lookup workloads with strict rate-limit awareness |
| Data quality | High for place lookup metadata |
| Engineering cost | S |
| Legal/ToS risk | Low-Medium; must honor Nominatim usage policy and ODbL attribution/share-alike requirements |
| Recommended path | Nominatim for lookup; OSM extracts/Overpass for larger collection |
| Traffic light | Green for tiny lookup, Yellow for broad collection |

## DataAcquisitionMemo

Fastest route:

```text
Use official Nominatim search for small place lookup and the status endpoint for data freshness checks.
```

Cheapest robust route:

```text
Use Nominatim only for bounded geocoding/search. For broad place collection, switch to OSM extracts or a self-hosted geocoder instead of repeatedly querying the public service.
```

Trapdoors:

- Public Nominatim is not intended for bulk scraping.
- A descriptive User-Agent/contact string and rate-limit-aware scheduling are mandatory for a responsible pipeline.
- OSM data requires attribution and license handling.

## ApprovalGate

```json
{
  "approved_for_full_run": false,
  "requires_user_go_ahead": true,
  "next_step": "Decide whether the use case is tiny lookup, enrichment, or broad place collection; use OSM extracts for broad collection."
}
```

## Evidence Files

- `outputs/osm-nominatim-search-headers.txt`
- `outputs/osm-nominatim-search.json`
- `outputs/osm-nominatim-status-headers.txt`
- `outputs/osm-nominatim-status.json`
