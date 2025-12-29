# ST-007 — Quest & Scenario Contract Validation

_Status: done_

## Story Overview
Като GM искам validator-ът да открива несъответствия между `scenario/index.md`, `available.json`, `unlock-triggers.json` и quest файловете, за да няма orphan quest-и и счупени линкове.

## Acceptance Criteria
- [x] Validator хвърля грешка, ако quest, упоменат в `available.json`, няма съответен файл.
- [x] Валидация за дублирани quest заглавия и ID-та.
- [x] Проверка на `unlock-triggers.json` → всички dependency ID-та съществуват.
- [x] Markdown link checker за quest файловете (от типа `[[QuestName]]`).
- [x] Документация описва новите правила и предлага remediation стъпки.

## Tasks / Subtasks
- [x] Имплементирай консолидиран loader, който изгражда граф на quest-ите и тригерите.
- [x] Добави validator правила с ясни кодове (`QUEST-MISSING`, `QUEST-DUPLICATE`, `TRIGGER-INVALID`).
- [x] Направи примерни failing/ passing fixtures + тестове.
- [x] Обнови `validator-readme.md` и Product Brief секцията за FR-05.

## Dev Notes
- Quest contract checker вече сравнява `available.json`, `scenario/index.md`, quest файловете и `unlock-triggers.json`. Нови кодове: `INDEX-QUEST-MISSING`, `INDEX-QUEST-UNKNOWN`, `INDEX-QUEST-DUPLICATE`.
- Markdown линковете и quest секциите вече имат по-стриктни guardrails (Rewards, Steps, Hooks и т.н.).
- JSON отчетът за диагностика остава opc за бъдещ release (не в scope на ST-007).

## Dev Agent Record / File List / Change Log
- `tools/validator/checks/quests.js` — парсване на scenario index, new guardrails, cross-file validation.
- `tools/validator/tests/validator.test.js` — интеграционен тест за разминаване между index и available.
- `docs/analysis/validator-readme.md` — секция за Quest & Scenario contract контрол.
- `npm test` — покритие на validator + archive telemetry.

## Status
done
