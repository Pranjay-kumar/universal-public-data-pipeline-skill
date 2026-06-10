# Case Study: Public News Article Metadata Via NPR

## Run Date

2026-06-10

## User Ask

Run a tiny data-acquisition feasibility probe for public article/search metadata using NPR or The New York Times. Prefer public RSS, search, page-data, or embedded JSON. Do not perform broad collection, use paywall/auth paths, or bypass access controls.

## ModeSelection

```json
{
  "mode": "feasibility",
  "target": "NPR public article metadata",
  "will_probe": true,
  "will_collect_beyond_sample": false,
  "patchright_used": false,
  "reason": "Public RSS and article HTML metadata were enough; browser automation was not needed."
}
```

## DatasetNeed

```json
{
  "decision_or_workflow": "Track public article metadata from a reputable news source for freshness, topic coverage, and article URL discovery.",
  "entity_grain": "article_metadata_snapshot",
  "required_fields": [
    "source",
    "feed_or_section",
    "title",
    "url",
    "guid",
    "published_at",
    "author",
    "description",
    "observed_at"
  ],
  "nice_to_have_fields": [
    "image_url",
    "image_alt",
    "article_schema_json",
    "og_title",
    "og_type",
    "topic_or_section"
  ],
  "freshness": "poll RSS feeds every 10-60 minutes depending on use case and cache headers",
  "history": "snapshot first_seen, last_seen, and changed metadata fields",
  "coverage_target": "selected NPR topic feeds and optionally one article detail page per new item",
  "exclusions": [
    "full article text collection",
    "paywalled/authenticated content",
    "comments or user data",
    "broad site crawling"
  ],
  "useless_if": [
    "feeds disappear or become incomplete for the required sections",
    "article URLs or GUIDs are unstable",
    "freshness requirements are lower than feed cache windows allow"
  ]
}
```

## SourceAccessClass

```json
{
  "class": "public_unauthenticated",
  "allowed_paths": [
    "NPR public RSS topic feeds",
    "NPR public article pages for metadata enrichment",
    "NPR public search HTML as a secondary route"
  ],
  "disallowed_paths": [
    "paywall bypass",
    "authentication",
    "CAPTCHA or bot-management bypass",
    "collection of private/user-specific data"
  ]
}
```

## Commands

RSS/topic feed probe:

```powershell
curl.exe -L -s -A "Mozilla/5.0 data-acquisition-tiny-probe" -D - https://feeds.npr.org/1001/rss.xml | Select-Object -First 80
```

Structured RSS sample extraction:

```powershell
@'
const rssUrl = 'https://feeds.npr.org/1001/rss.xml';
const res = await fetch(rssUrl, { headers: { 'user-agent': 'Mozilla/5.0 data-acquisition-tiny-probe' } });
const text = await res.text();
const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3).map((m) => {
  const block = m[1];
  const pick = (re) => (block.match(re)?.[1] || '').replace(/<!\[CDATA\[|\]\]>/g, '').trim();
  return {
    title: pick(/<title>([\s\S]*?)<\/title>/),
    link: pick(/<link>([\s\S]*?)<\/link>/),
    guid: pick(/<guid>([\s\S]*?)<\/guid>/),
    pubDate: pick(/<pubDate>([\s\S]*?)<\/pubDate>/),
    creator: pick(/<dc:creator>([\s\S]*?)<\/dc:creator>/),
    hasMedia: /<content:encoded>|<media:/.test(block)
  };
});
console.log(JSON.stringify({
  url: rssUrl,
  status: res.status,
  contentType: res.headers.get('content-type'),
  cacheControl: res.headers.get('cache-control'),
  itemCount: (text.match(/<item>/g)||[]).length,
  channelTitle: text.match(/<channel>[\s\S]*?<title>(.*?)<\/title>/)?.[1],
  lastBuildDate: text.match(/<lastBuildDate>(.*?)<\/lastBuildDate>/)?.[1],
  sampleItems: items
}, null, 2));
'@ | node --input-type=module -
```

Public search page probe:

```powershell
@'
const url = 'https://www.npr.org/search?query=climate&page=1';
const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 data-acquisition-tiny-probe' } });
const text = await res.text();
const cookies = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
console.log(JSON.stringify({
  url,
  status: res.status,
  contentType: res.headers.get('content-type'),
  setCookieCount: cookies.length,
  title: text.match(/<title>(.*?)<\/title>/s)?.[1],
  robots: text.match(/<meta name="robots" content="(.*?)"/s)?.[1],
  hasSearchForm: /search/.test(text),
  hasServerConstants: /NPR\.ServerConstants/.test(text),
  apiHostMentioned: text.includes('"apiHost":"https:\/\/api.npr.org"'),
  htmlLength: text.length
}, null, 2));
'@ | node --input-type=module -
```

Single article metadata enrichment probe:

