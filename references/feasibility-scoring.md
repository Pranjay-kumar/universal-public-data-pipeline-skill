# Feasibility Scoring

Be balanced in feasibility reports. The skill should be aggressive while discovering sources, then sober when scoring.

## Score Dimensions

Score 0-100 from:

- Availability: Does the data exist publicly?
- Accessibility: Can it be reached without credentials or restricted actions?
- Structure: Is it JSON/API/schema-like, or brittle HTML?
- Coverage: Does the source cover the requested dataset?
- Pagination: Can the accessible pages reach the target scale?
- Freshness: Can it be refreshed reliably?
- Runtime: Is full collection practical?
- Storage: Are output size and schema manageable?
- Stability: Are endpoint templates and params stable?
- Compliance: Are robots, terms, privacy, and access boundaries acceptable?

## Interpretation

- `90-100`: Easy
- `70-89`: Feasible
- `50-69`: Feasible but expensive or partial
- `30-49`: Difficult or high-risk
- `0-29`: Reject or require a different source

## Report Style

Use an explicit posture:

- `Discovery posture`: aggressive, because public endpoint discovery is preferred.
- `Feasibility posture`: balanced, because the user needs the real tradeoffs.
- `Execution posture`: cautious until samples validate and approval is explicit.

## Required FeasibilityReport

```json
{
  "score": 0,
  "interpretation": "",
  "availability": "",
  "accessibility": "",
  "structure": "",
  "coverage": "",
  "pagination": "",
  "runtime": "",
  "storage": "",
  "risk": "",
  "recommended_strategy": "",
  "confidence": 0.0
}
```

## Separate Scores When Needed

When a source is technically reachable but risky or partial, separate scores:

```json
{
  "technical_feasibility": 88,
  "responsible_full_collection": 42,
  "narrow_sample_collection": 75
}
```

Use this for social graphs, user-generated content, personal profiles, rate-limited sources, and any dataset with privacy or terms concerns.

