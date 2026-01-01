# ST-017 — Save File Contract + Minimal Load Support

_Status: done_

## Story Overview
Като engine dev искам save моделът да е формализиран (не само index), така че да можем да съхраняваме и зареждаме snapshot на runtime state по предвидим file-first протокол, без база данни.

## Acceptance Criteria
- [x] Има JSON schema за save файл (напр. `tools/validator/schemas/saves.save.schema.json`).
- [x] Валидаторът валидира всеки save файл, рефериран от `player-data/saves/index.json`.
- [x] Валидаторът валидира, че `file_path` от index сочи към съществуващ файл.
- [x] Save файлът съдържа минимум: `schema_version`, `save_id`, `created_at`, `scene_id`, `summary`, `cursor`, `state`.
- [x] `state` в save файла е валидно runtime state (структурно съвместимо със `state.schema.json`).
- [x] Runtime CLI има минимален режим за load на save (smoke): може да прочете save файл и да отпечата summary + cursor.

## Tasks / Subtasks
- [x] Дефинирай schema за save файла (`saves.save.schema.json`).
- [x] Добави validator check: `saves/index.json` → validate file existence и schema за всеки save.
- [x] Добави runtime loader helper за save load (минимално: parse + print metadata; без full game loop).
- [x] Обнови `games/demo` и `samples/blank-game` с поне 1 save файл (по избор), така че да минават clean validator run.
- [x] Добави тест за save index + save file validation.

## Dev Agent Record / File List / Change Log
- `tools/validator/schemas/saves.save.schema.json` — save schema + state reference.
- `src/validator/checks/schema.ts` — per-save validation + file existence guardrail.
- `src/runtime/loader.ts` — `loadSaveIndex`, safety updates.
- `src/cli/runtime.ts` — `--save` / `--save-id` режим, summary/cursor output.
- `tools/tests/runtime-loader.test.ts` — save index + save file smoke.
- `games/demo`, `samples/blank-game` — sample save файлове.

## Status
done
