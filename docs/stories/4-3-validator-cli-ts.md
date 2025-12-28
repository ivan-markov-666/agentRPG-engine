# ST-012 — Validator CLI Migration to TypeScript

_Status: ready-for-dev_

## Story Overview
Като dev team искам validator CLI модулът да бъде пренаписан в TypeScript, за да използва споделените типове и да разполагаме с по-силен статичен анализ преди DoD run-ове.

## Acceptance Criteria
- [ ] CLI entrypoint (`npm run validate`) е мигриран в TS и компилира към `dist/` (или екв.) без грешки.
- [ ] Всички основни команди/флагове (от ST-001/ST-005) са типизирани и валидирани чрез TS (например с `yargs` типове или собствени интерфейси).
- [ ] Validator модулите (schemas, telemetry writer) импортват типовете от `src/types/` и минават през type-check.
- [ ] Тестовият пакет е обновен да използва TS build (или ts-jest/esbuild) и покрива ключови сценарии.
- [ ] Документацията описва как да се билдва/стартира TS версията и какво остава в JS (ако има).

## Tasks / Subtasks
- [ ] Конфигурирай build/ts-node pipeline за CLI (включително source maps).
- [ ] Прехвърли основните файлове (parser, validator runner, reporters) в `.ts` и замени `require` с ESM/TS imports.
- [ ] Обнови test tooling (jest/mocha) да поддържа TS (ts-jest или `tsx` runner).
- [ ] Актуализирай README/validator docs за TS build стъпките.

## Dev Notes
- Стандарт: `src/cli/validate.ts` → build към `dist/cli/validate.js`.
- Увери се, че CLI остава runnable чрез `node dist/cli/validate.js` и `npm run validate`.

## Dev Agent Record / File List / Change Log
_(pending)_

## Status
ready-for-dev
