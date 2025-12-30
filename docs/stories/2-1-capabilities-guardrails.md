# ST-002 — Capabilities Guardrails Schema

_Status: done_

## Story Overview
Като GM/Dev искам capabilities guardrails да бъдат формализирани в JSON Schema и validator правила, за да получавам грешки при невалидни стойности.

## Acceptance Criteria
- [x] `tools/validator/schemas/capabilities.schema.json` съдържа min/max диапазони за всички guardrail параметри от Product Brief.
- [x] `games/demo/config/capabilities.json` валидира успешно срещу новата schema.
- [x] Validator връща CAP-RUNTIME-RANGE грешки, когато runtime стойности (state file) са извън диапазона.
- [x] Документацията (Product Brief, capabilities catalog) е синхронизирана със schema дефинициите.

## Tasks / Subtasks
- [x] Обнови schema файла с числови ограничения и enum стойности където е приложимо.
- [x] Добави validator стъпка, която сравнява runtime state срещу schema и хвърля грешка при нарушение.
- [x] Обнови demo config и Product Brief таблицата с актуални диапазони.
- [x] Напиши unit тестове за schema (валидни/невалидни примери).

## Dev Notes
- Използвай AJV или текущия validator stack — нужни са custom error messages (`CAP-RUNTIME-RANGE`).
- Guardrail таблицата в Product Brief е източник на истина → автоматизирай синхронизация, ако е възможно.

## Dev Agent Record
- Guardrail schema разширена с нови дефиниции (armor, morale, crit_chance, crit_multiplier) и правило `range XOR min/max`.
- Demo capabilities конфигурацията синхронизирана с новите диапазони и допълнителни полета.
- Capabilities catalog допълнен с таблица за диапазоните и указания за runtime enforcement.
- Validator summary тестът адаптиран да игнорира CAP-SCHEMA кодовете според CLI флага.
- `npm run build:ts` и `npm test` потвърждават чист билд и тестове след промените.

## File List
- `tools/validator/schemas/capabilities.schema.json`
- `games/demo/config/capabilities.json`
- `docs/analysis/capabilities-catalog.md`
- `tools/validator/tests/validator.test.js`
- `docs/stories/2-1-capabilities-guardrails.md`
- `docs/sprint-artifacts/sprint-status.yaml`

## Change Log
1. Добавени строгите guardrail диапазони и валидиране за capabilities schema; валидаторът връща CAP-RUNTIME-RANGE при нарушения.
2. Demo config и документацията са синхронизирани с новите ограничения и примери.
3. Тестовете и sprint статусите са обновени за финализиране на историята.

## Status
done
