# Case Study: ATS Public Job Postings Probe

## Run Date

2026-06-10

## Worker Scope

Worker 5. Owned output file only:

```text
case-studies/ats-public-jobs-probe.md
```

No README or test-plan edits were made. No broad collection was performed.

## User Ask

Run a tiny data-acquisition feasibility probe for case 5, Greenhouse/Lever public job postings. Prefer official/public job-board APIs. Patchright is optional only if needed.

## ModeSelection

```json
{
  "mode": "source-comparison",
  "reason": "Compare two common public ATS job-board API families using bounded list and detail probes.",
  "will_probe": true,
  "will_collect_beyond_sample": false
}
```

## SourceAccessClass

```json
{
  "class": "public",
  "is_publishable_as_public_result": true,
  "authorization_basis": "Public unauthenticated job-board endpoints for published company postings.",
  "secret_handling": "none",
  "allowed_outputs": [
    "endpoint templates",
    "status codes",
    "counts",
    "sample public posting fields",
    "pipeline feasibility notes"
  ],
  "forbidden_outputs": [
    "cookies",
    "auth tokens",
    "captcha tokens",
    "session dumps",
    "candidate data",
    "application submission data",
    "private or internal job postings"
  ],
  "notes": "No browser session, cookies, credentials, Patchright profile, or auth bypass was used."
}
```

## DatasetNeed

```json
{
  "decision_or_workflow": "Determine whether public ATS boards can support selected-company hiring intelligence.",
  "entity_grain": "public_job_posting_snapshot",
  "required_fields": [
    "provider",
    "company_token",
    "job_id",
    "title",
    "location",
    "absolute_url",
    "department_or_team",
    "observed_at"
  ],
  "nice_to_have_fields": [
    "description_html",
    "employment_type",
    "created_at",
    "updated_at",
    "requisition_id",
    "remote_or_workplace_type"
  ],
  "freshness": "daily or weekly snapshots depending on the use case",
  "history": "track first_seen, last_seen, and removed_at by stable provider/company/job_id keys",
  "coverage_target": "selected companies with known public Greenhouse or Lever board tokens",
  "join_keys": [
    "provider",
    "company_token",
    "job_id"
  ],
  "privacy_or_risk_fields": [
    "candidate data",
    "application forms",
    "private recruiter notes"
  ],
  "exclusions": [
    "candidate/application data",
    "auth-only boards",
    "application submission",
    "internal-only postings"
  ],
  "useless_if": [
    "company board tokens cannot be discovered",
    "job IDs are unstable",
    "public endpoints stop returning enough fields for normalization"
  ]
}
```

## DatasetSpec

```json
{
  "entity": "public_job_posting_snapshot",
  "description": "One observed public job posting from a selected company ATS board at a point in time.",
  "fields": [
    "provider",
    "company_token",
    "job_id",
    "title",
    "location",
    "team_or_department",
    "absolute_url",
    "created_at",
    "updated_at",
    "description_html",
    "observed_at"
  ],
  "constraints": {
    "scope": "selected public boards only",
    "no_candidate_data": true,
    "no_application_submission": true
  },
  "refresh_frequency": "daily_or_weekly",
  "target_rows": "bounded by selected company seed list",
  "budget": "small"
}
```

## Commands

Greenhouse and Lever list/detail probe:

```powershell
$ErrorActionPreference='Stop'
$headers = @{ 'User-Agent' = 'Mozilla/5.0 data-acquisition-feasibility-probe/1.0'; 'Accept' = 'application/json' }
$ghUrl = 'https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=false'
$gh = Invoke-RestMethod -Uri $ghUrl -Headers $headers
$ghFirst = $gh.jobs | Select-Object -First 1
$ghDetailUrl = "https://boards-api.greenhouse.io/v1/boards/stripe/jobs/$($ghFirst.id)"
$ghDetail = Invoke-RestMethod -Uri $ghDetailUrl -Headers $headers
$leverUrl = 'https://api.lever.co/v0/postings/dnb?mode=json&limit=2'
$lever = Invoke-RestMethod -Uri $leverUrl -Headers $headers
$leverFirst = $lever | Select-Object -First 1
$leverDetailUrl = "https://api.lever.co/v0/postings/dnb/$($leverFirst.id)?mode=json"
$leverDetail = Invoke-RestMethod -Uri $leverDetailUrl -Headers $headers
```

