# ST-006 — Runtime State Schema Alignment

_Status: done_

## Story Overview
Като dev искам `state.schema.json` и runtime валидаторът да гарантират, че всички статистики, nested maps и inventories в демо играта спазват guardrails, за да предотвратя невалидни session snapshots.

## Acceptance Criteria
- [x] `tools/validator/schemas/state.schema.json` описва структурата на `games/demo/player-data/runtime/state.json`, включително неотрицателни стойности и типове.
- [x] Validator проверява state файла срещу schema и хвърля грешка при несъответствия.
- [x] Документация (Product Brief / capabilities catalog) съдържа препратка към state schema правилата.
- [x] Тестов комплект покрива валидни и невалидни state примери.

## Tasks / Subtasks
- [x] Дефинирай JSON schema с типове за `stats`, `flags`, `inventories`, nested structures.
- [x] Обнови validator да зарежда schema и да логва смислени грешки (`STATE-SCHEMA`).
- [x] Добави примерни state файлове за тестове и документация.
- [x] Напиши unit/integration тестове.

## Dev Notes
- Пази backward compatibility, но позволи optional полета чрез `additionalProperties: false` където е възможно.

## Dev Agent Record
- Разширена е `tools/validator/schemas/state.schema.json` с пълно описание на runtime полетата (current_day/hour, flags, inventories, exploration preview, nested stats).
- Към `tools/validator/tests/validator.test.js` са добавени integration тестове за валиден и невалиден state, за да се гарантира `STATE-SCHEMA` покритие.
- Документацията (`docs/analysis/capabilities-catalog.md`, `docs/analysis/validator-readme.md`) е обновена с state schema указания и примерни структури.
- `npm test` (validator + telemetry tests) преминава успешно, доказвайки приложимостта на schema-та.

## File List
- `tools/validator/schemas/state.schema.json`
- `tools/validator/tests/validator.test.js`
- `docs/analysis/capabilities-catalog.md`
- `docs/analysis/validator-readme.md`

## Change Log
1. State schema разшірение: добавени inventories/flags/exploration дефиниции и по-строги типове.
2. Validator тестове: добавени валиден/невалиден runtime state сценарий.
3. Документация: capabilities catalog + validator README описват state schema контрол и примерни грешки.

## Status
done
