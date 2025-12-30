# ST-016 — Auto-remedy Tooling (init + scaffolds)

_Status: done_

## Story Overview
Като dev искам малки, explicit инструменти за auto-remedy на чести валидаторски проблеми (липсващи placeholder файлове), за да мога бързо да възстановя минимално валиден workspace без ръчно писане.

## Acceptance Criteria
- [x] Има команда, която инициализира `player-data/runtime/exploration-log.json`, ако липсва.
- [x] Има команда, която създава минимален quest markdown scaffold по `quest_id`, без да overwrite-ва съществуващи файлове по подразбиране.
- [x] Има тест, който доказва че инструментите създават очакваните файлове.

## Tasks / Subtasks
- [x] Добави `tools/exploration/init-log.js`.
- [x] Добави `tools/quests/scaffold-quest.js`.
- [x] Добави тест в `tools/tests/auto-remedy.test.js`.

## Dev Agent Record / File List / Change Log
- `tools/exploration/init-log.js`
- `tools/quests/scaffold-quest.js`
- `tools/tests/auto-remedy.test.js`

## Status
done
