# ST-004 — Telemetry Retention Automation

_Status: ready-for-dev_

## Story Overview
Като QA искам автоматичен начин да архивирам telemetry history, когато достигне праг или преди release, за да съхраня DoD доказателства без ръчни стъпки.

## Acceptance Criteria
- [ ] Команда `npm run archive:telemetry -- --label <tag>` премества текущия `telemetry-history.json` в `docs/analysis/reports/archive/<timestamp>-<tag>.json`.
- [ ] След архивиране се създава нов празен telemetry history файл с валидна структура.
- [ ] README съдържа стъпки за архивиране и възстановяване.
- [ ] Автоматичен тест покрива сценарий „history >= 50 entries → архив“.
- [ ] CLI връща грешка, ако архив директорията липсва или няма права.

## Tasks / Subtasks
- [ ] Имплементирай Node/TS скрипт за архивиране с аргументи `--label`, `--path` (по избор).
- [ ] Добави safeguard за минимален брой записи преди архивиране (configurable threshold).
- [ ] Обнови telemetry README с примерни run-ове и recovery стъпки.
- [ ] Напиши unit тестове за архив логиката (mock file system).

## Dev Notes
- Използвай същите timestamp формати като `build-focus` (`YYYY-MM-DDTHH-mm-ss`).
- Подготви dry-run флаг за бъдещи automation (може да е TODO коментар).

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
