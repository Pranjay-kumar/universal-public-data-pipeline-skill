# Workflow

Use this workflow for data acquisition requests.

## 1. Select Mode

Choose the narrowest mode that answers the user:

- `dataset-design` when the user is deciding what data they need.
- `feasibility` when the user named a dataset but has not proven source viability.
- `endpoint-discovery` when the user wants web/API routes.
- `pagination-limits` when completeness or max retrievable rows is the question.
- `source-comparison` when multiple source strategies are plausible.
- `pipeline-design` when endpoints/sources are known and the user wants a plan.
- `sample-validation` when tiny probes or sample rows are needed.
- `compliance-boundary` when the main question is what not to do.
- `execution` only when the user explicitly approves collection beyond samples.

Read `modes.md` when the mode affects output shape.

## 2. Design The Dataset Need

Before source discovery, produce `DatasetNeed` when the ask is broad, vague, or business-driven:

```json
{
  "decision_or_workflow": "",
  "entity_grain": "",
  "required_fields": [],
  "nice_to_have_fields": [],
  "freshness": "",
  "history": "",
  "coverage_target": "",
  "join_keys": [],
  "privacy_or_risk_fields": [],
  "exclusions": [],
  "useless_if": []
}
```

Push back on "all data" by translating it into the smallest dataset that supports the decision.

## 3. Classify Source Access

Produce `SourceAccessClass` before probing when access is known or implied:

- `public`
- `owned_session`
- `provided_credentials`
- `licensed_api`
- `partner_api`
- `internal_system`
- `restricted_reject`

Read `source-access.md`.

## 4. Normalize The Ask

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

## 5. Discover Sources

Generate a ranked `SourcePlan`. Prefer:

1. Official API, licensed API, partner API, or approved export
2. Public unauthenticated JSON endpoint
3. Page-data/storefront XAPI endpoint
4. Embedded JSON or hydration state
5. Sitemap/catalog/directory
6. Search endpoint
7. Static HTML
8. Rendered DOM
9. Reject

Do not start with browser automation unless lower-cost paths fail.

Use the probe ladder:

1. Official API docs, open-data portals, feeds, or bulk files
2. Robots, sitemap indexes, category/product sitemaps, directories
3. Framework page data such as Next.js, Nuxt, Remix, or JSON-LD
4. XHR/fetch endpoints visible in public page behavior
5. Search, browse, autocomplete, facet, and listing endpoints
6. Detail endpoints derived from public IDs or URLs
7. Static HTML parsing
8. Rendered DOM automation
9. Reject or seek another source

## 6. Reverse-Engineer Endpoints

Treat endpoint discovery as the preferred fast path. Derive endpoint templates, params, headers, pagination, field mapping, and fallback routes before writing a scraper.

Read `pattern-library.md`, `endpoint-discovery.md`, and `probing.md` when public web/API routes are likely.

## 7. Probe Before Planning Execution

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

## 8. Score Feasibility

Create a balanced `FeasibilityReport`. Be enthusiastic when the path works, but name constraints plainly. Do not hide access, scale, compliance, or data-quality risks.

Read `feasibility-scoring.md`.

## 9. Produce A Data Acquisition Memo

Before implementation, make the decision legible:

- fastest viable route
- cheapest robust route
- highest-coverage route
- likely completeness ceiling
- probe evidence still needed
- reasons to stop or narrow scope
- recommended next move

## 10. Design The Pipeline

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

## 11. Validate Small

Before any full run, validate a small sample by default:

- 20 rows
- 2 pages or categories
- 2 minutes

Increase only when the user approves. Full runs must write incrementally so partial output survives timeouts.

## 12. Execute Only After Approval

Never run full collection until:

- feasibility exists
- source and endpoint probes are documented
- sample output is validated
- approval is explicit
