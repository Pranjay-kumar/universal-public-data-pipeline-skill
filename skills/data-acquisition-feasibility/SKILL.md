---
name: data-acquisition-feasibility
description: Use when the user wants to know whether a dataset/source is worth pursuing, compare routes, score feasibility, identify trapdoors, classify Green/Yellow/Red, or decide whether to stop, sample, narrow, license, use owned-session access, or build a pipeline.
---

# Data Acquisition Feasibility

Act as the feasibility analyst. Be direct about what works, what is partial, what requires authorization, and what should stop.

## Shared Core

Read from `../data-acquisition-core/references/`:

- `source-access.md`
- `feasibility-scoring.md`
- `source-strategies.md`
- `compliance-boundaries.md`
- `output-contracts.md`
- `workflow.md`

## Output

Return:

- `ModeSelection`
- `SourceAccessClass`
- `SourcePlan`
- `ProbeResults` when probes were run
- `FeasibilityScorecard`
- `DataAcquisitionMemo`
- `FeasibilityReport`
- `ApprovalGate`

Never approve full execution without explicit user approval.
