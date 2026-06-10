# Case Study: NYC Open Data Socrata 311 Probe

## Run Date

2026-06-10

## User Ask

Run a tiny data-acquisition feasibility probe for case 6, NYC Open Data government 311 or permits dataset. Prefer the official Socrata API and documented pagination. Do not perform broad collection.

## ModeSelection

```json
{
  "mode": "endpoint-discovery",
  "will_probe": true,
  "will_collect_beyond_sample": false,
  "target": "NYC Open Data 311 Service Requests from 2020 to Present"
}
```

## DatasetSpec

```json
{
  "entity_grain": "311_service_request",
  "source_dataset_id": "erm2-nwe9",
  "required_fields": [
    "unique_key",
    "created_date",
    "agency",
    "complaint_type",
    "descriptor",
    "borough",
    "incident_zip",
    "latitude",
    "longitude",
    "status"
  ],
  "freshness": "daily or better for current operational monitoring",
  "history": "snapshot or incremental pulls by created_date and unique_key",
  "coverage_target": "public NYC 311 records in the selected Socrata dataset",
  "exclusions": [
    "private submitter data",
    "authenticated administrative records",
    "broad collection before approval"
  ]
}
```

## SourceAccessClass

```json
{
  "class": "public_official_api",
  "publishability": "public_probe_summary",
  "reason": "NYC Open Data exposes this dataset through the public Socrata API. No cookies, browser state, Patchright session, account, or private credentials were used."
}
```

## Probe Commands

Metadata:

```powershell
$url='https://data.cityofnewyork.us/api/views/erm2-nwe9'
Invoke-WebRequest -Uri $url -Headers @{Accept='application/json'} -OutFile 'outputs/nyc-open-data-311-metadata.json'
```

Three-row sample:

```powershell
$url='https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=3&$select=unique_key,created_date,agency,complaint_type,descriptor,borough,incident_zip,latitude,longitude,status&$order=created_date%20DESC'
Invoke-WebRequest -Uri $url -Headers @{Accept='application/json'} -OutFile 'outputs/nyc-open-data-311-sample.json'
```

Count-only probe:

```powershell
$url='https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=count(*)'
Invoke-WebRequest -Uri $url -Headers @{Accept='application/json'} -OutFile 'outputs/nyc-open-data-311-count.json'
```

Bounded pagination check:

```powershell
$url='https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=2&$offset=0&$select=unique_key,created_date,agency,complaint_type,borough,status&$order=created_date%20DESC,unique_key%20DESC'
Invoke-WebRequest -Uri $url -Headers @{Accept='application/json'} -OutFile 'outputs/nyc-open-data-311-page1.json'

$url='https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit=2&$offset=2&$select=unique_key,created_date,agency,complaint_type,borough,status&$order=created_date%20DESC,unique_key%20DESC'
Invoke-WebRequest -Uri $url -Headers @{Accept='application/json'} -OutFile 'outputs/nyc-open-data-311-page2.json'
```

## Observed API Metadata

| Field | Observed Value |
|---|---|
| Dataset ID | `erm2-nwe9` |
| Name | `311 Service Requests from 2020 to Present` |
| Attribution | `311` |
| Category | `Social Services` |
| Observed column count | `48` |
| Count query result | `21422389` |

First observed columns:

| Display Name | API Field | Type |
|---|---|---|
| Unique Key | `unique_key` | `text` |
| Created Date | `created_date` | `calendar_date` |
| Closed Date | `closed_date` | `calendar_date` |
| Agency | `agency` | `text` |
| Agency Name | `agency_name` | `text` |
| Problem (formerly Complaint Type) | `complaint_type` | `text` |
| Problem Detail (formerly Descriptor) | `descriptor` | `text` |
| Incident Zip | `incident_zip` | `text` |
| Status | `status` | `text` |
| Borough | `borough` | `text` |
| Latitude | `latitude` | `number` |
| Longitude | `longitude` | `number` |
| Location | `location` | `point` |

## Observed Sample Response

Three-row sample from `outputs/nyc-open-data-311-sample.json`:

| unique_key | created_date | agency | complaint_type | descriptor | borough | status |
|---|---|---|---|---|---|---|
| `69284094` | `2026-06-09T02:15:22.000` | `DOT` | `Street Condition` | `Pothole` | `QUEENS` | `Open` |
| `69292844` | `2026-06-09T02:06:15.000` | `NYPD` | `Noise - Street/Sidewalk` | `Loud Talking` | `BRONX` | `In Progress` |
| `69294492` | `2026-06-09T02:06:02.000` | `NYPD` | `Noise - Residential` | `Loud Talking` | `BROOKLYN` | `In Progress` |

Pagination check:

| Probe | Query | Observed Keys |
|---|---|---|
| Page 1 | `$limit=2&$offset=0` | `69284094`, `69292844` |
| Page 2 | `$limit=2&$offset=2` | `69294492`, `69292734` |

