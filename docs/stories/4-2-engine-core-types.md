# ST-011 — Engine Core Type Definitions

_Status: done_

## Story Overview
Като архитект искам общи TypeScript типове за scenario, state и capabilities контрактите, за да гарантирам, че всички слоеве (validator, engine runtime, tooling) използват еднакви структури.

## Acceptance Criteria
- [x] Създадени са типове/интерфейси: `CapabilityRanges`, `RuntimeState`, `QuestDefinition`, `UnlockTrigger`, `ExplorationLogEntry`.
- [x] Типовете се публикуват през `src/types/index.ts` (или отделен npm пакет) и се използват от validator/CLI модулите.
- [x] Създадени са sample TypeScript декларации за JSON файловете (например чрез `zod` или `typebox`, ако е приложимо).
- [x] Architecture/TSDoc описва зависимостите и как да се обновяват типовете при промени в schema.

## Tasks / Subtasks
- [x] Изведи схемите от stories ST-002, ST-006, ST-007, ST-008 в TypeScript типове.
- [x] Добави unit тестове (или type tests) за съвместимост между schema и типове.
- [x] Интегрирай типовете в validator кодовата база (import/usage).
- [x] Документирай процеса в Architecture Blueprint (Section „Technology Stack / TS Strategy“).

## Dev Notes
- Може да използваш `typebox` за синхронизация между schemas и types (опционално).

## Dev Agent Record / File List / Change Log
- `src/types/` — добавени `runtime-state.ts`, `unlock-triggers.ts`, `exploration-log.ts`, разширени `capabilities.ts`, `scenario.ts`, barrel `index.ts`.
- `dist/types/` — генерирани декларации/JS изход чрез `npm run build:ts` (publish за legacy JS).
- Validator integration: JSDoc typedef-и в `tools/validator/checks/{quests,schema,files}.js`, lint почистен.
- Тестове: `tools/validator/tests/validator.test.js` (YAML fallback) актуализиран за lint, `npm test` + `npm run typecheck && npm run build:ts && npm run lint:ts` зелени.
- Docs: README секция „TypeScript Tooling“, architecture blueprint описва core типовете и adoption процеса.

## Status
done
