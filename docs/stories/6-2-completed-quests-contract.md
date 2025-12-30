# ST-018 — Completed Quests Contract (schema + validation)

_Status: ready-for-dev_

## Story Overview
Като GM/QA искам `player-data/runtime/completed-quests.json` да има строг договор (schema + проверки), за да можем да измерваме „% sessions с ≥1 completed quest“ и да предотвратим несъответствия между runtime прогрес и scenario каталога.

## Acceptance Criteria
- [ ] Има JSON schema за `player-data/runtime/completed-quests.json` (напр. `tools/validator/schemas/completed-quests.schema.json`).
- [ ] Валидаторът валидира файла срещу schema с отделен code prefix (напр. `COMPLETED-SCHEMA`).
- [ ] Всеки entry изисква минимум: `quest_id`, `title`, `completed_at`.
- [ ] `completed_at` е ISO 8601 timestamp.
- [ ] Валидаторът проверява, че всеки `quest_id` съществува в `scenario/quests/available.json` (ниво: WARN или ERROR според policy).
- [ ] Има тест, който покрива: missing quest_id/title, invalid timestamp, unknown quest_id.

## Tasks / Subtasks
- [ ] Добави schema файл.
- [ ] Включи schema в validator pipeline (`checkSchemas`).
- [ ] Утвърди policy за severity при `COMPLETED-QUEST-UNKNOWN` (WARN vs ERROR) и синхронизирай кода.
- [ ] Добави тестове.

## Dev Agent Record / File List / Change Log
- (planned) `tools/validator/schemas/completed-quests.schema.json`
- (planned) `src/validator/checks/schema.ts` (добавен schema validate)
- (planned) `src/validator/checks/quests.ts` (severity/policy уточнение)
- (planned) `tools/tests/completed-quests.test.js`

## Status
ready-for-dev
