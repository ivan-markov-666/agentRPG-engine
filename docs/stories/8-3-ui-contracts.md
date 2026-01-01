# ST-033 — UI Contracts & Runtime Output Schemas

_Status: done_

## Story Overview
Като UI/engine dev искам официални JSON договори за `ui/*.json` и `player-data/runtime/history.full.jsonl`, за да може runtime да произвежда предсказуеми файлове, а външните UI клиенти да ги рендерират без ad-hoc parsing.

## Acceptance Criteria
- [x] Дефинирани са JSON schema файлове за `ui/scene.json`, `ui/actions.json`, `ui/hud.json`, `ui/history.json`, `ui/index.json`, както и формат за `player-data/runtime/history.full.jsonl` (описан в docs + optional schema for single entry).
- [x] Валидаторът проверява, че всички `ui/*.json` файлове (ако присъстват) са валидни спрямо съответните schema версии, а `ui/index.json` сочи към правилните файлове.
- [x] Runtime CLI (и/или host adapter) гарантира, че при сериализация спазва schema версиите и записва `schema_version` във всеки UI файл.
- [x] Добавени са sample файлове (games/demo + blank game) с актуализираните полета.
- [x] Документацията (README + validator docs) описва всяко UI API, задължителни/опционални полета и пример съдържание.
- [x] Добавени са тестове (validator/unit) за success + failure сценарии при нарушен UI contract.

## Tasks / Subtasks
- [x] Създай schema файловете (`tools/validator/schemas/ui.*.schema.json`).
- [x] Wire-нни ги в Ajv/validator (включително `ui/index.json` cross-file проверки).
- [x] Обнови runtime/host adapter типовете (`src/types/ui.ts` или подобно) и serialization helper-и.
- [x] Подготви sample UI файлове и обнови blank-game/games/demo.
- [x] Добави тестове (validator tests, integration smoke с runtime CLI).
- [x] Обнови docs (README, validator-readme) с UI contract секции.

## Dev Agent Record / File List / Change Log
- `tools/validator/schemas/ui.*.schema.json`
- `src/types/ui.ts`, `src/runtime/output.ts` (или екв.)
- `src/validator/checks/ui.ts`
- `tools/tests/ui-contracts.test.ts`
- `games/demo/ui/*`, `samples/blank-game/ui/*`
- `README.md`, `docs/analysis/validator-readme.md`

## Status
done
