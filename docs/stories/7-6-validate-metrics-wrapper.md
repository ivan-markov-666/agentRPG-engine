# ST-027 — Validate + Metrics Wrapper (validate:metrics)

_Status: ready-for-dev_

## Story Overview
Като dev/QA искам една команда, която пуска валидатора, записва telemetry и регенерира metrics summary/insights, за да имам repeatable DoD pipeline без ръчни стъпки.

## Acceptance Criteria
- [ ] Команда `npm run validate:metrics -- --path games/<gameId> --run-id <tag> ...`:
  - [ ] изпълнява `npm run validate` с подадените параметри
  - [ ] изпълнява `npm run metrics:report` върху актуализирания telemetry history
  - [ ] връща non-zero exit code ако validator run-ът завърши с errors
- [ ] Поддържа `--auto-archive <N>`: ако telemetry history надвиши лимита, архивира преди да продължи (без да губи текущия run).
- [ ] Поддържа `--dry-run` за действията по архивиране (ако auto-archive е активиран).
- [ ] Добавен е автоматичен тест, който симулира telemetry history near-threshold и проверява, че auto-archive се задейства коректно.

## Tasks / Subtasks
- [ ] Уточни/фиксирай CLI contract-а на `tools/scripts/validate-metrics.js` (flags + exit codes).
- [ ] Добави/разшири тестовете за wrapper + auto-archive.
- [ ] Документирай usage в README (Sprint Metrics Workflow).

## Dev Agent Record / File List / Change Log
- `tools/scripts/validate-metrics.js`
- `tools/tests/*.test.js`
- `README.md`

## Status
ready-for-dev
