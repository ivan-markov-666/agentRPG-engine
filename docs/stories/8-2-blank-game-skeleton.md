# ST-032 — Blank Game Skeleton & Samples

_Status: done_

## Story Overview
Като prompt-first creator искам официален `samples/blank-game/` скелет с валидни файлове и README инструкции, за да започна игра без да търся кои файлове са задължителни и как да ги попълня.

## Acceptance Criteria
- [x] Папката `samples/blank-game/` съдържа минималния списък от файлове, описан в Product Brief v1 (manifest, scenario/index.md, areas/quests, config/capabilities.json, player-data runtime файлове, session-init, README и др.).
- [x] Всички файлове от скелета минават clean `npm run validate -- --path samples/blank-game --run-id dev-blank --summary` без допълнителни фиксове.
- [x] README в `samples/blank-game/README.md` описва стъпка по стъпка как да попълниш скелета (manifest pointers, capabilities, quest/area структури, language preference, как да стартираш validate/runtime).
- [x] Скриптовете/документацията сочат към този скелет като "quick start" (напр. README Sprint Workflow, validator docs).
- [x] Добавени са smoke тест(ове), които копират скелета в temp директория, пускат validator и гарантират, че blank game остава валидна.

## Tasks / Subtasks
- [x] Изгради `samples/blank-game/` структура с всички задължителни файлове и placeholder съдържание.
- [x] Обнови validator/tests така, че blank game да се валидира автоматично (temp copy + validate run).
- [x] Обнови README / validator docs с инструкции за използване на blank game.
- [x] Добави scripted helper (по избор) за бързо копиране на blank game в `games/<id>`.

## Dev Agent Record / File List / Change Log
- `samples/blank-game/**`
- `README.md` (Sprint workflow + quick start секции)
- `docs/analysis/validator-readme.md`
- `tools/tests/blank-game.test.ts` (или еквивалент)

## Status
done
