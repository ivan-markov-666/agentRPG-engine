# ST-019 — Manifest Entry Contract (schema + engine compatibility)

_Status: ready-for-dev_

## Story Overview
Като engine dev искам `manifest/entry.json` да има строг JSON schema договор, включително `engine_layers` и engine compatibility, за да има предвидима интеграция между валидатор, runtime loader и бъдещи engine слоеве.

## Acceptance Criteria
- [ ] Има JSON schema за `manifest/entry.json` (напр. `tools/validator/schemas/manifest.entry.schema.json`).
- [ ] Валидаторът валидира `manifest/entry.json` срещу schema (напр. `MANIFEST-SCHEMA`).
- [ ] Schema изисква минимум: `id`, `title`, `version`.
- [ ] Schema дефинира pointers: `scenario_index`, `capabilities_file`, `ui_index`, `saves_index`, `full_history_file`.
- [ ] Schema дефинира `engine_layers` като масив от non-empty strings.
- [ ] Добавено е поле за engine compatibility (напр. `engine_compat` или `engine_version_range`) и валидаторът проверява че е non-empty string.
- [ ] Има тест за invalid manifest (missing required fields, invalid pointers type, invalid engine_layers).

## Tasks / Subtasks
- [ ] Дефинирай manifest schema.
- [ ] Включи schema в validator pipeline.
- [ ] Изясни naming за engine compatibility field и го синхронизирай с `src/types/manifest.ts`.
- [ ] Обнови `samples/blank-game` и `games/demo` manifest файловете, ако е нужно.
- [ ] Добави тестове.

## Dev Agent Record / File List / Change Log
- (planned) `tools/validator/schemas/manifest.entry.schema.json`
- (planned) `src/types/manifest.ts`
- (planned) `src/validator/checks/schema.ts`
- (planned) `tools/tests/manifest-schema.test.js`

## Status
ready-for-dev
