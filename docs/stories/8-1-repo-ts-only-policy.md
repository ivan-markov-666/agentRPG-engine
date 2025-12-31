# ST-031 — Repo TS-only Policy (no JS sources in git)

_Status: in-progress_

## Story Overview
Като техничен лидер искам репото да бъде TS-first/TS-only за source code (никакви `*.js` source файлове в git), а `dist/` да е чист build output (не-версиониран), за да имаме единна типизирана код база и предвидим build/run pipeline.

## Acceptance Criteria
- [x] `dist/` е build output и е в `.gitignore` (не се комитва).
- [ ] Няма JS source файлове в git (извън `dist/` и `node_modules/`).
- [x] Добавен е скрипт за проверка/инвентар на JS файлове (и strict режим за бъдеща enforcement).
- [x] `package.json` има скрипт за проверка (напр. `npm run check:no-js`).
- [x] TS-only компилация: `tsconfig.json` е с `allowJs: false`.
- [x] ESLint/Prettier конфигът е наличен в JSON формат (`.eslintrc.json`, `.prettierrc.json`).
- [x] Временни/локални helper JS файлове (ако са се появили по време на dev/debug) са премахнати от repo.

## Tasks / Subtasks
- [x] Обнови `.gitignore` да игнорира `dist/` и локални артефакти.
- [x] Добави TS CLI `check:no-js` (inventory + optional strict).
- [x] Обнови `package.json` със `check:no-js`.
- [x] Обнови `tsconfig.json` към TS-only (`allowJs: false`).
- [x] Добави `.eslintrc.json` и `.prettierrc.json` (TS-only конфиг).
- [x] Премахни `dist/` от git tracking (ако е tracked).
- [x] Премахни root-level временни `*.js` (ако съществуват) и замени с TS tooling (където е нужно).

## Dev Agent Record / File List / Change Log
- `.gitignore`
- `src/cli/check-no-js.ts`
- `package.json`
- `tsconfig.json`
- `.eslintrc.json`, `.prettierrc.json`
- `docs/analysis/epics-and-stories.md`
- `docs/stories/story-catalog.md`
- `docs/sprint-artifacts/sprint-status.yaml`

## Status
in-progress
