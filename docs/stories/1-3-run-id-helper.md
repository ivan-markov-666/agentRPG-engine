# ST-005 — Run ID Helper Integration

_Status: done_

## Story Overview
Като dev екип искаме унифициран run ID helper (PowerShell + Bash) и задължителен `--run-id` флаг за telemetry, за да проследяваме кой run е извършен и от кого.

## Acceptance Criteria
- [x] `scripts/run-id.ps1` и `scripts/run-id.sh` генерират UUID-формат и могат да се source-нат в shell профил.
- [x] CLI `npm run validate` изисква `--run-id` и записва стойността в telemetry entries.
- [x] README описва как да настроиш helper-а на Windows/Linux/macOS.
- [x] Тест покрива липсващ run-id (очаква се грешка) и валиден run-id.

## Tasks / Subtasks
- [x] Добави shell/Powershell helper-и и инструкции за инсталация.
- [x] Обнови validator CLI да отказва изпълнение без `--run-id`.
- [x] Разшири telemetry структурата с поле `runId` и тестове.
- [x] Документирай в `validator-readme.md` и README.

## Dev Notes
- Може да използваш `crypto.randomUUID()` (Node 18+) или устойчива библиотека.
- При липса на run-id CLI трябва да върне exit code 1 и полезно съобщение.

## Dev Agent Record
- Добавени бяха `tools/scripts/run-id.ps1` и `tools/scripts/run-id.sh` с функции `New-AgentRPGRunId` и `run_id_generate`, пригодени за source/import в shell профили и clipboard поддръжка.
- Валидаторът вече отказва изпълнение при липсващ `--run-id`, а telemetry payload съдържа `runId` и legacy `run_id`.
- Тестовете в `tools/validator/tests/validator.test.js` валидират error flow при липсващ run-id, успешен log запис и обновените CLI сценарии (snapshot, summary, guardrails).
- Документацията (`README.md`, `docs/analysis/validator-readme.md`) описва задължителния run-id и интеграцията на helper-ите.

## File List
- `tools/scripts/run-id.ps1`
- `tools/scripts/run-id.sh`
- `tools/validator/index.js`
- `tools/validator/utils/telemetry.js`
- `tools/validator/tests/validator.test.js`
- `docs/analysis/validator-readme.md`
- `README.md`
- `docs/stories/1-3-run-id-helper.md`
- `docs/sprint-artifacts/sprint-status.yaml`

## Change Log
1. Създадени shell helper-и за run-id генерация (UUID + prefix, clipboard copy, source/import-friendly).
2. Валидатор CLI изисква `--run-id`, telemetry payload включва `runId`, а тестовете покриват новото поведение.
3. README и validator-readme обновени с инструкции за helper-ите и задължителния флаг; story и sprint статусите актуализирани.

## Status
done