```powershell
@'
const url = 'https://www.npr.org/2026/06/10/nx-s1-5853077/inflation-over-4-cpi-gasoline-prices';
const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 data-acquisition-tiny-probe' } });
const text = await res.text();
const ldCount = (text.match(/<script type="application\/ld\+json"/g) || []).length;
const meta = (name) => text.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`, 'i'))?.[1] || '';
console.log(JSON.stringify({
  url,
  status: res.status,
  contentType: res.headers.get('content-type'),
  title: text.match(/<title>(.*?)<\/title>/s)?.[1],
  ldJsonScriptCount: ldCount,
  ogTitle: meta('og:title'),
  ogType: meta('og:type'),
  articlePublishedTime: meta('article:published_time'),
  htmlLength: text.length
}, null, 2));
'@ | node --input-type=module -
```

## Observed Evidence

### RSS Feed

Endpoint:

```text
https://feeds.npr.org/1001/rss.xml
```

Observed response:

```json
{
  "status": 200,
  "contentType": "text/xml;charset=UTF-8",
  "cacheControl": "max-age=412",
  "itemCount": 10,
  "channelTitle": "NPR Topics: News",
  "lastBuildDate": "Wed, 10 Jun 2026 11:08:15 -0400"
}
```

Sample item fields observed:

```json
[
  {
    "title": "Inflation tops 4% for the first time in 3 years on spike in gasoline prices",
    "link": "https://www.npr.org/2026/06/10/nx-s1-5853077/inflation-over-4-cpi-gasoline-prices",
    "guid": "https://www.npr.org/2026/06/10/nx-s1-5853077/inflation-over-4-cpi-gasoline-prices",
    "pubDate": "Wed, 10 Jun 2026 09:08:58 -0400",
    "creator": "Scott Horsley",
    "hasMedia": true
  },
  {
    "title": "July 1 brings big student loan changes. Here&apos;s what you need to know",
    "link": "https://www.npr.org/2026/06/10/nx-s1-5835633/student-loans-guide-education-changes-repayment-plan",
    "guid": "https://www.npr.org/2026/06/10/nx-s1-5835633/student-loans-guide-education-changes-repayment-plan",
    "pubDate": "Wed, 10 Jun 2026 07:30:00 -0400",
    "creator": "Cory Turner",
    "hasMedia": true
  }
]
```

### Search Page

Endpoint:

```text
https://www.npr.org/search?query=climate&page=1
```

Observed response:

```json
{
  "status": 200,
  "contentType": "text/html;charset=UTF-8",
  "setCookieCount": 3,
  "title": "NPR Search : NPR",
  "robots": "noindex,nofollow",
  "hasSearchForm": true,
  "hasServerConstants": true,
  "apiHostMentioned": false,
  "htmlLength": 50567
}
```

The search page is public HTML, but it is a less attractive acquisition path than RSS because it is marked `noindex,nofollow` and returns bot-management cookies. It should be treated as a secondary page-data route, not the default route.

### Article Page Metadata

Endpoint:

```text
https://www.npr.org/2026/06/10/nx-s1-5853077/inflation-over-4-cpi-gasoline-prices
```

Observed response:

```json
{
  "status": 200,
  "contentType": "text/html; charset=UTF-8",
  "title": "Inflation tops 4% for the first time in 3 years on spike in gasoline prices : NPR",
  "ldJsonScriptCount": 1,
  "ogTitle": "Inflation tops 4% for the first time in 3 years on spike in gasoline prices",
  "ogType": "article",
  "articlePublishedTime": "",
  "htmlLength": 80331
}
```

## EndpointPlan

```json
{
  "primary_route": {
    "type": "rss_feed",
    "template": "https://feeds.npr.org/{topic_id}/rss.xml",
    "example_topic_id": "1001",
    "pagination": "not applicable; feed returns latest items",
    "incremental_key": "guid",
    "watermark": "pubDate",
    "fields": [
      "channel.title",
      "channel.lastBuildDate",
      "item.title",
      "item.description",
      "item.pubDate",
      "item.link",
      "item.guid",
      "item.dc:creator",
      "item.content:encoded media references"
    ]
  },
  "detail_enrichment_route": {
    "type": "article_html_metadata",
    "template": "{item.link}",
    "sample_limit": "one detail page per new article only when extra metadata is required",
    "fields": [
      "title",
      "Open Graph metadata",
      "application/ld+json"
    ]
  },
  "secondary_route": {
    "type": "search_html",
    "template": "https://www.npr.org/search?query={query}&page={page}",
    "status": "usable only for tiny manual feasibility checks; not recommended as the default pipeline route"
  }
}
```

## HeaderProfile

```json
{
  "required": [],
  "optional": [
    "User-Agent",
    "Accept: application/rss+xml, application/xml, text/xml, text/html"
  ],
  "forbidden": [
    "cookies",
    "auth tokens",
    "captcha tokens",
    "paywall/session tokens",
    "fingerprint spoofing headers"
  ],
  "notes": "RSS and article metadata probes succeeded unauthenticated with a normal User-Agent. Do not persist or replay bot-management cookies from search pages."
}
```

## FeasibilityScorecard

| Dimension | Score | Notes |
|---|---:|---|
| Access legality/safety | 9 | Public unauthenticated feeds and public article pages; no auth or paywall path used. |
| Reliability | 8 | RSS is stable and cacheable; search page is less reliable. |
| Completeness | 7 | Strong for selected topics/latest items, not historical full-archive search. |
| Freshness | 8 | RSS exposes `lastBuildDate`, `pubDate`, and cache headers. |
| Schema quality | 8 | RSS fields are structured; article pages add OG/JSON-LD metadata. |
| Cost | 9 | Simple HTTP GET plus XML/HTML parsing. |
| Operational risk | 8 | Low if feed polling respects cache headers and article enrichment is bounded. |

Final rating: **Green** for selected NPR topic-feed article metadata. **Yellow** for arbitrary keyword search/history because the public search page is HTML, noindex, and sets bot-management cookies.

## DataAcquisitionMemo

The best acquisition route is not Patchright or search-page scraping. Use NPR topic RSS feeds as the source of truth for latest public article metadata, keyed by `guid` and `link`, with `pubDate` and `lastBuildDate` as freshness signals. For new items that need richer metadata, fetch the article page once and parse Open Graph plus `application/ld+json`.

This path is small, cache-aware, and avoids brittle browser automation. It will not provide exhaustive historical search results by itself. If historical search is required, that should become a separate source-comparison task using official/licensed APIs, archives, or explicit source permission.

## FeasibilityReport

```json
{
  "decision": "Green",
  "scope": "selected NPR public topic feeds plus bounded article metadata enrichment",
  "not_approved_for": [
    "full article body scraping",
    "all NPR archive collection",
    "paywall/authenticated paths",
    "bot-management or CAPTCHA bypass",
    "cookie replay from search pages"
  ],
  "recommended_next_step": "Build a tiny RSS poller that honors cache headers, stores raw XML snapshots, normalizes article metadata, and enriches only newly observed article URLs when needed."
}
```

## PipelineQualityPlan

- Store raw RSS XML per run for reproducibility.
- Normalize XML into `article_metadata_snapshot` rows.
- Dedupe by `guid`; fall back to canonical `link`.
- Track `observed_at`, feed `lastBuildDate`, and item `pubDate`.
- Respect `Cache-Control`/reasonable polling intervals.
- Enrich detail pages only for newly observed items and only for metadata fields.
- Add quality checks for missing `title`, `link`, `guid`, `pubDate`, and duplicate GUIDs.

## PipelinePlan

```yaml
pipeline:
  name: npr_public_article_metadata
  source_access_class: public_unauthenticated
  raw:
    - fetch: https://feeds.npr.org/{topic_id}/rss.xml
      store: raw/rss/{topic_id}/{observed_at}.xml
  staged:
    - parse_rss_items:
        key: guid
        fields:
          - title
          - description
          - pubDate
          - link
          - guid
          - dc:creator
          - media_from_content_encoded
  enrich:
    - fetch_article_metadata:
        when: new_guid and extra_metadata_required
        limit: bounded_new_items_only
        parse:
          - open_graph
          - application_ld_json
  normalized:
    table: article_metadata_snapshots
    primary_key:
      - source
      - guid
      - observed_at
