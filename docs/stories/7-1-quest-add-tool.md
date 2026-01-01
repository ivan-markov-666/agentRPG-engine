# ST-022 — Quest Authoring Tool (quest:add)

_Status: done_

## Story Overview
Като GM/dev искам CLI инструмент за добавяне на нов quest, който автоматично генерира минимално валиден quest markdown и синхронизира `available.json` / `unlock-triggers.json`, за да ускоря content authoring и да намаля риска от validator regressions.

## Acceptance Criteria
- [x] Команда `npm run quest:add -- ...` създава нов файл `games/<gameId>/scenario/quests/<questId>.md`.
- [x] Ако `--id` не е подаден, `questId` се генерира детерминистично (slug) от `--title`.
- [x] Инструментът обновява `games/<gameId>/scenario/quests/available.json`, като поддържа двата формата:
  - [x] array от `{ id, title }`
  - [x] map `{ [id]: title }`
- [x] Новият quest markdown съдържа секции: `Summary`, `Story`, `Hooks`, `Encounters`, `Steps`, `Rewards`, `Notes`, `Outcome`, `Aftermath`, `Outcome Hooks`, `Conditions`, `Fail State`.
- [x] При липсващи входни стойности инструментът попълва placeholder-и, така че новият quest да покрива минималните guardrails (Steps >= 2; Rewards/Hooks/Encounters/Notes >= 1).
- [x] Ако е подаден `--areas`, инструментът:
  - [x] валидира, че `games/<gameId>/scenario/areas/<areaId>.md` съществува за всяка area
  - [x] добавя секция `Linked Areas` в quest файла
- [x] Ако са подадени `--unlock` и/или `--unlock-requires`, инструментът обновява `games/<gameId>/scenario/quests/unlock-triggers.json` с нов trigger за `questId`.
- [x] Ако е подаден `--exploration-hook`, инструментът гарантира, че `player-data/runtime/exploration-log.json` съдържа entry за всяка линкната area и добавя таг `quest:<questId>` (create-or-update).
- [x] Инструментът връща non-zero exit code при дублиран quest id/заглавие или при опит за overwrite на съществуващ quest файл.

## Tasks / Subtasks
- [x] Уточни и фиксирай CLI contract-а (README ↔ скрипт): флагове, error codes, exit behavior.
- [x] Добави/разшири тестове за `quest:add` върху temp game workspace (create quest + available.json update + unlock trigger update).
- [x] Документирай edge cases: дублирани ID, липсващи areas, различен формат на `available.json`.

## Dev Agent Record / File List / Change Log
- `tools/quests/add-quest.ts` — CLI поддръжка на `--path`, unlock/exploration automation-и.
- `tools/tests/quest-add.test.ts` — temp game smoke тестове (array/map available formats, unlocks, exploration hook, duplicates).
- `package.json` — `quest-add.test.ts` добавен към `npm test`.
- `README.md` — Quest helper секция описа флаговете и ограниченията.

## Status
done
