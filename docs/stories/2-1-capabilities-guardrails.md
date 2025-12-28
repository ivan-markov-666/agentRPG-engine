# ST-002 — Capabilities Guardrails Schema

_Status: ready-for-dev_

## Story Overview
Като GM/Dev искам capabilities guardrails да бъдат формализирани в JSON Schema и validator правила, за да получавам грешки при невалидни стойности.

## Acceptance Criteria
- [ ] `tools/validator/schemas/capabilities.schema.json` съдържа min/max диапазони за всички guardrail параметри от Product Brief.
- [ ] `games/demo/config/capabilities.json` валидира успешно срещу новата schema.
- [ ] Validator връща CAP-RUNTIME-RANGE грешки, когато runtime стойности (state file) са извън диапазона.
- [ ] Документацията (Product Brief, capabilities catalog) е синхронизирана със schema дефинициите.

## Tasks / Subtasks
- [ ] Обнови schema файла с числови ограничения и enum стойности където е приложимо.
- [ ] Добави validator стъпка, която сравнява runtime state срещу schema и хвърля грешка при нарушение.
- [ ] Обнови demo config и Product Brief таблицата с актуални диапазони.
- [ ] Напиши unit тестове за schema (валидни/невалидни примери).

## Dev Notes
- Използвай AJV или текущия validator stack — нужни са custom error messages (`CAP-RUNTIME-RANGE`).
- Guardrail таблицата в Product Brief е източник на истина → автоматизирай синхронизация, ако е възможно.

## Dev Agent Record
_(pending)_

## File List
_(pending)_

## Change Log
_(pending)_

## Status
ready-for-dev
