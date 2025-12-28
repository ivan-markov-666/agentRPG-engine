# ST-006 — Runtime State Schema Alignment

_Status: ready-for-dev_

## Story Overview
Като dev искам `state.schema.json` и runtime валидаторът да гарантират, че всички статистики, nested maps и inventories в демо играта спазват guardrails, за да предотвратя невалидни session snapshots.

## Acceptance Criteria
- [ ] `tools/validator/schemas/state.schema.json` описва структурата на `games/demo/player-data/runtime/state.json`, включително неотрицателни стойности и типове.
- [ ] Validator проверява state файла срещу schema и хвърля грешка при несъответствия.
- [ ] Документация (Product Brief / capabilities catalog) съдържа препратка към state schema правилата.
- [ ] Тестов комплект покрива валидни и невалидни state примери.

## Tasks / Subtasks
- [ ] Дефинирай JSON schema с типове за `stats`, `flags`, `inventories`, nested structures.
- [ ] Обнови validator да зарежда schema и да логва смислени грешки (`STATE-SCHEMA-FAIL`).
- [ ] Добави примерни state файлове за тестове и документация.
- [ ] Напиши unit/integration тестове.

## Dev Notes
- Пази backward compatibility, но позволи optional полета чрез `additionalProperties: false` където е възможно.

## Dev Agent Record / File List / Change Log
_(pending)_

## Status
ready-for-dev
