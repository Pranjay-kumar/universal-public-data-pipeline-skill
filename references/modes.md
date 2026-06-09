# Modes

Use modes to prevent overbuilding. A mode narrows the answer shape and defines whether probes or collection are appropriate.

## Mode Ladder

1. `dataset-design`: decide what data is actually needed.
2. `feasibility`: decide whether that dataset is publicly collectible.
3. `endpoint-discovery`: find public structured routes.
4. `pagination-limits`: prove scale, caps, and completeness ceiling.
5. `source-comparison`: compare route tradeoffs.
6. `pipeline-design`: design a refreshable pipeline from known routes.
7. `sample-validation`: validate tiny sample rows and diagnostics.
8. `compliance-boundary`: define Green/Yellow/Red boundaries and stop conditions.
9. `execution`: collect only after explicit approval.

## Dataset Design Mode

Use when the user says "what data do I need," asks for "all data," describes a business goal instead of a dataset, or seems likely to overcollect.

Return:

- `ModeSelection`
- `DatasetNeed`
- `DatasetSpec`
- `DataAcquisitionMemo`
- `ApprovalGate`

Do not hunt endpoints unless the user asks to continue.

## Feasibility Mode

Use when the user has named a dataset or source and wants to know whether collection is worth doing.

Return all core outputs. Tiny probes are allowed when needed.

## Endpoint Discovery Mode

Use when the user asks to reverse-engineer public web/API sources.

Emphasize:

- public route candidates
- endpoint templates
- headers and params
- framework fingerprints
- next probes

Do not run broad collection.

## Pagination/Limits Mode

Use when the question is "how many rows can we get?"

Emphasize:

- max effective page size
- cursor or offset behavior
- deep offset/cursor failure mode
- sorting stability
- dedupe risk
- estimated retrievable ceiling

Use sparse tiny probes instead of harvesting lists.

## Source Comparison Mode

Use when multiple routes could work.

Return:

- fastest viable route
- cheapest robust route
- highest-coverage route
- recommended route
- rejected routes and why

## Pipeline Design Mode

Use when source routes are already known.

Return a runnable design, not a full implementation unless asked:

- endpoint templates
- schema
- dedupe keys
- checkpointing
- backoff and retry
- storage targets
- validation
- runbook

## Sample Validation Mode

Use when the user wants a small check.

Default bounds:

- 20 rows
- 2 pages/categories
- 2 minutes

## Compliance Boundary Mode

Use when the user asks what is allowed, risky, or forbidden.

Return Green/Yellow/Red, stop conditions, and safer alternatives. Do not provide instructions for bypassing access controls or rate limits.

## Execution Mode

Use only after explicit approval. Keep collection incremental, checkpointed, bounded, and logged.
