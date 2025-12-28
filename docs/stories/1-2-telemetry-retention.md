# ST-004 — Telemetry Retention Automation

_Status: done_

## Story Overview
Като QA искам автоматичен начин да архивирам telemetry history, когато достигне праг или преди release, за да съхраня DoD доказателства без ръчни стъпки.

## Acceptance Criteria
- [x] Команда `npm run archive:telemetry -- --label <tag>` премества текущия `telemetry-history.json` в `docs/analysis/reports/archive/<timestamp>-<tag>.json`.
- [x] След архивиране се създава нов празен telemetry history файл с валидна структура.
- [x] README съдържа стъпки за архивиране и възстановяване.
- [x] Автоматичен тест покрива сценарий „history >= 50 entries → архив“.
- [x] CLI връща грешка, ако архив директорията липсва или няма права.

## Tasks / Subtasks
- [x] Имплементирай Node/TS скрипт за архивиране с аргументи `--label`, `--path` (по избор).
- [x] Добави safeguard за минимален брой записи преди архивиране (configurable threshold).
- [x] Обнови telemetry README с примерни run-ове и recovery стъпки.
- [x] Напиши unit тестове за архив логиката (mock file system).

## Dev Notes
- Използвай същите timestamp формати като `build-focus` (`YYYY-MM-DDTHH-mm-ss`).
- Подготви dry-run флаг за бъдещи automation (може да е TODO коментар).

## Dev Agent Record
### Implementation Plan
- Разширяване на `tools/archive-telemetry.js` с threshold (default 50), dry-run и конфигурируеми пътища, плюс по-строги грешки.
- Изграждане на unit тестове (temp dir) за сценарии: under threshold skip, архивиране ≥ threshold, липсващ history.
- Обновяване на README/validator docs с инструкции за threshold, dry-run, recovery + story logs.

### Debug Log
- `archive-telemetry.js` обновен с `--min`, `--dry-run`, нов API + експорти.
- Добавен тест `tools/tests/archive-telemetry.test.js`, включен в `npm test`.

### Completion Notes
- Архивиращият CLI вече поддържа `--min`, `--dry-run`, конфигурируеми пътища и коректно нулира history след успешен архив.
- README съдържа инструкции за threshold/dry-run, recovery стъпки и примерни команди/automation.
- Unit тестовете покриват сценарии за threshold skip, успешен архив, липсващ history и недостъпна archive директория.

## File List
- `tools/archive-telemetry.js`
- `tools/tests/archive-telemetry.test.js`
- `docs/analysis/validator-readme.md`
- `tools/scripts/archive-telemetry.ps1`
- `tools/scripts/archive-telemetry.sh`

## Change Log
- Added threshold-aware archiver with tests, docs, and automation wrappers.

## Status
done
