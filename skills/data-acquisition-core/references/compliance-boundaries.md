# Compliance Boundaries

Classify access first. Public data is preferred, but owned-session, licensed, partner, and internal pipelines are allowed when the user has authorization and outputs are labeled correctly. Do not escalate access or bypass controls.

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
- Playwright or rendered-browser sampling for public pages when lower-cost public data routes fail
- User-owned authenticated browser/session state for data the user is authorized to access
- Licensed, partner, or internal APIs when the user provides the authorization basis
- Rate-limit detection and compliant throughput planning

## Disallowed

- Authentication bypass
- Login or paywall circumvention
- Secret extraction
- CAPTCHA solving
- Private account access without authorization
- Credential or stored-cookie extraction
- Committing, printing, or publishing cookies/tokens/session files
- Browser fingerprint evasion
- Stealth plugins or browser settings intended to defeat bot detection
- Header spoofing intended to bypass security, bot controls, geography locks, or access decisions
- Hidden accounts
- Exploit generation
- Rate-limit bypass

If access appears restricted, reduce feasibility, report the limitation, and stop escalation.

## Cookies And Sessions

Cookies are allowed only as user-local inputs for `owned_session`, `provided_credentials`, `licensed_api`, `partner_api`, or `internal_system` access classes. They are never allowed for public case-study publication.

Required behavior:

- require explicit user opt-in
- keep session files local and gitignored
- never display cookie values
- never include secrets in screenshots, logs, reports, or samples
- mark outputs `non_public_authorized_result`
- stop if the session hits CAPTCHA, verification, or access-control boundaries

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