Bounded pagination/content probe:

```powershell
@'
const urls = [
  'https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=true',
  'https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=false&limit=1',
  'https://api.lever.co/v0/postings/dnb?mode=json&limit=1',
  'https://api.lever.co/v0/postings/dnb?mode=json&limit=1&skip=1'
];
const results = [];
for (const url of urls) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 data-acquisition-feasibility-probe/1.0',
      accept: 'application/json'
    }
  });
  const json = await res.json();
  const arr = Array.isArray(json) ? json : (Array.isArray(json.jobs) ? json.jobs : [json]);
  results.push({
    url,
    status: res.status,
    contentType: res.headers.get('content-type'),
    count: arr.length,
    firstId: arr[0]?.id ?? null,
    metaTotal: json?.meta?.total ?? null,
    hasContent: Boolean(arr[0]?.content || arr[0]?.description || arr[0]?.lists)
  });
}
console.log(JSON.stringify(results, null, 2));
'@ | node -
```

Note: one intermediate `Invoke-WebRequest` pagination attempt failed with a local PowerShell `NullReferenceException`; the equivalent Node `fetch` probe succeeded. This was not treated as a target-site failure.

## Observed APIs

Greenhouse public job board API:

```text
GET https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs?content=false
GET https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs?content=true
GET https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs/{job_id}
```

Lever public postings API:

```text
GET https://api.lever.co/v0/postings/{site}?mode=json&limit={n}
GET https://api.lever.co/v0/postings/{site}?mode=json&limit={n}&skip={n}
GET https://api.lever.co/v0/postings/{site}/{posting_id}?mode=json
```

Patchright was not needed because the structured public API path worked directly.

## SourcePlan

```json
[
  {
    "url": "https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=false",
    "type": "api",
    "reason": "Public Greenhouse board list endpoint returned structured JSON and stable job IDs.",
    "confidence": 0.95
  },
  {
    "url": "https://api.lever.co/v0/postings/dnb?mode=json&limit=2",
    "type": "api",
    "reason": "Public Lever postings endpoint returned structured JSON and supported bounded list probes.",
    "confidence": 0.95
  }
]
```

## EndpointPlan

```json
[
  {
    "name": "greenhouse_board_jobs",
    "method": "GET",
    "template": "https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs",
    "path_params": [
      "board_token"
    ],
    "query_params": [
      "content"
    ],
    "pagination": {
      "observed": "No effective pagination in tiny probe; limit=1 was ignored for the Stripe board and the full board returned.",
      "strategy": "Fetch one board response per selected company. Treat board-level response as the unit of refresh."
    },
    "field_coverage": [
      "job_id",
      "title",
      "location",
      "absolute_url",
      "updated_at",
      "departments",
      "offices",
      "description_html when content=true"
    ],
    "fallback": "Fetch detail endpoint by job_id if list payload lacks a needed field.",
    "confidence": 0.95
  },
  {
    "name": "greenhouse_job_detail",
    "method": "GET",
    "template": "https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs/{job_id}",
    "path_params": [
      "board_token",
      "job_id"
    ],
    "query_params": [],
    "pagination": {},
    "field_coverage": [
      "job_id",
      "title",
      "location",
      "absolute_url",
      "content",
      "metadata"
    ],
    "fallback": "Use board list with content=true for bulk description capture if detail calls are unnecessary.",
    "confidence": 0.9
  },
  {
    "name": "lever_postings",
    "method": "GET",
    "template": "https://api.lever.co/v0/postings/{site}",
    "path_params": [
      "site"
    ],
    "query_params": [
      "mode",
      "limit",
      "skip"
    ],
    "pagination": {
      "type": "offset_by_skip",
      "observed": "limit=1 returned one posting; limit=1&skip=1 returned the next posting.",
      "strategy": "Page with skip increments until an empty page or unchanged cursor behavior is observed."
    },
    "field_coverage": [
      "job_id",
      "text",
      "categories.location",
      "categories.team",
      "categories.commitment",
      "hostedUrl",
      "createdAt",
      "description/lists"
    ],
    "fallback": "Fetch detail endpoint by posting_id.",
    "confidence": 0.95
  },
  {
    "name": "lever_posting_detail",
    "method": "GET",
    "template": "https://api.lever.co/v0/postings/{site}/{posting_id}",
    "path_params": [
      "site",
      "posting_id"
    ],
    "query_params": [
      "mode"
    ],
    "pagination": {},
    "field_coverage": [
      "posting_id",
      "text",
      "categories",
      "hostedUrl",
      "createdAt",
      "lists",
      "description"
    ],
    "fallback": "Use list response where detail fields are already present.",
    "confidence": 0.9
  }
]
```

