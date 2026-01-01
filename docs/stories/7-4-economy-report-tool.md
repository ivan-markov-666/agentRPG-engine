# ST-025 — Economy Rewards Report (economy:report)

_Status: done_

## Story Overview
Като GM/dev искам CLI инструмент, който агрегира rewards от quest markdown файлове и генерира кратък отчет (console + optional JSON), за да балансирам икономиката (XP/Gold/Loot/Social) и да откривам несъответствия рано.

## Acceptance Criteria
- [x] Команда `npm run economy:report -- --game <gameId> [--json <out.json>]`:
  - [x] чете всички quest markdown файлове в `games/<gameId>/scenario/quests/`
  - [x] извлича rewards breakdown от секцията `Rewards`
  - [x] принтира summary (totals/averages) за XP/Gold и броячи за Loot/Social
- [x] При `--json` се записва JSON отчет с per-quest данни и warnings за липсващи/непарсваеми rewards.
- [x] Инструментът не crash-ва при единичен повреден quest файл; репортва warning и продължава.
- [x] Добавен е автоматичен тест (temp game), който проверява, че JSON отчетът се генерира и има очакваната структура.

## Tasks / Subtasks
- [x] Уточни parsing rules за rewards lines (XP/Gold/Loot/Social) и edge cases.
- [x] Добави test fixture quests с различни rewards комбинации.

## Dev Agent Record / File List / Change Log
- `tools/economy/report.ts` — добавени `--path`, стабилен rewards parser, totals/issues отчет.
- `tools/tests/economy-report.test.ts` — temp game smoke тест за JSON изход и missing quest issues.
- `package.json` — economy тестът е част от `npm test`.

## Status
done
