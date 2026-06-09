# Feasibility Scoring

Be balanced in feasibility reports. The skill should be aggressive while discovering sources, then sober when scoring.

## Score Dimensions

Score 0-100 overall and 0-10 for the scorecard dimensions:

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

## Traffic Light

- `Green`: public, stable, unauthenticated, structured, refreshable, and likely complete enough.
- `Yellow`: public but partial, capped, rate-limited, brittle, expensive, or unclear.
- `Red`: requires auth bypass, private cookies/tokens, CAPTCHA solving, fingerprint evasion, private account access, exploit behavior, or rate-limit bypass.

Reject Red paths. For Yellow paths, recommend a smaller sample, alternate source, or narrower dataset before any full run.

## Overall Interpretation

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
  "traffic_light": "Green|Yellow|Red",
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

## Required FeasibilityScorecard

```json
{
  "coverage": 0,
  "stability": 0,
  "pagination_depth": 0,
  "refreshability": 0,
  "data_quality": 0,
  "engineering_cost": "S|M|L|XL",
  "legal_tos_risk": "low|medium|high",
  "recommended_path": "official_api|public_xapi|embedded_json|sitemap_plus_detail|html|rendered_dom|reject",
  "traffic_light": "Green|Yellow|Red"
}
```

## Required DataAcquisitionMemo

```json
{
  "fastest_viable_route": "",
  "cheapest_robust_route": "",
  "highest_coverage_route": "",
  "coverage_ceiling": "",
  "main_trapdoors": [],
  "sample_before_full_run": [],
  "stop_conditions": [],
  "recommendation": ""
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