## HeaderProfile

```json
{
  "required": [
    "Accept: application/json"
  ],
  "optional": [
    "User-Agent"
  ],
  "forbidden": [
    "cookies",
    "auth tokens",
    "captcha tokens",
    "fingerprint headers",
    "secrets in logs"
  ],
  "secret_inputs": [],
  "notes": "Tiny unauthenticated GET probes succeeded with normal browser-like User-Agent and Accept headers."
}
```

## ProbeResults

Primary list/detail probes:

| Provider | Endpoint | Status | Sample Count | Observed Result |
|---|---|---:|---:|---|
| Greenhouse | `https://boards-api.greenhouse.io/v1/boards/stripe/jobs?content=false` | 200 | 498 | Returned `jobs` and `meta.total=498`. First job ID `7964697`, title `Account Executive, AI Sales`, location `San Francisco, CA`. |
| Greenhouse | `https://boards-api.greenhouse.io/v1/boards/stripe/jobs/7964697` | 200 | 1 | Detail endpoint returned the same public posting title. |
| Lever | `https://api.lever.co/v0/postings/dnb?mode=json&limit=2` | 200 | 2 | Returned two postings. First posting ID `620dcbfd-ff4d-4fad-97d2-d7fb69e2c851`, title `Account Executive II, Eastern Region  (R-18928)`, location `Ontario - Canada`, team `Sales`. |
| Lever | `https://api.lever.co/v0/postings/dnb/620dcbfd-ff4d-4fad-97d2-d7fb69e2c851?mode=json` | 200 | 1 | Detail endpoint returned the same public posting title. |

Bounded pagination/content probes:

| Provider | Endpoint | Status | Count | Finding |
|---|---|---:|---:|---|
| Greenhouse | `?content=true` | 200 | 498 | Description/content fields were present. |
| Greenhouse | `?content=false&limit=1` | 200 | 498 | `limit=1` was ignored for this board; full board returned. |
| Lever | `?mode=json&limit=1` | 200 | 1 | `limit` was honored. |
| Lever | `?mode=json&limit=1&skip=1` | 200 | 1 | `skip` advanced to the next posting ID `a2329c17-5755-4c95-893e-248054247bfa`. |

Structured probe output excerpt:

```json
{
  "greenhouse_count": 498,
  "greenhouse_meta_total": 498,
  "greenhouse_first_id": 7964697,
  "greenhouse_first_title": "Account Executive, AI Sales",
  "greenhouse_detail_title": "Account Executive, AI Sales",
  "lever_count_returned": 2,
  "lever_first_id": "620dcbfd-ff4d-4fad-97d2-d7fb69e2c851",
  "lever_first_text": "Account Executive II, Eastern Region  (R-18928)",
  "lever_detail_text": "Account Executive II, Eastern Region  (R-18928)"
}
```

## SampleRows

