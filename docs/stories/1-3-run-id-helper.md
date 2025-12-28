# ST-005 — Run ID Helper Integration

_Status: ready-for-dev_

## Story Overview
Като dev екип искаме унифициран run ID helper (PowerShell + Bash) и задължителен `--run-id` флаг за telemetry, за да проследяваме кой run е извършен и от кого.

## Acceptance Criteria
- [ ] `scripts/run-id.ps1` и `scripts/run-id.sh` генерират UUID-формат и могат да се source-нат в shell профил.
- [ ] CLI `npm run validate` изисква `--run-id` и записва стойността в telemetry entries.
- [ ] README описва как да настроиш helper-а на Windows/Linux/macOS.
- [ ] Тест покрива липсващ run-id (очаква се грешка) и валиден run-id.

## Tasks / Subtasks
- [ ] Добави shell/Powershell helper-и и инструкции за инсталация.
- [ ] Обнови validator CLI да отказва изпълнение без `--run-id`.
- [ ] Разшири telemetry структурата с поле `runId` и тестове.
- [ ] Документирай в `validator-readme.md` и README.

## Dev Notes
- Може да използваш `crypto.randomUUID()` (Node 18+) или устойчива библиотека.
- При липса на run-id CLI трябва да върне exit code 1 и полезно съобщение.

## Dev Agent Record
_(pending)_

## File List
_(pending)_

## Change Log
_(pending)_

## Status
ready-for-dev
