# ST-011 — Engine Core Type Definitions

_Status: ready-for-dev_

## Story Overview
Като архитект искам общи TypeScript типове за scenario, state и capabilities контрактите, за да гарантирам, че всички слоеве (validator, engine runtime, tooling) използват еднакви структури.

## Acceptance Criteria
- [ ] Създадени са типове/интерфейси: `CapabilityRanges`, `RuntimeState`, `QuestDefinition`, `UnlockTrigger`, `ExplorationLogEntry`.
- [ ] Типовете се публикуват през `src/types/index.ts` (или отделен npm пакет) и се използват от validator/CLI модулите.
- [ ] Създадени са sample TypeScript декларации за JSON файловете (например чрез `zod` или `typebox`, ако е приложимо).
- [ ] Architecture/TSDoc описва зависимостите и как да се обновяват типовете при промени в schema.

## Tasks / Subtasks
- [ ] Изведи схемите от stories ST-002, ST-006, ST-007, ST-008 в TypeScript типове.
- [ ] Добави unit тестове (или type tests) за съвместимост между schema и типове.
- [ ] Интегрирай типовете в validator кодовата база (import/usage).
- [ ] Документирай процеса в Architecture Blueprint (Section „Technology Stack / TS Strategy“).

## Dev Notes
- Може да използваш `typebox` за синхронизация между schemas и types (опционално).

## Dev Agent Record / File List / Change Log
_(pending)_

## Status
ready-for-dev
