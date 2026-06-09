# Examples

Use these as response patterns, not as fixed text.

## Dataset Design

User asks: "I need public data for price intelligence."

Preferred strategy:

1. Identify the decision: alerting, competitive benchmark, assortment gaps, margin analysis, or trend research.
2. Choose the grain: product, SKU, offer, seller, category, store, or price observation.
3. Split fields into required and nice-to-have.
4. Decide freshness and history before source discovery.
5. Define "good enough" coverage and "useless if" conditions.

Output emphasis:

- decision/workflow
- entity grain
- required fields
- coverage target
- refresh frequency
- fields to avoid
- smallest useful dataset

## Ecommerce Catalog

User asks: "Find all product metadata for a retailer."

Preferred strategy:

1. Check official public API docs.
2. Inspect product/category pages for public XAPI endpoints.
3. Use category or product sitemaps for discovery.
4. Use public detail endpoints for metadata.
5. Deduplicate by product ID.
6. Validate 20 rows.
7. Ask before full run.

Output emphasis:

- endpoint templates
- category/product ID discovery
- pagination/facet behavior
- field coverage
- expected row count

## Social Followers

User asks: "Can we collect followers/following?"

Preferred strategy:

1. Probe public profile endpoint.
2. Probe followers/following endpoints with tiny limits.
3. Identify page size, offset/cursor limits, terminal behavior, and errors.
4. Separate technical feasibility from responsible full-collection feasibility.
5. Avoid broad collection unless explicitly approved and compliant.

Output emphasis:

- public endpoint reachability
- max retrievable pages
- privacy/ToS risk
- sample-only recommendation

## Public Events

User asks: "Collect events from public calendars."

Preferred strategy:

1. Look for public API or JSON calendar feed.
2. Check ICS feeds, embedded JSON, and search endpoints.
3. Probe date pagination and location filters.
4. Normalize dates, time zones, venue, source URL, and event IDs.

Output emphasis:

- date range coverage
- refresh frequency
- dedupe by event ID/title/date/venue

## Feasibility Summary Shape

```markdown
ModeSelection: ...
DatasetNeed: ...
DatasetSpec: ...
SourcePlan: ...
EndpointPlan: ...
HeaderProfile: ...
ProbeResults: ...
FeasibilityReport:
- Technical: 88/100
- Responsible full collection: 42/100
- Narrow sample: 75/100
PipelinePlan: ...
SampleRows: ...
ApprovalGate: full run not approved
```
