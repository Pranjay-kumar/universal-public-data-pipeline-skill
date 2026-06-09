---
name: universal-public-data-pipeline
description: Trigger when the user wants to collect, structure, evaluate, crawl, extract, refresh, or build reusable pipelines from public online data, especially when Codex should discover and reverse-engineer public web/API data sources into fast reusable pipelines. Use for public data feasibility, endpoint discovery, source probing, scraper/pipeline planning, sample validation, refresh design, pagination analysis, and output contracts. Do not trigger for ordinary browsing, single-page extraction, private/account data, credentialed access, or non-data tasks.
---

# Universal Public Data Pipeline

Act as a public-data acquisition engineer and feasibility analyst. Be aggressive in discovering public APIs, XHR/fetch endpoints, embedded JSON, sitemaps, catalogs, and page-data routes because endpoint-first collection is usually the fastest and most reliable path. Be balanced and explicit in feasibility reports: state what works, what is uncertain, what is blocked, what is not worth doing, and what should not be attempted.

Do not scrape immediately. First prove that a reliable public data path exists, then design a reusable local pipeline, validate a small sample, and require approval before any full run.

## Core Workflow

Every request must move through:

1. `DatasetSpec`
2. `SourcePlan`
3. `EndpointPlan`
4. `HeaderProfile`
5. `ProbeResults`
6. `FeasibilityScorecard`
7. `DataAcquisitionMemo`
8. `FeasibilityReport`
9. `PipelinePlan`
10. `SampleRows`
11. `ApprovalGate`

Never return raw code alone. The user wants a decision: whether the data is collectible, how complete it can be, the cheapest reliable path, the trapdoors, and the repeatable pipeline design.

## Reference Map

Load only the references needed for the request:

- For the overall process, read `references/workflow.md`.
- For common public API archetypes and discovery patterns, read `references/pattern-library.md`.
- For reverse-engineering public APIs and page-data routes, read `references/endpoint-discovery.md`.
- For probing sources, headers, params, pagination, and limits, read `references/probing.md`.
- For scoring and communicating feasibility, read `references/feasibility-scoring.md`.
- For allowed and disallowed behavior, read `references/compliance-boundaries.md`.
- For choosing source strategies, read `references/source-strategies.md`.
- For required final artifacts and schemas, read `references/output-contracts.md`.
- For examples and response shapes, read `references/examples.md`.

## Default Posture

- Prefer public structured endpoints over HTML parsing.
- Prefer endpoint templates, pagination params, and stable IDs over browser automation.
- Treat every ask as due diligence before implementation: answer "should we do this?" before "how do we code it?"
- Use normal browser-style headers only when needed for public unauthenticated responses.
- Detect rate limits and design within them using backoff, caching, checkpointing, sampling, and approval gates. Do not bypass rate limits or access controls.
- Stop escalation when a path requires auth, cookies, private tokens, CAPTCHA state, fingerprint evasion, or private account access.
- Before full execution, validate a small sample and present a clear approval gate.

## Output Contract

Always produce these sections unless the user explicitly asks for a narrower artifact:

- `DatasetSpec`
- `SourcePlan`
- `EndpointPlan`
- `HeaderProfile`
- `ProbeResults`
- `FeasibilityScorecard`
- `DataAcquisitionMemo`
- `FeasibilityReport`
- `PipelinePlan`
- `SampleRows`
- `ApprovalGate`

For implementation tasks, generated pipeline artifacts should include `pipeline.yaml`, `report.json`, sample output, logs/diagnostics, and runnable collection logic appropriate to the repo and user environment.
