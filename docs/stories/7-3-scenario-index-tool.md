# ST-024 — Scenario Index Generator (scenario:index)

_Status: ready-for-dev_

## Story Overview
Като GM/dev искам CLI инструмент да регенерира `scenario/index.md` от наличните quests/areas, така че сценарният overview да е винаги актуален, да не пада под минималните guardrails и да служи като roadmap за сесията.

## Acceptance Criteria
- [ ] Команда `npm run scenario:index -- --game <gameId>` регенерира `games/<gameId>/scenario/index.md`.
- [ ] Индексът съдържа секции/таблици за:
  - [ ] Quests (линк, unlock условия, кратък summary)
  - [ ] Areas (линк, кратко описание)
- [ ] Генерацията е детерминистична (стабилен ред/формат при еднакъв вход).
- [ ] Инструментът валидира, че всички реферирани quests/areas файлове съществуват; при липси репортва ясни грешки.
- [ ] Добавен е автоматичен тест (temp game), който проверява че индексът се генерира и съдържа очакваните секции/редове.

## Tasks / Subtasks
- [ ] Уточни/фиксирай parsing rules за извличане на title/summary от markdown.
- [ ] Добави test fixture с 1 area + 1 quest и assert за генериран markdown.

## Dev Agent Record / File List / Change Log
- `tools/scenario/update-index.js`
- `tools/tests/*.test.js`
- `README.md`

## Status
ready-for-dev
