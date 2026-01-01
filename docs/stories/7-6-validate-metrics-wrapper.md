# ST-027 — Validate + Metrics Wrapper (validate:metrics)

_Status: done_

## Story Overview
Като dev/QA искам една команда, която пуска валидатора, записва telemetry и регенерира metrics summary/insights, за да имам repeatable DoD pipeline без ръчни стъпки.

## Acceptance Criteria
- [x] Команда `npm run validate:metrics -- --path games/<gameId> --run-id <tag> ...`:
  - [x] изпълнява `npm run validate` с подадените параметри
  - [x] изпълнява `npm run metrics:report` върху актуализирания telemetry history
  - [x] връща non-zero exit code ако validator run-ът завърши с errors
- [x] Поддържа `--auto-archive <N>`: ако telemetry history надвиши лимита, архивира преди да продължи (без да губи текущия run).
- [x] Поддържа `--dry-run` за действията по архивиране (ако auto-archive е активиран).
- [x] Добавен е автоматичен тест, който симулира telemetry history near-threshold и проверява, че auto-archive се задейства коректно.

## Tasks / Subtasks
- [x] Уточни/фиксирай CLI contract-а на `tools/scripts/validate-metrics.ts` (flags + exit codes).
- [x] Добави/разшири тестовете за wrapper + auto-archive.
- [x] Документирай usage в README (Sprint Metrics Workflow).

## Dev Agent Record / File List / Change Log
- ✅ `tools/scripts/validate-metrics.ts` — CLI wrapper: forward-ва `--game/--path`, генерира run-id, стартира `validate` + `metrics:report`, пропагира exit codes, поддържа `--auto-archive` + `--dry-run` за archive стъпката.
- ✅ `tools/tests/validate-metrics.test.ts` — покрива success flow (auto-archive задействано + dry-run), failure short-circuit (metrics не се пускат) и `parseArgs` с `--` split.
- ✅ `README.md` — Sprint Metrics Workflow секцията описва `validate:metrics`, telemetry archive политика и auto-archive flow.

## Status
done
