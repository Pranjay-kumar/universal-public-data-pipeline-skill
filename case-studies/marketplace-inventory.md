# Case Study: Marketplace Inventory Feasibility

## User Ask

Collect all public listings from a marketplace.

## Mode

Start in `dataset-design`, then use `pagination-limits`.

Marketplace asks are dangerous because "all listings" may be unnecessary, expensive, incomplete, or impossible through public pagination.

## DatasetNeed

```json
{
  "decision_or_workflow": "Estimate active inventory and pricing distribution for selected categories and geographies.",
  "entity_grain": "listing_snapshot",
  "required_fields": [
    "listing_id_or_url",
    "source",
    "observed_at",
    "title",
    "price",
    "currency",
    "category",
    "location_or_geo",
    "availability_status"
  ],
  "nice_to_have_fields": [
    "seller_id",
    "condition",
    "images",
    "shipping",
    "attributes",
    "posted_at"
  ],
  "freshness": "daily for active inventory, weekly for market sizing",
  "history": "snapshot history to infer listing churn",
  "coverage_target": "representative category/geo slices unless full public pagination is proven",
  "join_keys": ["listing_id_or_url"],
  "privacy_or_risk_fields": ["seller personal contact info", "buyer data"],
  "exclusions": ["private messages", "account-only seller analytics", "contact harvesting"],
  "useless_if": ["deep pagination caps hide most inventory", "sorting changes produce unstable samples", "dedupe cannot be trusted"]
}
```

## Pagination Questions

Probe with tiny sparse requests:

- maximum effective page size
- offset/cursor depth
- whether total counts are real or approximate
- whether sort order is stable
- whether filters can partition the dataset
- whether category/geo partitions overlap

## Traffic Light Examples

- `Green`: public API exposes stable listing IDs, filters, and complete pageable partitions.
- `Yellow`: public search works but caps deep pagination; use sampled category/geo slices.
- `Red`: data requires login, private tokens, CAPTCHA solving, or rate-limit bypass.

## Why This Matters

A marketplace can look easy on page one and impossible at page 200. Pagination/Limits Mode prevents a team from confusing "we can scrape results" with "we can collect the market."
