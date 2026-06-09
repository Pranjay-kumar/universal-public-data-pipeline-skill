# Probing

Probe before scraping. Use tiny, reversible requests that reveal shape and feasibility without collecting unnecessary data.

## Probe Checklist

For each candidate source, test:

- status code
- redirects
- content type
- response size
- JSON validity
- schema shape
- entity IDs
- timestamps/freshness
- pagination params
- terminal page behavior
- limit caps
- offset/cursor caps
- error responses
- required headers
- rate-limit headers or throttling behavior
- robots/terms signals when relevant

## Header Minimization

Start with:

```json
{
  "User-Agent": "Mozilla/5.0 public-data-pipeline/0.1",
  "Accept": "application/json,text/html,*/*",
  "Accept-Language": "en-US,en;q=0.9"
}
```

Remove headers one by one. Record the minimum set that still returns the public unauthenticated data.

Allowed normal headers include:

- `User-Agent`
- `Accept`
- `Accept-Language`
- `Referer`
- `Origin`

Do not use cookies, auth tokens, CAPTCHA tokens, fingerprint headers, or headers intended to bypass access controls.

## Pagination Probing

Identify:

- page size default
- maximum `limit`
- offset/cursor behavior
- `nextUrl` reliability
- terminal page behavior
- hard server-side caps
- duplicated records across pages

Use sparse probes for huge datasets:

- `limit=1&offset=0`
- small offsets
- round-number offsets
- near reported totals
- boundary checks after errors

Do not harvest broad lists merely to learn pagination.

## Limit And Rate Behavior

Detect limits; do not bypass them.

Document:

- max page size
- max accessible offset
- retryable errors
- non-retryable access errors
- suggested delay
- checkpoint interval
- estimated runtime

Design within limits using:

- backoff
- caching
- resume
- incremental writes
- dedupe
- sampling
- user approval gates

## ProbeResults Shape

```json
{
  "source": "",
  "endpoint_template": "",
  "http_status": 200,
  "content_type": "application/json",
  "required_headers": [],
  "required_params": [],
  "pagination": {
    "page_size_default": null,
    "page_size_max": null,
    "cursor_or_offset": "",
    "terminal_behavior": "",
    "hard_cap": null
  },
  "sample_fields": [],
  "failure_modes": [],
  "confidence": 0.0
}
```

