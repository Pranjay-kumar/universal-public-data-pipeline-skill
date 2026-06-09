# Case Study: Public Jobs And Hiring Signals

## User Ask

Collect public job listings for a set of companies.

## Mode

Use `source-comparison` after `dataset-design`, because job data is often exposed through several routes with different coverage:

- company career pages
- applicant tracking system public boards
- search/listing APIs
- sitemap pages
- embedded JSON
- HTML fallback

## DatasetNeed

```json
{
  "decision_or_workflow": "Track hiring activity and role changes for selected companies.",
  "entity_grain": "job_posting",
  "required_fields": [
    "company",
    "job_id_or_url",
    "title",
    "location",
    "department",
    "posted_or_first_seen_at",
    "source_url",
    "status"
  ],
  "nice_to_have_fields": [
    "salary_range",
    "employment_type",
    "description",
    "remote_policy",
    "seniority",
    "skills"
  ],
  "freshness": "daily or weekly depending on use case",
  "history": "first seen, last seen, and removed-at tracking",
  "coverage_target": "selected companies and official public boards",
  "join_keys": ["company", "job_id_or_url", "normalized_title", "location"],
  "privacy_or_risk_fields": ["applicant data", "recruiter contact data"],
  "exclusions": ["application portals behind login", "candidate data"],
  "useless_if": ["job IDs are unstable", "removed jobs cannot be detected", "company mapping is unreliable"]
}
```

## Route Comparison

| Route | Strength | Weakness |
|---|---|---|
| ATS public board/API | structured, stable IDs, good refresh | provider-specific schemas |
| Company career sitemap | broad discovery | sparse metadata |
| Embedded JSON | often complete on detail pages | route-specific parsing |
| HTML cards | easy sample | brittle for refresh and dedupe |

## Recommended Pipeline Shape

```text
company seed list
-> source resolver
-> public board/listing endpoint or sitemap
-> detail enrichment
-> posting snapshot table
-> first_seen/last_seen status tracking
```

## Why This Matters

For hiring signals, removed jobs matter as much as current jobs. The pipeline must track snapshots over time, not just scrape today's listings.
