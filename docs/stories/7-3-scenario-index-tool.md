# ST-024 — Scenario Index Generator (scenario:index)

_Status: done_

## Story Overview
Като GM/dev искам CLI инструмент да регенерира `scenario/index.md` от наличните quests/areas, така че сценарният overview да е винаги актуален, да не пада под минималните guardrails и да служи като roadmap за сесията.

## Acceptance Criteria
- [x] Команда `npm run scenario:index -- --game <gameId>` регенерира `games/<gameId>/scenario/index.md`.
- [x] Индексът съдържа секции/таблици за:
  - [x] Quests (линк, unlock условия, кратък summary)
  - [x] Areas (линк, кратко описание)
- [x] Генерацията е детерминистична (стабилен ред/формат при еднакъв вход).
- [x] Инструментът валидира, че всички реферирани quests/areas файлове съществуват; при липси репортва ясни грешки.
- [x] Добавен е автоматичен тест (temp game), който проверява че индексът се генерира и съдържа очакваните секции/редове.

## Tasks / Subtasks
- [x] Уточни/фиксирай parsing rules за извличане на title/summary от markdown.
- [x] Добави test fixture с 1 area + 1 quest и assert за генериран markdown.

## Dev Agent Record / File List / Change Log
- `tools/scenario/update-index.ts` — добавени `--path`, детерминистичен sort, задължителни quest файлове, стабилен markdown scaffold.
- `tools/tests/scenario-index.test.ts` — temp game smoke тест за успешна генерация и failure при липсващ quest.
- `package.json` — сценарийният тест е включен в `npm test`.

## Status
done
