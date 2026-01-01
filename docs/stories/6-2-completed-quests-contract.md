# ST-018 — Completed Quests Contract (schema + validation)

_Status: done_

## Story Overview
Като GM/QA искам `player-data/runtime/completed-quests.json` да има строг договор (schema + проверки), за да можем да измерваме „% sessions с ≥1 completed quest“ и да предотвратим несъответствия между runtime прогрес и scenario каталога.

## Acceptance Criteria
- [x] Има JSON schema за `player-data/runtime/completed-quests.json` (напр. `tools/validator/schemas/completed-quests.schema.json`).
- [x] Валидаторът валидира файла срещу schema с отделен code prefix (напр. `COMPLETED-SCHEMA`).
- [x] Всеки entry изисква минимум: `quest_id`, `title`, `completed_at`.
- [x] `completed_at` е ISO 8601 timestamp.
- [x] Валидаторът проверява, че всеки `quest_id` съществува в `scenario/quests/available.json` (ниво: WARN според избраната policy).
- [x] Има тест, който покрива: missing quest_id/title, invalid timestamp, unknown quest_id.

## Tasks / Subtasks
- [x] Добави schema файл.
- [x] Включи schema в validator pipeline (`checkSchemas`).
- [x] Утвърди policy за severity при `COMPLETED-QUEST-UNKNOWN` (WARN) и синхронизирай кода.
- [x] Добави тестове.

## Dev Agent Record / File List / Change Log
- `tools/validator/schemas/completed-quests.schema.json` — новият контракт за completed quests.
- `src/validator/checks/schema.ts` — добавено `COMPLETED-SCHEMA` валидиране.
- `src/validator/checks/quests.ts` — задължителни `title`/`completed_at`, WARN за неизвестни quest_id.
- `tools/validator/tests/validator.test.ts` — тест матрица за completed quests, covering missing/title/timestamp/unknown cases.

## Status
done
