# Pattern Library

Use this library to recognize common public data routes before falling back to HTML scraping.

## Public API Archetypes

| Pattern | Where To Look | Best For | Probe |
|---|---|---|---|
| Official API | docs, developer portal, open-data portal | durable public datasets | auth requirements, quotas, bulk export |
| Next.js data | `__NEXT_DATA__`, `/_next/data/{buildId}/...json` | products, articles, listings | build ID stability, route params |
| Nuxt/app state | `window.__NUXT__`, payload files | catalogs, profiles, content | payload shape, route coverage |
| GraphQL | `/graphql`, persisted query hashes | search, profiles, feeds | operation names, variables, pagination |
| Algolia | app ID, index name, search key in public JS | ecommerce, docs, search | index coverage, filters, max pages |
| Shopify | `/products.json`, `/collections/{handle}/products.json` | stores and catalogs | page size, variants, inventory fields |
| Salesforce Commerce Cloud | `/s/{site}/dw/shop/...`, search/refinement APIs | retail catalogs | category IDs, refinements, product detail |
| Storefront XAPI | `/xapi/`, `/api/`, `/bff/`, `/gateway/` | retail and marketplace pages | required headers, device/site params |
| Sitemap plus detail | sitemap indexes, gzipped XML | broad URL/ID discovery | detail endpoint enrichment |
| JSON-LD | `<script type="application/ld+json">` | products, events, articles | schema completeness, duplicate entities |
| Mobile API mirror | public app traffic or documented app endpoints | social/profile/listing data | same public access boundary, pagination caps |
| Autocomplete/search | query suggestion endpoints | entity discovery | alphabet/query coverage, dedupe burden |
| Feed formats | RSS, Atom, ICS, CSV, GeoJSON | events, posts, public records | freshness, historical depth |

## Discovery Tells

- Public JavaScript bundles containing endpoint bases, operation names, build IDs, index names, or feature flags.
- Public HTML hydration state with IDs that can seed detail endpoints.
- Category or sitemap URLs that reveal stable IDs even when listing pages are dynamic.
- Network calls with `_deviceType`, `_regionCode`, locale, currency, store, or channel params.
- Pagination params named `page`, `offset`, `cursor`, `after`, `start`, `limit`, `count`, `rows`, or `size`.

## Trapdoors

- Public search APIs may cap deep pagination even when totals are high.
- Higher `limit` values may silently coerce to a maximum page size.
- Category crawls can overcount because products appear in multiple categories.
- Sort order changes can create duplicates or missed rows during refresh.
- Edge blocks may appear only at volume, not in tiny probes.
- Embedded JSON can omit fields available only from detail endpoints.

## Pattern Output

When a pattern is found, record:

```json
{
  "pattern": "",
  "evidence": "",
  "endpoint_or_route": "",
  "fields_visible": [],
  "pagination_guess": "",
  "next_probe": "",
  "confidence": 0.0
}
```
