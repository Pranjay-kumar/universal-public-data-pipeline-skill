# Case Study: Yahoo Finance Public Market And News Probe

## Run Date

2026-06-10

## User Ask

Test a finance-style public data source as one of the diverse Patchright/data-acquisition cases, without broad collection.

## ModeSelection

```json
{
  "mode": "public-api-feasibility",
  "will_probe": true,
  "will_collect_beyond_sample": false,
  "runtime": "curl",
  "target": "Yahoo Finance public quote and news metadata"
}
```

## SourceAccessClass

```json
{
  "class": "public",
  "publishability": "public_result",
  "reason": "The tested routes returned unauthenticated JSON/XML over public URLs. No cookies, browser storage, account data, or CAPTCHA handling were used."
}
```

## Probe Commands

```powershell
curl.exe -L -s -D outputs\market-quote-headers.txt -A "universal-data-acquisition-pipeline-skill/0.1 tiny feasibility probe" "https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=1d&interval=1d" -o outputs\market-yahoo-chart-aapl.json
curl.exe -L -s -D outputs\market-rss-headers.txt -A "universal-data-acquisition-pipeline-skill/0.1 tiny feasibility probe" "https://finance.yahoo.com/news/rssindex" -o outputs\market-yahoo-rss.xml
```

## ProbeResults

| Probe | Status | Content Type | Result |
|---|---:|---|---|
| Yahoo chart API | 200 | `application/json;charset=utf-8` | Returned quote/chart metadata for `AAPL` |
| Yahoo Finance RSS | 200 | `application/xml` | Returned current finance news feed items |

Quote API evidence:

- endpoint: `https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=1d&interval=1d`
- response included `chart.result[0].meta.symbol: AAPL`
- response included `currency`, `exchangeName`, `instrumentType`, `regularMarketTime`, `regularMarketPrice`, `fiftyTwoWeekHigh`, `fiftyTwoWeekLow`, and `regularMarketVolume`
- response included `timestamp` and `indicators.quote` arrays with `open`, `high`, `low`, `close`, and `volume`
- response advertised valid ranges such as `1d`, `5d`, `1mo`, `3mo`, `1y`, `5y`, `10y`, `ytd`, and `max`

RSS evidence:

- endpoint: `https://finance.yahoo.com/news/rssindex`
- feed title: `Yahoo Finance`
- feed TTL: `5`
- items included `title`, `link`, `pubDate`, `source`, `guid`, and media thumbnail metadata

## EndpointPlan

```json
{
  "recommended_path": "public_api_plus_rss",
  "quote_endpoint": "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}",
  "quote_params": {
    "range": "1d",
    "interval": "1d"
  },
  "news_endpoint": "https://finance.yahoo.com/news/rssindex",
  "pagination": "not tested; chart API supports range/interval parameters and RSS returns a bounded feed",
  "sample_extract": [
    "symbol",
    "exchangeName",
    "instrumentType",
    "regularMarketTime",
    "regularMarketPrice",
    "regularMarketVolume",
    "timestamp",
    "ohlcv",
    "news_title",
    "news_link",
    "news_pubDate",
    "news_source"
  ]
}
```

## FeasibilityScorecard

| Dimension | Score |
|---|---|
| Coverage | Medium for market quote/chart metadata; medium for headline feed metadata |
| Stability | Medium; public endpoints worked without browser state, but Yahoo endpoints can change |
| Pagination depth | Not proven for news; chart data controlled by range/interval |
| Refreshability | High for small symbol/news refreshes with caching and backoff |
| Data quality | High for quotes; medium for RSS news metadata |
| Engineering cost | S |
| Legal/ToS risk | Medium |
| Recommended path | Public chart API plus RSS feed |
| Traffic light | Green-Yellow |

## DataAcquisitionMemo

Fastest route:

```text
Public chart API for symbol quote/time-series metadata + Yahoo Finance RSS for finance headlines.
```

Cheapest robust route:

```text
Use the chart API for a bounded symbol list, cache responses, and use RSS for feed-level news metadata. Avoid page scraping unless article detail enrichment is approved separately.
```

Trapdoors:

- News feed pagination beyond the RSS document was not tested.
- Yahoo public endpoints may enforce rate limits or change response shape.
- This probe did not test licensed exchange redistribution constraints.

## ApprovalGate

```json
{
  "approved_for_full_run": false,
  "requires_user_go_ahead": true,
  "next_step": "Choose symbol universe and whether headline RSS metadata is enough or article detail enrichment is required."
}
```

## Evidence Files

- `outputs/market-quote-headers.txt`
- `outputs/market-yahoo-chart-aapl.json`
- `outputs/market-rss-headers.txt`
- `outputs/market-yahoo-rss.xml`
