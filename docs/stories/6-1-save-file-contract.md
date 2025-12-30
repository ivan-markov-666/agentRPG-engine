# ST-017 — Save File Contract + Minimal Load Support

_Status: ready-for-dev_

## Story Overview
Като engine dev искам save моделът да е формализиран (не само index), така че да можем да съхраняваме и зареждаме snapshot на runtime state по предвидим file-first протокол, без база данни.

## Acceptance Criteria
- [ ] Има JSON schema за save файл (напр. `tools/validator/schemas/saves.save.schema.json`).
- [ ] Валидаторът валидира всеки save файл, рефериран от `player-data/saves/index.json`.
- [ ] Валидаторът валидира, че `file_path` от index сочи към съществуващ файл.
- [ ] Save файлът съдържа минимум: `schema_version`, `save_id`, `created_at`, `scene_id`, `summary`, `cursor`, `state`.
- [ ] `state` в save файла е валидно runtime state (структурно съвместимо със `state.schema.json`).
- [ ] Runtime CLI има минимален режим за load на save (smoke): може да прочете save файл и да отпечата summary + cursor.

## Tasks / Subtasks
- [ ] Дефинирай schema за save файла (`saves.save.schema.json`).
- [ ] Добави validator check: `saves/index.json` → validate file existence и schema за всеки save.
- [ ] Добави runtime loader helper за save load (минимално: parse + print metadata; без full game loop).
- [ ] Обнови `games/demo` и `samples/blank-game` с поне 1 save файл (по избор), така че да минават clean validator run.
- [ ] Добави тест за save index + save file validation.

## Dev Agent Record / File List / Change Log
- (planned) `tools/validator/schemas/saves.save.schema.json`
- (planned) `src/validator/checks/saves.ts` (или разширение на `runtime-contracts.ts`)
- (planned) `src/runtime/loader.ts` (save load helper)
- (planned) `src/cli/runtime.ts` (добавен `--save`/`--save-id` режим)
- (planned) `tools/tests/save-contracts.test.js`

## Status
ready-for-dev
