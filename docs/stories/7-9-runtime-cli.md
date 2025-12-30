# ST-030 — Runtime CLI (load snapshot)

_Status: ready-for-dev_

## Story Overview
Като dev искам официален CLI entrypoint `npm run runtime`, който зарежда runtime snapshot (manifest + session-init + runtime state) чрез Host Adapter и го извежда в консолата, за да мога бързо да проверя, че game package се зарежда коректно преди GM сесия.

## Acceptance Criteria
- [ ] Команда `npm run runtime -- --path games/<gameId> [--debug]` зарежда:
  - [ ] `manifest/entry.json`
  - [ ] `player-data/session-init.json` (ако съществува)
  - [ ] `player-data/runtime/state.json`
- [ ] При normal mode (без `--debug`) извежда кратка информация:
  ```
  Loaded: <title> (<id>) v<version>
  preferred_language: <lang> (ако е налично)
  ```
- [ ] При `--debug` извежда пълния JSON snapshot (pretty-printed).
- [ ] CLI връща non-zero exit code при грешки (липсващи файлове, parse errors, invalid contract).
- [ ] README съдържа кратка секция за `npm run runtime` usage.
- [ ] Добавен е минимален тест (mock game) за успешен load и за error handling.

## Tasks / Subtasks
- [ ] Уточни/фиксирай CLI contract-а (`--path`, `--debug`) и error handling.
- [ ] Добави README секция за runtime CLI (quick usage).
- [ ] Добави unit/integration тест за happy-path и за missing file scenarios.

## Dev Agent Record / File List / Change Log
- `src/cli/runtime.ts` (вече съществува)
- `package.json` (вече има `runtime` и `runtime:dev` скриптове)
- `README.md`
- `tools/tests/*.test.js`

## Status
ready-for-dev
