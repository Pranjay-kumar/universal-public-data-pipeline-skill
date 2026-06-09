# Prompt Pack

Copy, paste, and replace the target.

## Dataset Design

```text
Use $universal-data-acquisition-pipeline in dataset-design mode. I want to use public data for BUSINESS_GOAL. Help me decide the entity grain, required fields, nice-to-have fields, freshness, history, coverage target, join keys, exclusions, and what would make the dataset useless. Do not hunt endpoints yet.
```

```text
Use $universal-data-acquisition-pipeline to turn this vague ask into a collection-ready DatasetNeed and DatasetSpec: VAGUE_DATA_ASK. Push back on "all data" and propose the smallest useful dataset.
```

## Ecommerce Catalog

```text
Use $universal-data-acquisition-pipeline to run public data due diligence for all product metadata on TARGET_SITE. Prefer public APIs, XHR endpoints, page-data routes, category sitemaps, and embedded JSON over HTML scraping. Return a FeasibilityScorecard and DataAcquisitionMemo before any implementation.
```

```text
Use $universal-data-acquisition-pipeline to discover category and product endpoints for TARGET_RETAILER. Return EndpointPlan, HeaderProfile, pagination behavior, sample rows, and an approval gate.
```

## Social Graph Feasibility

```text
Use $universal-data-acquisition-pipeline to assess public followers/following data for TARGET_PLATFORM. Use tiny probes only. Find endpoint templates, pagination limits, a Green/Yellow/Red rating, and responsible collection feasibility.
```

```text
Use $universal-data-acquisition-pipeline to check whether TARGET_USER's public followers can be paginated completely. Probe sparse offsets with limit=1 and do not harvest the list.
```

## Events

```text
Use $universal-data-acquisition-pipeline to collect public event listings for TARGET_CITY and TARGET_TOPIC. Prefer APIs, ICS feeds, embedded JSON, or search endpoints over HTML parsing.
```

## Government And Open Data

```text
Use $universal-data-acquisition-pipeline to find official public data sources for TARGET_AGENCY and TARGET_DATASET. Prefer bulk downloads or documented APIs. Produce a refreshable pipeline plan.
```

## Jobs And Directories

```text
Use $universal-data-acquisition-pipeline to assess public job listings from TARGET_SITE. Look for public search APIs, JSON endpoints, sitemaps, and pagination caps before proposing a scraper.
```

## Real Estate And Listings

```text
Use $universal-data-acquisition-pipeline to assess public listing metadata from TARGET_SITE. Identify endpoint templates, geo/search params, page limits, dedupe keys, and compliance risks.
```

## Research Mode

```text
Use $universal-data-acquisition-pipeline in feasibility-only mode for TARGET_DATA. Do not generate scraper code. Return DatasetSpec, SourcePlan, EndpointPlan, HeaderProfile, ProbeResults, FeasibilityScorecard, DataAcquisitionMemo, FeasibilityReport, PipelinePlan, SampleRows, and ApprovalGate.
```

## Pagination/Limits Mode

```text
Use $universal-data-acquisition-pipeline in pagination-limits mode for TARGET_SITE_OR_ENDPOINT. Use tiny sparse probes only. Determine max page size, cursor or offset behavior, deep pagination failure mode, completeness ceiling, and whether partitions can safely increase coverage.
```

## Source Comparison Mode

```text
Use $universal-data-acquisition-pipeline in source-comparison mode for TARGET_DATA. Compare official API, public XAPI, sitemap plus detail, embedded JSON, HTML, rendered DOM, and reject paths. Recommend fastest viable, cheapest robust, and highest-coverage routes.
```

## Data Acquisition Decision Memo

```text
Use $universal-data-acquisition-pipeline to decide whether TARGET_DATA is worth collecting. I want the fastest viable route, cheapest robust route, highest-coverage route, trapdoors, stop conditions, and a recommended next move. Do not run a full collection.
```

## Public API Pattern Hunt

```text
Use $universal-data-acquisition-pipeline to inspect TARGET_SITE for public data patterns: official APIs, Next.js/Nuxt data, GraphQL, Algolia, Shopify, Salesforce Commerce Cloud, storefront XAPI, sitemaps, JSON-LD, feeds, and search endpoints. Return evidence and next probes only.
```

## Playwright Fallback

```text
Use $universal-data-acquisition-pipeline to assess TARGET_SITE where no public API is obvious. Check APIs, feeds, sitemaps, embedded JSON, and static HTML first. If those fail, use Playwright for a tiny rendered-DOM probe only, inspect network traffic for public structured routes, and return evidence, sample rows, feasibility, and an approval gate.
```

## Owned Session Pipeline

```text
Use $universal-data-acquisition-pipeline in owned-session mode for TARGET_PORTAL. I have authorized access and will provide local Playwright storage state outside the repo. Classify the source as non-public, design the pipeline, secret handling, quality gates, checkpoints, and approval gate. Do not publish this as a public case study.
```

## Production Scraping Pipeline

```text
Use $universal-data-acquisition-pipeline to design a production-grade scraping/API pipeline for TARGET_DATA. Include source access class, endpoint/browser strategy, schema, raw/staged/normalized outputs, dedupe, incremental refresh, checkpoints, retries, rate-limit strategy, observability, quality tests, and run reports.
```