```json
[
  {
    "provider": "greenhouse",
    "company_token": "stripe",
    "job_id": "7964697",
    "title": "Account Executive, AI Sales",
    "location": "San Francisco, CA",
    "observed_count_for_board": 498,
    "observed_at": "2026-06-10"
  },
  {
    "provider": "lever",
    "company_token": "dnb",
    "job_id": "620dcbfd-ff4d-4fad-97d2-d7fb69e2c851",
    "title": "Account Executive II, Eastern Region  (R-18928)",
    "location": "Ontario - Canada",
    "team": "Sales",
    "commitment": "Employee: Full Time",
    "observed_at": "2026-06-10"
  }
]
```

## FeasibilityScorecard

```json
{
  "coverage": 8,
  "stability": 9,
  "pagination_depth": 8,
  "refreshability": 9,
  "data_quality": 8,
  "engineering_cost": "S",
  "legal_tos_risk": "low",
  "recommended_path": "official_api",
  "traffic_light": "Green"
}
```

## DataAcquisitionMemo

```json
{
  "fastest_viable_route": "Use known public Greenhouse board tokens and Lever site tokens, then fetch provider JSON endpoints directly.",
  "cheapest_robust_route": "Maintain a selected-company seed list, refresh each public board daily or weekly, normalize to one job_posting_snapshot schema, and infer removals from missing IDs across snapshots.",
  "highest_coverage_route": "Add a separate company-careers-page discovery stage to resolve ATS provider and board token, then route each company through the matching provider adapter.",
  "coverage_ceiling": "High for selected companies with known Greenhouse/Lever tokens; incomplete for the entire labor market unless paired with a reliable company discovery/token-resolution process.",
  "main_trapdoors": [
    "board-token discovery is separate from posting collection",
    "Greenhouse may return a whole board response and ignore generic limit/offset parameters",
    "Lever uses skip/limit, not offset",
    "description fields are HTML or rich text and need normalization",
    "removed postings require snapshot history rather than a deletion feed",
    "do not collect candidate/application data or submit applications"
  ],
  "sample_before_full_run": [
    "validate 3-5 known Greenhouse tokens",
    "validate 3-5 known Lever tokens",
    "confirm normalization for title, location, team, URL, created_at, updated_at, and description",
    "run two snapshots on different days to test first_seen/last_seen/removed_at logic"
  ],
  "stop_conditions": [
    "endpoint requires login or private credentials",
    "target asks for candidate or applicant records",
    "target asks for application submission automation",
    "public endpoint starts returning human verification or access-denial pages instead of JSON"
  ],
  "recommendation": "Green for selected-company public job posting snapshots. Build provider-specific API adapters; do not use Patchright unless token discovery from a rendered careers page becomes necessary."
}
```

## FeasibilityReport

```json
{
  "score": 90,
  "traffic_light": "Green",
  "interpretation": "Easy for selected public Greenhouse and Lever boards with known tokens.",
  "availability": "Public postings are available through unauthenticated provider JSON endpoints.",
  "accessibility": "Tiny GET probes for list and detail endpoints succeeded without cookies, credentials, browser automation, or Patchright.",
  "structure": "Structured JSON with stable provider-specific IDs, titles, locations, teams/departments, URLs, and optional description content.",
  "coverage": "Strong for selected companies once the correct board/site token is known.",
  "pagination": "Greenhouse board list returned the full Stripe board and ignored limit=1; Lever honored limit and skip.",
  "runtime": "Small for selected-company snapshots; direct API calls are cheap compared with browser collection.",
  "storage": "Manageable; store raw provider payloads if needed plus normalized posting snapshots.",
  "risk": "Low for public postings when limited to listed job data. Candidate/application data and submission automation remain out of scope.",
  "recommended_strategy": "Use direct Greenhouse and Lever API adapters, normalize provider responses, checkpoint by provider/company/job_id, and require explicit approval before full seed-list execution.",
  "confidence": 0.92
}
```

## PipelineQualityPlan

