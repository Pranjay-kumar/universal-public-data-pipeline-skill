# Case Study: Retail Price Intelligence Dataset Design

## User Ask

I need competitor pricing data.

## Better First Question

The useful dataset depends on the decision:

- price alerting
- assortment gap analysis
- promo monitoring
- market basket comparison
- brand/category trend research

Do not start by collecting every visible product. First design the smallest dataset that supports the workflow.

## Mode

```json
{
  "mode": "dataset-design",
  "reason": "The user described a business goal, not a collection-ready dataset.",
  "will_probe": false,
  "will_collect_beyond_sample": false
}
```

## DatasetNeed

```json
{
  "decision_or_workflow": "Track competitor price changes for matched products and alert when a material price move occurs.",
  "entity_grain": "price_observation",
  "required_fields": [
    "source",
    "observed_at",
    "product_id_or_url",
    "canonical_product_key",
    "title",
    "brand",
    "current_price",
    "currency",
    "availability",
    "category"
  ],
  "nice_to_have_fields": [
    "list_price",
    "promotion_text",
    "rating",
    "review_count",
    "image_url",
    "variant_attributes"
  ],
  "freshness": "daily for normal monitoring, hourly only for high-volatility categories",
  "history": "current snapshot plus price observations over time",
  "coverage_target": "matched priority SKUs and top category results, not every product on the site",
  "join_keys": ["canonical_product_key", "brand", "normalized_title", "gtin_or_model_when_available"],
  "privacy_or_risk_fields": [],
  "exclusions": ["personalized prices", "cart-only discounts", "private account offers"],
  "useless_if": [
    "product matching is too weak",
    "prices require login or cart state",
    "coverage misses priority categories",
    "refresh cannot run consistently"
  ]
}
```

## Recommended Source Strategy

```text
category sitemap or category API
-> product/listing endpoint
-> product detail endpoint only for enrichment
-> daily price observation table
```

## Feasibility Focus

The key feasibility question is not "can we collect products?" It is whether public sources expose enough stable identifiers and price fields to match products over time.

## Why This Matters

Without Dataset Design Mode, the agent may overcollect catalog metadata and still fail the actual business workflow because it never solved product matching or refresh cadence.