```

## SampleRows

```json
[
  {
    "source": "NPR",
    "feed": "NPR Topics: News",
    "guid": "https://www.npr.org/2026/06/10/nx-s1-5853077/inflation-over-4-cpi-gasoline-prices",
    "title": "Inflation tops 4% for the first time in 3 years on spike in gasoline prices",
    "url": "https://www.npr.org/2026/06/10/nx-s1-5853077/inflation-over-4-cpi-gasoline-prices",
    "published_at": "Wed, 10 Jun 2026 09:08:58 -0400",
    "author": "Scott Horsley",
    "has_media": true
  },
  {
    "source": "NPR",
    "feed": "NPR Topics: News",
    "guid": "https://www.npr.org/2026/06/10/nx-s1-5835633/student-loans-guide-education-changes-repayment-plan",
    "title": "July 1 brings big student loan changes. Here&apos;s what you need to know",
    "url": "https://www.npr.org/2026/06/10/nx-s1-5835633/student-loans-guide-education-changes-repayment-plan",
    "published_at": "Wed, 10 Jun 2026 07:30:00 -0400",
    "author": "Cory Turner",
    "has_media": true
  }
]
```

## Evidence File Paths

No separate raw evidence artifact was written because this worker was assigned an isolated write scope of one repo file. Evidence is embedded above from command stdout.

```text
C:\Users\PranjayKumar\Documents\New project\universal-data-acquisition-pipeline-skill\case-studies\news-metadata-public-probe.md
```

## ApprovalGate

Approved for next step only:

- Build a bounded RSS metadata prototype for selected NPR feed IDs.
- Limit article detail enrichment to newly observed feed items.
- Store raw XML and normalized metadata snapshots.

Not approved without a new explicit go-ahead:

- Broad historical collection.
- Full article body scraping.
- Search-result crawling at scale.
- Authenticated, paywalled, or bot-management bypass routes.

Final classification: **Green** for selected public NPR RSS/article metadata; **Yellow** for NPR keyword search pages as a primary route.
