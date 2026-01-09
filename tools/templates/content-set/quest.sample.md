# Quest Title Template

> Кратко резюме на куеста и основния конфликт.

## Сцена A — Setup
- Опиши началната ситуация, NPC-тата и какво се очаква от героите.
- State hook пример: `content_sets.<id>.state.convoy_morale -5`.

## Сцена B — Escalation
- Разклонения / избори / skill checks.
- Запиши потенциални награди или наказания.

## Сцена C — Resolution
- Финални проверки, последици, нови hooks.
- Опиши какво се unlock-ва в следващия куест или DLC.

## State Hooks
```json
{
  "content_sets.<id>.state": {
    "example_flag": true,
    "artifact_clues": ["hook_example"]
  }
}
```
