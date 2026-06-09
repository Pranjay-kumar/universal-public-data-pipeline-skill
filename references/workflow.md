# Workflow

Use this workflow for public-data requests.

## 1. Normalize The Ask

Convert the user's request into a `DatasetSpec`:

```json
{
  "entity": "",
  "description": "",
  "fields": [],
  "constraints": {},
  "refresh_frequency": null,
  "target_rows": null,
  "budget": null
}
```

Infer entity, fields, grain, identifiers, freshness expectations, scale, and storage implications. Ask only when the data target is impossible to infer.

## 2. Discover Sources

Generate a ranked `SourcePlan`. Prefer:

1. Official public API
2. Public unauthenticated JSON endpoint
3. Public page-data/storefront XAPI endpoint
4. Embedded JSON or hydration state
5. Sitemap/catalog/directory
6. Search endpoint
7. Static HTML
8. Rendered DOM
9. Reject

Do not start with browser automation unless lower-cost paths fail.

## 3. Reverse-Engineer Public Endpoints

Treat endpoint discovery as the preferred fast path. Derive endpoint templates, params, headers, pagination, field mapping, and fallback routes before writing a scraper.

Read `endpoint-discovery.md` and `probing.md` when public web/API routes are likely.

## 4. Probe Before Planning Execution

Probe sources with tiny requests. Collect evidence:

- HTTP status
- content type
- JSON shape
- required params
- required normal headers
- pagination behavior
- rate-limit behavior
- sample extraction
- robots/terms signals when relevant
- failure modes

## 5. Score Feasibility

Create a balanced `FeasibilityReport`. Be enthusiastic when the path works, but name constraints plainly. Do not hide access, scale, compliance, or data-quality risks.

Read `feasibility-scoring.md`.

## 6. Design The Pipeline

Create a `PipelinePlan` with:

- source discovery
- endpoint templates
- header profile
- params and pagination
- parse rules
- schema
- dedupe keys
- checkpoint strategy
- storage targets
- validation plan
- full-run approval gate

## 7. Validate Small

Before any full run, validate a small sample by default:

- 20 rows
- 2 pages or categories
- 2 minutes

Increase only when the user approves. Full runs must write incrementally so partial output survives timeouts.

## 8. Execute Only After Approval

Never run full collection until:

- feasibility exists
- source and endpoint probes are documented
- sample output is validated
- approval is explicit

