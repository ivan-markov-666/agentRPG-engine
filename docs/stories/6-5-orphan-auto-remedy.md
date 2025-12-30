# ST-021 — Orphan Auto-remedy (quests/areas)

_Status: ready-for-dev_

## Story Overview
Като GM/Dev искам tooling за auto-remedy на orphan references (missing quest/area файлове, реферирани от runtime state), за да мога бързо да възстановя валидно playable състояние без ръчно търсене и copy/paste.

## Acceptance Criteria
- [ ] Има команда (напр. `npm run remedy:orphans -- --path games/<id>`) която:
  - [ ] ако `state.active_quests[].quest_id` сочи към липсващ quest файл → scaffold-ва quest markdown template.
  - [ ] ако `state.current_area_id` сочи към липсваща area → fallback към `default-area` (ако съществува) или scaffold-ва такава.
- [ ] Tooling-ът не променя UI файлове и не трие данни; само създава липсващи файлове/обновява state при нужда.
- [ ] Валидаторът остава строг (продължава да репортва `QUEST-ORPHAN`/`AREA-ORPHAN`), но документацията посочва remediation командата.
- [ ] Има тест, който симулира orphan state и доказва, че remediation създава нужните файлове.

## Tasks / Subtasks
- [ ] Дефинирай remediation скрипт и CLI аргументи.
- [ ] Реюзни `quest:scaffold` и `area:add` логика (или извлечи shared helpers), за да се избегне duplication.
- [ ] Добави smoke тест.
- [ ] Обнови README/validator-readme с remediation стъпки.

## Dev Agent Record / File List / Change Log
- (planned) `tools/remedy/orphans.js`
- (planned) `tools/tests/orphan-remedy.test.js`
- (planned) `package.json` (script alias)
- (planned) docs updates (README/validator-readme)

## Status
ready-for-dev
