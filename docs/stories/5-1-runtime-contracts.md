# ST-013 — Runtime UI + Saves/History Contracts

_Status: done_

## Story Overview
Като engine dev искам да имаме формализирани runtime contracts за UI и player-data (saves/history), които са откриваеми чрез `manifest/entry.json`, за да може engine runtime и валидаторът да работят по един и същи „file-first“ протокол.

## Acceptance Criteria
- [x] `manifest/entry.json` поддържа runtime pointers: `ui_index`, `saves_index`, `full_history_file`.
- [x] Валидаторът валидира, че pointer-ите сочат към съществуващи файлове.
- [x] `ui/index.json` е валидиран по schema и валидаторът валидира указанията UI файлове (`scene/actions/hud/history`).
- [x] `player-data/saves/index.json` е валидиран по schema, ако е посочен.
- [x] `player-data/runtime/history.full.jsonl` е четим, ако е посочен.
- [x] `games/demo` и `samples/blank-game` съдържат минимални файлове, които минават clean validator run.

## Tasks / Subtasks
- [x] Добави schemas за UI и saves индекс.
- [x] Добави типове за UI, saves и manifest pointers.
- [x] Добави validator check за runtime contracts.
- [x] Обнови sample игрите с минимални runtime файлове.

## Dev Agent Record / File List / Change Log
- `tools/validator/schemas/ui.*.schema.json`, `tools/validator/schemas/saves.index.schema.json`
- `src/types/ui.ts`, `src/types/saves.ts`, `src/types/manifest.ts`
- `src/validator/checks/runtime-contracts.ts`
- `games/demo/ui/*`, `games/demo/player-data/saves/index.json`, `games/demo/player-data/runtime/history.full.jsonl`
- `samples/blank-game/ui/*`, `samples/blank-game/player-data/saves/index.json`, `samples/blank-game/player-data/runtime/history.full.jsonl`

## Status
done
