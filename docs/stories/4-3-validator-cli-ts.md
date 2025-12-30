# ST-012 — Validator CLI Migration to TypeScript

_Status: done_

## Story Overview
Като dev team искам validator CLI модулът да бъде пренаписан в TypeScript, за да използва споделените типове и да разполагаме с по-силен статичен анализ преди DoD run-ове.

## Acceptance Criteria
- [x] CLI entrypoint (`npm run validate`) е мигриран в TS и компилира към `dist/` (или екв.) без грешки.
- [x] Всички основни команди/флагове (от ST-001/ST-005) са типизирани и валидирани чрез TS интерфейси.
- [x] Validator модулите (schemas, telemetry writer, reporters, checks) импортват типовете от `src/types/` и минават през type-check.
- [x] Тестовият пакет (`npm test`) използва TS build артефактите и покрива ключови сценарии.
- [x] Документацията описва как да се билдва/стартира TS версията и какво остава в JS (ако има).

## Tasks / Subtasks
- [x] Конфигурирай build/ts-node pipeline за CLI (включително source maps).
- [x] Прехвърли основните файлове (parser, validator runner, reporters, checks, utils) в `.ts` и замени `require` с TS imports.
- [x] Обнови тестовете да стартират срещу новия build (`npm test`).
- [x] Актуализирай README/validator docs за TS build стъпките.

## Dev Notes
- Стандарт: `src/cli/validate.ts` → build към `dist/cli/validate.js`.
- Увери се, че CLI остава runnable чрез `node dist/cli/validate.js` и `npm run validate`.

## Dev Agent Record / File List / Change Log
- `package.json`: добавени build/dev скриптове и `yaml` зависимост.
- `src/cli/validate.ts`: TypeScript CLI entrypoint + импорти към новите TS checks/reporters/utils.
- `src/validator/**`: telemetry/io/schema utils, reporters, checks и общи типове.
- `docs/analysis/validator-readme.md`: инструкции за build/run (TS).
- `docs/sprint-artifacts/sprint-status.yaml`: статус на ST-012 → review.
- `docs/stories/4-3-validator-cli-ts.md`: този файл (статус + лога).

## Status
done