The two pages did not overlap under the tested ordering.

## EndpointPlan

```json
[
  {
    "name": "dataset_metadata",
    "method": "GET",
    "template": "https://data.cityofnewyork.us/api/views/erm2-nwe9",
    "purpose": "Discover dataset name, attribution, columns, field names, and types.",
    "observed_status": 200,
    "confidence": 0.98
  },
  {
    "name": "bounded_rows",
    "method": "GET",
    "template": "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$limit={n}&$offset={offset}&$select={fields}&$order=created_date DESC,unique_key DESC",
    "purpose": "Fetch bounded pages of public 311 service request rows.",
    "observed_status": 200,
    "pagination": "Socrata $limit and $offset. Use stable $order with created_date plus unique_key.",
    "confidence": 0.95
  },
  {
    "name": "incremental_rows",
    "method": "GET",
    "template": "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$where=created_date >= '{watermark}'&$select={fields}&$order=created_date ASC,unique_key ASC&$limit={n}",
    "purpose": "Refresh from a stored timestamp watermark after approval.",
    "observed_status": "not run in this tiny probe",
    "confidence": 0.85
  },
  {
    "name": "count_only",
    "method": "GET",
    "template": "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=count(*)",
    "purpose": "Estimate dataset size without collecting rows.",
    "observed_status": 200,
    "confidence": 0.95
  }
]
```

## HeaderProfile

```json
{
  "required": ["Accept: application/json"],
  "optional": ["User-Agent"],
  "forbidden": ["cookies", "auth tokens", "captcha tokens", "browser fingerprint headers"],
  "patchright_required": false,
  "notes": "Plain unauthenticated HTTPS GET requests returned metadata, rows, count, and paginated samples."
}
```

## ProbeResults

| Probe | Endpoint | Result |
|---|---|---|
| Metadata | `/api/views/erm2-nwe9` | 200; dataset metadata and 48 columns observed |
| Sample | `/resource/erm2-nwe9.json?$limit=3...` | 200; three current public rows observed |
| Count | `/resource/erm2-nwe9.json?$select=count(*)` | 200; `21422389` rows reported |
| Pagination page 1 | `$limit=2&$offset=0` | 200; first two keys observed |
| Pagination page 2 | `$limit=2&$offset=2` | 200; next two keys observed, no overlap with page 1 |

## FeasibilityScorecard

| Dimension | Score | Notes |
|---|---:|---|
| Access legality and clarity | 10 | Official public NYC Open Data API. |
| Endpoint stability | 9 | Socrata dataset API with stable dataset ID and field names from metadata. |
| Completeness | 9 | Count query reports over 21 million records in this selected dataset. |
| Pagination reliability | 8 | `$limit` and `$offset` worked in tiny probes; full runs should use stable ordering and checkpoints. |
| Data quality | 8 | Structured fields, stable `unique_key`, coordinates, borough, status. Some fields may be null by complaint type. |
| Operational risk | 8 | No browser automation or anti-bot path. Need throttling and incremental refresh discipline for large pulls. |
| Implementation cost | 9 | Simple API adapter, schema validation, checkpointing, and raw/staged outputs. |

Overall: **Green**.

## DataAcquisitionMemo

The NYC Open Data 311 case is a strong public API target. Patchright is unnecessary because Socrata exposes metadata, count, selected fields, ordering, and offset pagination directly through unauthenticated JSON endpoints. The primary engineering concerns are ordinary large-dataset concerns: avoid full historical collection until approved, checkpoint by stable ordering, enforce row limits, persist raw responses, validate schema drift from metadata, and use incremental refresh windows.

Recommended first production path:

```text
Socrata metadata endpoint -> schema contract -> bounded row pages -> raw JSONL -> normalized 311 service_request rows -> quality checks -> checkpointed incremental refresh
```

## ApprovalGate

```json
{
  "approved_for_full_collection": false,
  "safe_next_step": "Build a small Socrata adapter and run a capped sample, for example 1000 rows or a one-day date window, after explicit approval.",
  "stop_conditions": [
    "unexpected 401/403 responses",
    "rate-limit responses without documented backoff",
    "schema drift that removes required fields",
    "request volume exceeding the approved cap"
  ],
  "requires_patchright": false
}
```

## Evidence Files

- `outputs/nyc-open-data-311-metadata.json`
- `outputs/nyc-open-data-311-sample.json`
- `outputs/nyc-open-data-311-count.json`
- `outputs/nyc-open-data-311-page1.json`
- `outputs/nyc-open-data-311-page2.json`

## Final Decision

**Green**: NYC Open Data 311 is feasible through the official public Socrata API with tiny bounded probes, documented query parameters, stable IDs, and no Patchright/browser requirement.
