# ST-030 — Runtime CLI (load snapshot)

_Status: done_

## Story Overview
Като dev искам официален CLI entrypoint `npm run runtime`, който зарежда runtime snapshot (manifest + session-init + runtime state) чрез Host Adapter и го извежда в консолата, за да мога бързо да проверя, че game package се зарежда коректно преди GM сесия.

## Acceptance Criteria
- [x] Команда `npm run runtime -- --path games/<gameId> [--debug]` зарежда:
  - [x] `manifest/entry.json`
  - [x] `player-data/session-init.json` (ако съществува)
  - [x] `player-data/runtime/state.json`
- [x] При normal mode (без `--debug`) извежда кратка информация:
  ```
  Loaded: <title> (<id>) v<version>
  preferred_language: <lang> (ако е налично)
  ```
- [x] При `--debug` извежда пълния JSON snapshot (pretty-printed).
- [x] CLI връща non-zero exit code при грешки (липсващи файлове, parse errors, invalid contract).
- [x] README съдържа кратка секция за `npm run runtime` usage.
- [x] Добавен е минимален тест (mock game) за успешен load и за error handling.

## Tasks / Subtasks
- [x] Уточни/фиксирай CLI contract-а (`--path`, `--debug`) и error handling.
- [x] Добави README секция за runtime CLI (quick usage).
- [x] Добави unit/integration тест за happy-path и за missing file scenarios.

## Dev Agent Record / File List / Change Log
- `src/cli/runtime.ts` (вече съществува)
- `dist/cli/runtime.js` (обновен да използва HostAdapter)
- `dist/runtime/` (LocalFsHostAdapter и loader имплементации)
- `package.json` (вече има `runtime` и `runtime:dev` скриптове)
- `README.md` (добавена Runtime CLI секция)
- `tools/tests/runtime-cli.test.js` (обновени тестове)

## Status
ready-for-dev
