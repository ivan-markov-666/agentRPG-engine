# ST-023 — Area Authoring Tool (area:add)

_Status: ready-for-dev_

## Story Overview
Като GM/dev искам CLI инструмент за добавяне на нов area, който scaffold-ва минимално валиден area markdown с секции и guardrail-friendly placeholder-и, за да ускоря подготовката на сценарий и да намаля `AREA-*` валидаторски проблеми.

## Acceptance Criteria
- [ ] Команда `npm run area:add -- --id <areaId> [--title "..."] [--description "..."] ...` създава `games/<gameId>/scenario/areas/<areaId>.md`.
- [ ] Ако `--title` не е подаден, заглавието се генерира от `areaId` (humanized).
- [ ] Новият area файл съдържа секции: `Description`, `Points of interest`, `Connections`, `Notes`, `Conditions`, `Threats`.
- [ ] При липсващи входни стойности инструментът попълва placeholder-и така, че файлът да покрива минималните guardrails:
  - [ ] Description >= 60 символа
  - [ ] Points of interest >= 1 bullet
  - [ ] Connections >= 1 bullet
  - [ ] Notes >= 1 bullet
  - [ ] Conditions/Threats съдържат минимум 1 entry, когато са включени като секции
- [ ] Инструментът отказва overwrite на съществуващ area файл по подразбиране и връща non-zero exit code.

## Tasks / Subtasks
- [ ] Уточни и фиксирай CLI contract-а (README ↔ скрипт): флагове, placeholder rules, exit behavior.
- [ ] Добави тест, който проверява scaffold-а и минималните секции/placeholder-и.

## Dev Agent Record / File List / Change Log
- `tools/areas/add-area.js`
- `tools/tests/*.test.js`
- `README.md`

## Status
ready-for-dev
