# Patchright Warm-Session Test Plan

## Purpose

Validate whether the skill can use Patchright warm browser sessions to discover useful structured data paths without relying on sitemaps first.

Each case should answer:

- Does Patchright load the normal user-visible page?
- Does the page expose structured data through public APIs, XHR/fetch, JSON-LD, hydration state, or SSR HTML?
- Is pagination or broad coverage visible from the public page?
- Does repeated probing trigger access-control or human-verification boundaries?
- Should the result be Green, Yellow, or Red for a reusable pipeline?

## Test Matrix

| # | Target | Dataset | Test URL | Expected Best Path | Status |
|---:|---|---|---|---|---|
| 1 | Macy's | Men's shirts category products | `https://www.macys.com/shop/mens-clothing/mens-shirts?id=20626` | Patchright visible page -> SSR product grid and pagination; no category API observed | Tested |
| 2 | StreetEasy | Lower East Side rentals | `https://streeteasy.com/for-rent/les` | Patchright visible page -> JSON-LD plus `api-v6` `searchRentals` response; sensitive to repeat probes | Tested |
| 3 | Target | Retail category products | `https://www.target.com/c/shirts-men-s-clothing/target-brands/-/N-5xu28Zxmf9o` | Patchright page -> Target Redsky PLP/product-summary JSON APIs -> rendered product cards | Tested: Green |
| 4 | Eventbrite | Public event listings | `https://www.eventbrite.com/d/ny--new-york/events/` | Patchright page -> JSON-LD event list -> destination API responses | Tested: Yellow |
| 5 | Greenhouse/Lever ATS | Public job postings | Greenhouse Stripe + Lever DNB public boards | Direct public job-board APIs; Patchright unnecessary | Tested: Green |
| 6 | NYC Open Data | Government 311 dataset | `https://data.cityofnewyork.us/resource/erm2-nwe9.json` | Official Socrata API with `$limit`, `$offset`, `$select`, `$order`, and metadata | Tested: Green |
| 7 | Travel search | Public travel search/reference data | Expedia, Rome2Rio, Wanderu, Amtrak | Aggregators blocked; official-provider Amtrak reference JSON worked | Tested: Yellow |
| 8 | NPR | Public article/search metadata | `https://feeds.npr.org/1001/rss.xml` | Public RSS feed -> sampled article Open Graph/JSON-LD; search page secondary | Tested: Green-Yellow |
| 9 | Yahoo Finance | Public market/news metadata | `https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=1d&interval=1d` | Public chart JSON API plus Yahoo Finance RSS | Tested: Green-Yellow |
| 10 | OpenStreetMap/Nominatim | Public place/location data | `https://nominatim.openstreetmap.org/search?...` | Official Nominatim API for tiny lookup; OSM extracts for broad collection | Tested: Green-Yellow |

## Current Findings

Case 1 and case 2 are written as standalone probe-backed case studies:

- [Macy's Patchright Men's Shirts Probe](macys-patchright-mens-shirts.md)
- [StreetEasy Patchright LES Rentals Probe](streeteasy-patchright-les-rentals.md)
- [Target Patchright Category Products](target-patchright-category-products.md)
- [Eventbrite Patchright Public Events](eventbrite-patchright-public-events.md)
- [ATS Public Jobs Probe](ats-public-jobs-probe.md)
- [NYC Open Data Socrata Probe](nyc-open-data-socrata-probe.md)
- [Travel Search Patchright Feasibility](travel-search-patchright-feasibility.md)
- [News Metadata Public Probe](news-metadata-public-probe.md)
- [Yahoo Finance Public Market And News Probe](market-news-public-probe.md)
- [OpenStreetMap Nominatim Public Places Probe](osm-nominatim-public-places-probe.md)

All cases used tiny bounded probes only. No broad collection was approved or performed.
