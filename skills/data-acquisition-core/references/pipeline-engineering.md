# Pipeline Engineering

Design scraping and acquisition pipelines like production data systems, not one-off scripts.

## Architecture Checklist

- Source classification and authorization basis
- Dataset grain and schema
- Stable entity IDs
- Dedupe keys
- Pagination and partitioning
- Incremental refresh strategy
- Checkpoints and resumability
- Retry and backoff
- Rate-limit compliance
- Raw capture and normalized outputs
- Schema validation
- Data quality tests
- Change detection for selectors/endpoints
- Observability and run reports
- Secret handling
- Approval gates

## Storage Pattern

Use three layers when the dataset is non-trivial:

1. `raw`: original response/page artifact with timestamp and source metadata
2. `staged`: parsed records with source-specific fields
3. `normalized`: stable schema, dedupe keys, and validation status

## Quality Gates

At minimum, validate:

- required fields are present
- primary keys are non-null and unique
- row counts are within expected bounds
- timestamps parse
- currency/number/date fields normalize
- duplicates are explainable
- missing-field rates are tracked
- source errors are logged separately from empty results

## Run Report

Every run should produce:

```json
{
  "started_at": "",
  "finished_at": "",
  "source_access_class": "",
  "inputs": {},
  "pages_or_requests": 0,
  "raw_records": 0,
  "normalized_records": 0,
  "deduped_records": 0,
  "errors": [],
  "warnings": [],
  "rate_limit_events": [],
  "schema_validation": {},
  "output_files": []
}
```

## Implementation Preference

- Use APIs/structured routes when available and allowed.
- Use Playwright for rendered pages, authenticated owned sessions, or network discovery when needed.
- Keep browser automation bounded and observable.
- Persist checkpoints frequently enough that interruption does not lose progress.
- Make full runs restartable and idempotent.
