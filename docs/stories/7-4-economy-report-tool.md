# ST-025 — Economy Rewards Report (economy:report)

_Status: ready-for-dev_

## Story Overview
Като GM/dev искам CLI инструмент, който агрегира rewards от quest markdown файлове и генерира кратък отчет (console + optional JSON), за да балансирам икономиката (XP/Gold/Loot/Social) и да откривам несъответствия рано.

## Acceptance Criteria
- [ ] Команда `npm run economy:report -- --game <gameId> [--json <out.json>]`:
  - [ ] чете всички quest markdown файлове в `games/<gameId>/scenario/quests/`
  - [ ] извлича rewards breakdown от секцията `Rewards`
  - [ ] принтира summary (totals/averages) за XP/Gold и броячи за Loot/Social
- [ ] При `--json` се записва JSON отчет с per-quest данни и warnings за липсващи/непарсваеми rewards.
- [ ] Инструментът не crash-ва при единичен повреден quest файл; репортва warning и продължава.
- [ ] Добавен е автоматичен тест (temp game), който проверява, че JSON отчетът се генерира и има очакваната структура.

## Tasks / Subtasks
- [ ] Уточни parsing rules за rewards lines (XP/Gold/Loot/Social) и edge cases.
- [ ] Добави test fixture quests с различни rewards комбинации.

## Dev Agent Record / File List / Change Log
- `tools/economy/report.js`
- `tools/tests/*.test.js`
- `README.md`

## Status
ready-for-dev
