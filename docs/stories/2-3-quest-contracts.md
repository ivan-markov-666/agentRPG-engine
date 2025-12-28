# ST-007 — Quest & Scenario Contract Validation

_Status: ready-for-dev_

## Story Overview
Като GM искам validator-ът да открива несъответствия между `scenario/index.md`, `available.json`, `unlock-triggers.json` и quest файловете, за да няма orphan quest-и и счупени линкове.

## Acceptance Criteria
- [ ] Validator хвърля грешка, ако quest, упоменат в `available.json`, няма съответен файл.
- [ ] Валидация за дублирани quest заглавия и ID-та.
- [ ] Проверка на `unlock-triggers.json` → всички dependency ID-та съществуват.
- [ ] Markdown link checker за quest файловете (от типа `[[QuestName]]`).
- [ ] Документация описва новите правила и предлага remediation стъпки.

## Tasks / Subtasks
- [ ] Имплементирай консолидиран loader, който изгражда граф на quest-ите и тригерите.
- [ ] Добави validator правила с ясни кодове (`QUEST-MISSING`, `QUEST-DUPLICATE`, `TRIGGER-INVALID`).
- [ ] Направи примерни failing/ passing fixtures + тестове.
- [ ] Обнови `validator-readme.md` и Product Brief секцията за FR-05.

## Dev Notes
- Подготви JSON отчет за диагностика (opc). Съхранявай в `docs/analysis/reports/quest-contract-report.json`.

## Dev Agent Record / File List / Change Log
_(pending)_

## Status
ready-for-dev
