# ST-019 — Manifest Entry Contract (schema + engine compatibility)

_Status: done_

## Story Overview
Като engine dev искам `manifest/entry.json` да има строг JSON schema договор, включително `engine_layers` и engine compatibility, за да има предвидима интеграция между валидатор, runtime loader и бъдещи engine слоеве.

## Acceptance Criteria
- [x] Има JSON schema за `manifest/entry.json` (напр. `tools/validator/schemas/manifest.entry.schema.json`).
- [x] Валидаторът валидира `manifest/entry.json` срещу schema (напр. `MANIFEST-SCHEMA`).
- [x] Schema изисква минимум: `id`, `title`, `version`.
- [x] Schema дефинира pointers: `scenario_index`, `capabilities_file`, `ui_index`, `saves_index`, `full_history_file`.
- [x] Schema дефинира `engine_layers` като масив от non-empty strings.
- [x] Добавено е поле за engine compatibility (напр. `engine_compat` или `engine_version_range`) и валидаторът проверява че е non-empty string.
- [x] Има тест за invalid manifest (missing required fields, invalid pointers type, invalid engine_layers).

## Tasks / Subtasks
- [x] Дефинирай manifest schema.
- [x] Включи schema в validator pipeline.
- [x] Изясни naming за engine compatibility field и го синхронизирай с `src/types/manifest.ts`.
- [x] Обнови `samples/blank-game` и `games/demo` manifest файловете, ако е нужно.
- [x] Добави тестове.

## Dev Agent Record / File List / Change Log
- (planned) `tools/validator/schemas/manifest.entry.schema.json`
- (planned) `src/types/manifest.ts`
- (planned) `src/validator/checks/schema.ts`
- (planned) `tools/tests/manifest-schema.test.js`

## Status
done
