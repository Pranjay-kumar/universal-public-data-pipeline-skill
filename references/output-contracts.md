# Output Contracts

Every run should produce structured outputs.

## ModeSelection

```json
{
  "mode": "dataset-design|feasibility|endpoint-discovery|pagination-limits|source-comparison|pipeline-design|sample-validation|compliance-boundary|owned-session|execution",
  "reason": "",
  "will_probe": false,
  "will_collect_beyond_sample": false
}
```

## SourceAccessClass

```json
{
  "class": "public|owned_session|provided_credentials|licensed_api|partner_api|internal_system|restricted_reject",
  "is_publishable_as_public_result": false,
  "authorization_basis": "",
  "secret_handling": "none|user_local_only|environment_variable|secret_manager",
  "allowed_outputs": [],
  "forbidden_outputs": ["cookies", "auth tokens", "captcha tokens", "session dumps", "private keys"],
  "notes": ""
}
```

## DatasetNeed

```json
{
  "decision_or_workflow": "",
  "entity_grain": "",
  "required_fields": [],
  "nice_to_have_fields": [],
  "freshness": "",
  "history": "",
  "coverage_target": "",
  "join_keys": [],
  "privacy_or_risk_fields": [],
  "exclusions": [],
  "useless_if": []
}
```

## DatasetSpec

```json
{
  "entity": "",
  "description": "",
  "fields": [],
  "constraints": {},
  "refresh_frequency": null,
  "target_rows": null,
  "budget": null
}
```

## SourcePlan

```json
[
  {
    "url": "",
    "type": "api|xapi|sitemap|html|rendered|open_dataset|docs",
    "reason": "",
    "confidence": 0.0
  }
]
```

## EndpointPlan

```json
[
  {
    "name": "",
    "method": "GET",
    "template": "",
    "path_params": [],
    "query_params": [],
    "pagination": {},
    "field_coverage": [],
    "fallback": "",
    "confidence": 0.0
  }
]
```

## HeaderProfile

```json
{
  "required": [],
  "optional": [],
  "forbidden": ["captcha tokens", "fingerprint headers", "secrets in logs"],
  "secret_inputs": [],
  "notes": ""
}
```

## ProbeResults

```json
[
  {
    "source": "",
    "status": 200,
    "content_type": "",
    "sample_count": 0,
    "pagination": {},
    "limits": {},
    "errors": [],
    "evidence": ""
  }
]
```

## FeasibilityScorecard

```json
{
  "coverage": 0,
  "stability": 0,
  "pagination_depth": 0,
  "refreshability": 0,
  "data_quality": 0,
  "engineering_cost": "S|M|L|XL",
  "legal_tos_risk": "low|medium|high",
  "recommended_path": "official_api|licensed_api|partner_api|public_xapi|owned_session_browser|embedded_json|sitemap_plus_detail|html|rendered_dom|reject",
  "traffic_light": "Green|Yellow|Red"
}
```

## DataAcquisitionMemo

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

## PipelineQualityPlan

```json
{
  "id_strategy": "",
  "dedupe_strategy": "",
  "incremental_strategy": "",
  "checkpoint_strategy": "",
  "retry_backoff_strategy": "",
  "rate_limit_strategy": "",
  "schema_validation": [],
  "data_quality_tests": [],
  "observability": [],
  "failure_recovery": "",
  "change_detection": "",
  "secret_handling": "",
  "publishability": "public_result|non_public_authorized_result|internal_only"
}
```

## FeasibilityReport

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

## PipelinePlan

```yaml
name:
entity:
sources:
strategy:
endpoint_templates:
headers:
params:
pagination:
schema:
dedupe:
checkpoints:
limits:
outputs:
validation:
approval:
```

## ApprovalGate

Always say what has and has not been approved:

```json
{
  "sample_validated": false,
  "full_run_approved": false,
  "recommended_next_step": ""
}
```
