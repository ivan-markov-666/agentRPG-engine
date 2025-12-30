# ST-022 — Quest Authoring Tool (quest:add)

_Status: ready-for-dev_

## Story Overview
Като GM/dev искам CLI инструмент за добавяне на нов quest, който автоматично генерира минимално валиден quest markdown и синхронизира `available.json` / `unlock-triggers.json`, за да ускоря content authoring и да намаля риска от validator regressions.

## Acceptance Criteria
- [ ] Команда `npm run quest:add -- ...` създава нов файл `games/<gameId>/scenario/quests/<questId>.md`.
- [ ] Ако `--id` не е подаден, `questId` се генерира детерминистично (slug) от `--title`.
- [ ] Инструментът обновява `games/<gameId>/scenario/quests/available.json`, като поддържа двата формата:
  - [ ] array от `{ id, title }`
  - [ ] map `{ [id]: title }`
- [ ] Новият quest markdown съдържа секции: `Summary`, `Story`, `Hooks`, `Encounters`, `Steps`, `Rewards`, `Notes`, `Outcome`, `Aftermath`, `Outcome Hooks`, `Conditions`, `Fail State`.
- [ ] При липсващи входни стойности инструментът попълва placeholder-и, така че новият quest да покрива минималните guardrails (Steps >= 2; Rewards/Hooks/Encounters/Notes >= 1).
- [ ] Ако е подаден `--areas`, инструментът:
  - [ ] валидира, че `games/<gameId>/scenario/areas/<areaId>.md` съществува за всяка area
  - [ ] добавя секция `Linked Areas` в quest файла
- [ ] Ако са подадени `--unlock` и/или `--unlock-requires`, инструментът обновява `games/<gameId>/scenario/quests/unlock-triggers.json` с нов trigger за `questId`.
- [ ] Ако е подаден `--exploration-hook`, инструментът гарантира, че `player-data/runtime/exploration-log.json` съдържа entry за всяка линкната area и добавя таг `quest:<questId>` (create-or-update).
- [ ] Инструментът връща non-zero exit code при дублиран quest id/заглавие или при опит за overwrite на съществуващ quest файл.

## Tasks / Subtasks
- [ ] Уточни и фиксирай CLI contract-а (README ↔ скрипт): флагове, error codes, exit behavior.
- [ ] Добави/разшири тестове за `quest:add` върху temp game workspace (create quest + available.json update + unlock trigger update).
- [ ] Документирай edge cases: дублирани ID, липсващи areas, различен формат на `available.json`.

## Dev Agent Record / File List / Change Log
- `tools/quests/add-quest.js`
- `tools/tests/*.test.js`
- `README.md`

## Status
ready-for-dev
