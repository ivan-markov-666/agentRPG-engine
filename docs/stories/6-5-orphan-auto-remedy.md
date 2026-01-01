# ST-021 — Orphan Auto-remedy (quests/areas)

_Status: done_

## Story Overview
Като GM/Dev искам tooling за auto-remedy на orphan references (missing quest/area файлове, реферирани от runtime state), за да мога бързо да възстановя валидно playable състояние без ръчно търсене и copy/paste.

## Acceptance Criteria
- [x] Има команда (напр. `npm run remedy:orphans -- --path games/<id>`) която:
  - [x] ако `state.active_quests[].quest_id` сочи към липсващ quest файл → scaffold-ва quest markdown template.
  - [x] ако `state.current_area_id` сочи към липсваща area → fallback към `default-area` (ако съществува) или scaffold-ва такава.
- [x] Tooling-ът не променя UI файлове и не трие данни; само създава липсващи файлове/обновява state при нужда.
- [x] Валидаторът остава строг (продължава да репортва `QUEST-ORPHAN`/`AREA-ORPHAN`), но документацията посочва remediation командата.
- [x] Има тест, който симулира orphan state и доказва, че remediation създава нужните файлове.

## Tasks / Subtasks
- [x] Дефинирай remediation скрипт и CLI аргументи.
- [x] Реюзни `quest:scaffold` и `area:add` логика (или извлечи shared helpers), за да се избегне duplication.
- [x] Добави smoke тест.
- [x] Обнови README/validator-readme с remediation стъпки.

## Dev Agent Record / File List / Change Log
- `tools/remedy/orphans.ts` — CLI за auto-remedy + shared scaffold helpers.
- `package.json` — `remedy:orphans` скрипт.
- `README.md`, `docs/analysis/validator-readme.md` — инструкции за remediation.
- `tools/tests/auto-remedy.test.ts` — smoke сценарии (quest scaffold, area fallback, no-op).

## Status
done