```json
{
  "id_strategy": "provider + company_token + job_id",
  "dedupe_strategy": "dedupe by stable ID tuple per snapshot date",
  "incremental_strategy": "compare each refresh against previous snapshot to set first_seen, last_seen, and removed_at",
  "checkpoint_strategy": "checkpoint by provider and company token after each board fetch",
  "retry_backoff_strategy": "bounded retries with exponential backoff for transient 429/5xx responses",
  "rate_limit_strategy": "small concurrency, cache unchanged boards, respect provider errors and stop on access denial",
  "schema_validation": [
    "job_id present",
    "title present",
    "absolute_url or provider URL present",
    "observed_at present",
    "provider/company token present"
  ],
  "data_quality_tests": [
    "non-empty title",
    "location parse does not drop raw value",
    "no duplicate provider/company/job_id rows",
    "description HTML either preserved raw or sanitized deterministically"
  ],
  "observability": [
    "board status code",
    "job count by board",
    "new/removed/changed counts",
    "schema validation failures",
    "provider error rate"
  ],
  "failure_recovery": "resume from provider/company checkpoint and preserve failed board diagnostics without retry storms",
  "change_detection": "detect sudden count drops, JSON shape changes, and repeated 403/404/429 responses",
  "secret_handling": "none",
  "publishability": "public_result"
}
```

## PipelinePlan

```yaml
name: ats_public_jobs_snapshot
entity: public_job_posting_snapshot
sources:
  - provider: greenhouse
    template: https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs
  - provider: lever
    template: https://api.lever.co/v0/postings/{site}
strategy:
  - load selected company seed list with provider and token
  - fetch provider list endpoint directly
  - optionally fetch detail endpoint only when list response lacks required fields
  - normalize records into one schema
  - compare against previous snapshots for first_seen, last_seen, removed_at
endpoint_templates:
  greenhouse_list: https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs?content=false
  greenhouse_list_with_content: https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs?content=true
  greenhouse_detail: https://boards-api.greenhouse.io/v1/boards/{board_token}/jobs/{job_id}
  lever_list: https://api.lever.co/v0/postings/{site}?mode=json&limit={limit}&skip={skip}
  lever_detail: https://api.lever.co/v0/postings/{site}/{posting_id}?mode=json
headers:
  Accept: application/json
  User-Agent: normal browser-style or pipeline identifier
params:
  greenhouse:
    content: false
  lever:
    mode: json
    limit: 100
    skip: 0
pagination:
  greenhouse: one board response per token unless provider behavior changes
  lever: increment skip by limit until empty page
schema:
  required:
    - provider
    - company_token
    - job_id
    - title
    - observed_at
  optional:
    - location
    - team_or_department
    - absolute_url
    - created_at
    - updated_at
    - description_html
dedupe:
  key: [provider, company_token, job_id]
checkpoints:
  unit: provider_company_token
limits:
  probe: 1-2 companies per provider
  full_run: requires explicit approval
outputs:
  raw: provider payloads, if approved
  staged: provider-normalized rows
  normalized: public_job_posting_snapshot
validation:
  - status is 200
  - content-type is json
  - job_id/title present
  - no candidate/application fields collected
approval:
  full_run_approved: false
```

## Evidence File Paths

No separate raw evidence file was written because Worker 5 was instructed to own only this output file. Evidence is embedded above from bounded command output.

```text
case-studies/ats-public-jobs-probe.md
```

## ApprovalGate

```json
{
  "sample_validated": true,
  "full_run_approved": false,
  "recommended_next_step": "After user approval, test a slightly wider seed of 3-5 Greenhouse boards and 3-5 Lever boards, then implement a provider-normalized snapshot adapter."
}
```

## Final Decision

```json
{
  "traffic_light": "Green",
  "reason": "Public unauthenticated structured APIs worked for both Greenhouse and Lever list/detail probes. Patchright was not needed. The only major caveat is that company/token discovery is a separate problem from posting collection."
}
```
