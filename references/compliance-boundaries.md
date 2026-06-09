# Compliance Boundaries

Use public data only. Do not escalate access.

## Allowed

- Public websites
- Public APIs
- Public unauthenticated JSON endpoints used by the site
- Public XHR/fetch/page-data routes
- Search pages and endpoints
- Static HTML
- Structured metadata
- Sitemaps, catalogs, and public directories
- Open datasets
- Documentation pages
- Public media, business, event, ecommerce, and catalog metadata
- Normal browser-style headers when needed for ordinary public responses
- Rate-limit detection and compliant throughput planning

## Disallowed

- Authentication bypass
- Login or paywall circumvention
- Secret extraction
- CAPTCHA solving
- Private account access
- Credential or stored-cookie use
- Browser fingerprint evasion
- Header spoofing intended to bypass security, bot controls, geography locks, or access decisions
- Hidden accounts
- Exploit generation
- Rate-limit bypass

If access appears restricted, reduce feasibility, report the limitation, and stop escalation.

## Rate Limits

Do not bypass rate limits. Instead:

- detect them
- record the error/headers
- estimate safe throughput
- add backoff
- use caching
- checkpoint
- write incrementally
- ask for approval before broad collection

## Privacy And Social Graphs

Public does not automatically mean low-risk. For social graphs, followers, following, profiles, comments, reviews, or user-generated content:

- collect minimal samples for feasibility
- avoid unnecessary personal fields
- report privacy and ToS risks
- separate technical feasibility from responsible full-collection feasibility
- require explicit approval for broad collection

