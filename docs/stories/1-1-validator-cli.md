# ST-001 — Validator DoD CLI Enhancements

_Status: ready-for-dev_

## Story Overview
Като разработчик искам `npm run validate` да обединява JSON, telemetry и snapshot DoD проверките чрез ясни CLI флагове, за да изпълня критериите за „чист“ спринт run с една команда.

## Acceptance Criteria
- [ ] Командата приема флагове `--json`, `--log`, `--run-id`, `--snapshot`, `--summary`, и отказва непознати опции с грешка.
- [ ] При успешен run се генерират telemetry + snapshot артефакти в `docs/analysis/reports/`.
- [ ] CLI връща ненулев статус при guardrail нарушения (CAP errors, липсващ snapshot, telemetry write failure).
- [ ] README / validator документацията описва новите флагове и DoD стъпките.
- [ ] Най-малко 3 автоматизирани теста покриват основния run-поток и грешни флагове.

## Tasks / Subtasks
- [ ] Обнови CLI entrypoint-а (JS/TS) с новите флагове и валидация.
- [ ] Добави telemetry + snapshot side-effects (идемпотентни, с път от конфигурация).
- [ ] Напиши интеграционни тестове за `npm run validate` (валидни/невалидни флагове, DoD failure).
- [ ] Обнови документацията (`validator-readme.md`, README) с DoD чеклист и примерни run-ове.

## Dev Notes
- След миграцията към TS задачата трябва да използва споделени типове (виж EP-004) — ако TS още не е приета, планирай лесен port.
- Telemetry фалове трябва да върнат `process.exit(1)`.
- Използвай sample данните в `games/demo/` за smoke run.

## Dev Agent Record
### Implementation Plan
_(pending)_

### Debug Log
_(pending)_

### Completion Notes
_(pending)_

## File List
- _TBD_

## Change Log
- _TBD_

## Status
ready-for-dev
