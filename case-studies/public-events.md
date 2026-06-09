# Case Study: Public Events Pipeline

## User Ask

Collect public event listings for a city and topic.

## Mode Ladder

1. `dataset-design`: define whether the user needs discovery, calendar sync, lead generation, or trend analysis.
2. `feasibility`: compare event source types.
3. `endpoint-discovery`: look for APIs, feeds, embedded JSON, and search endpoints.
4. `sample-validation`: normalize a tiny set of events.

## DatasetNeed

```json
{
  "decision_or_workflow": "Maintain a refreshable calendar of relevant public events.",
  "entity_grain": "event",
  "required_fields": [
    "event_id_or_url",
    "title",
    "start_at",
    "timezone",
    "venue_or_online",
    "source_url",
    "organizer",
    "city_or_geo"
  ],
  "nice_to_have_fields": [
    "end_at",
    "description",
    "tags",
    "price",
    "registration_url",
    "capacity"
  ],
  "freshness": "daily",
  "history": "upcoming events plus cancellation/update tracking",
  "coverage_target": "high-confidence public events in selected city/topic, not every mention of an event",
  "join_keys": ["source_url", "title", "start_at", "venue_or_online"],
  "privacy_or_risk_fields": ["attendee lists"],
  "exclusions": ["private attendee data", "login-only calendars"],
  "useless_if": ["time zones cannot be normalized", "duplicates dominate", "sources omit source URLs"]
}
```

## Source Strategy

Prefer:

1. official public event APIs or feeds
2. ICS calendars
3. RSS/Atom feeds
4. JSON-LD event markup
5. public search/listing endpoints
6. static HTML

Avoid attendee lists and account-specific calendars.

## Feasibility Scorecard Emphasis

- `coverage`: whether sources represent the event universe or just one platform
- `refreshability`: whether event updates and cancellations can be detected
- `data_quality`: date/time zone completeness
- `legal_tos_risk`: attendee data and private calendar boundaries

## Why This Matters

Events pipelines often fail because the collection path is easy but the normalized calendar is messy. The useful output is a deduped, timezone-safe event table, not raw scraped cards.
