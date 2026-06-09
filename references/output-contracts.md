# Output Contracts

Every run should produce structured outputs.

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
  "forbidden": ["cookies", "auth tokens", "captcha tokens", "fingerprint headers"],
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

