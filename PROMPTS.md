# Prompt Pack

Copy, paste, and replace the target.

## Ecommerce Catalog

```text
Use $universal-public-data-pipeline to run public data due diligence for all product metadata on TARGET_SITE. Prefer public APIs, XHR endpoints, page-data routes, category sitemaps, and embedded JSON over HTML scraping. Return a FeasibilityScorecard and DataAcquisitionMemo before any implementation.
```

```text
Use $universal-public-data-pipeline to discover category and product endpoints for TARGET_RETAILER. Return EndpointPlan, HeaderProfile, pagination behavior, sample rows, and an approval gate.
```

## Social Graph Feasibility

```text
Use $universal-public-data-pipeline to assess public followers/following data for TARGET_PLATFORM. Use tiny probes only. Find endpoint templates, pagination limits, a Green/Yellow/Red rating, and responsible collection feasibility.
```

```text
Use $universal-public-data-pipeline to check whether TARGET_USER's public followers can be paginated completely. Probe sparse offsets with limit=1 and do not harvest the list.
```

## Events

```text
Use $universal-public-data-pipeline to collect public event listings for TARGET_CITY and TARGET_TOPIC. Prefer APIs, ICS feeds, embedded JSON, or search endpoints over HTML parsing.
```

## Government And Open Data

```text
Use $universal-public-data-pipeline to find official public data sources for TARGET_AGENCY and TARGET_DATASET. Prefer bulk downloads or documented APIs. Produce a refreshable pipeline plan.
```

## Jobs And Directories

```text
Use $universal-public-data-pipeline to assess public job listings from TARGET_SITE. Look for public search APIs, JSON endpoints, sitemaps, and pagination caps before proposing a scraper.
```

## Real Estate And Listings

```text
Use $universal-public-data-pipeline to assess public listing metadata from TARGET_SITE. Identify endpoint templates, geo/search params, page limits, dedupe keys, and compliance risks.
```

## Research Mode

```text
Use $universal-public-data-pipeline in feasibility-only mode for TARGET_DATA. Do not generate scraper code. Return DatasetSpec, SourcePlan, EndpointPlan, HeaderProfile, ProbeResults, FeasibilityScorecard, DataAcquisitionMemo, FeasibilityReport, PipelinePlan, SampleRows, and ApprovalGate.
```

## Data Acquisition Decision Memo

```text
Use $universal-public-data-pipeline to decide whether TARGET_DATA is worth collecting. I want the fastest viable route, cheapest robust route, highest-coverage route, trapdoors, stop conditions, and a recommended next move. Do not run a full collection.
```

## Public API Pattern Hunt

```text
Use $universal-public-data-pipeline to inspect TARGET_SITE for public data patterns: official APIs, Next.js/Nuxt data, GraphQL, Algolia, Shopify, Salesforce Commerce Cloud, storefront XAPI, sitemaps, JSON-LD, feeds, and search endpoints. Return evidence and next probes only.
```
