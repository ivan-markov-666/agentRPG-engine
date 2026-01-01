# ST-023 — Area Authoring Tool (area:add)

_Status: done_

## Story Overview
Като GM/dev искам CLI инструмент за добавяне на нов area, който scaffold-ва минимално валиден area markdown с секции и guardrail-friendly placeholder-и, за да ускоря подготовката на сценарий и да намаля `AREA-*` валидаторски проблеми.

## Acceptance Criteria
- [x] Команда `npm run area:add -- --id <areaId> [--title "..."] [--description "..."] ...` създава `games/<gameId>/scenario/areas/<areaId>.md`.
- [x] Ако `--title` не е подаден, заглавието се генерира от `areaId` (humanized).
- [x] Новият area файл съдържа секции: `Description`, `Points of interest`, `Connections`, `Notes`, `Conditions`, `Threats`.
- [x] При липсващи входни стойности инструментът попълва placeholder-и така, че файлът да покрива минималните guardrails:
  - [x] Description >= 60 символа
  - [x] Points of interest >= 1 bullet
  - [x] Connections >= 1 bullet
  - [x] Notes >= 1 bullet
  - [x] Conditions/Threats съдържат минимум 1 entry, когато са включени като секции
- [x] Инструментът отказва overwrite на съществуващ area файл по подразбиране и връща non-zero exit code.

## Tasks / Subtasks
- [x] Уточни и фиксирай CLI contract-а (README ↔ скрипт): флагове, placeholder rules, exit behavior.
- [x] Добави тест, който проверява scaffold-а и минималните секции/placeholder-и.

## Dev Agent Record / File List / Change Log
- `tools/areas/add-area.ts` — добавени `--path`, humanized title, placeholder bullets за всяка секция, guardrail-friendly defaults.
- `tools/tests/area-add.test.ts` — temp workspace smoke тестове за placeholder-и, custom overrides и отказ при дублиращ файл.
- `package.json` — новият тест е включен към `npm test`.

## Status
done
