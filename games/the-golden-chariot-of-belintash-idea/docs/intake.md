# Intake — The Golden Chariot of Belintash

## 1. World & Core Fantasy (status: ✅ pass #1)
- Сетинг: пост-кръстоносни Родопи, магично-историческа БГ митология.
- Основен конфликт: Златната колесница и лъчите, пазени от Белинташ.
- Табута: модерна технология, нарушаване на vow-ове, исторически неточности.
- Източници: WORLD-BIBLE.md, HISTORICAL-FACTS.md, MAIN-QUEST-OUTLINE.md.

## 2. Acts / Main Plot / Epilogue (status: ✅ pass #1)
- Act структура и финали описани в MAIN-QUEST-OUTLINE.md + ENDINGS.md.
- Post-credit DLC hooks в docs/analysis/post-credit-hooks.md.
- Нужда: да синхронизираме manifest content_sets с тези DLC описания.

## 3. Areas & Navigation (status: ✅ pass #1)
- LOCATIONS.md + TRAVEL-SYSTEM.md описват области и връзки.
- SCENARIOS/ съдържа областни markdown-и (Act I–V).
- Gap: проверка дали всички areas имат wiki links обратно към quest файловете.

## 4. Quests & Choices (status: ⚠️ needs pass #2)
- SCENARIO-WRITING-PLAN.md, SIDE-QUESTS.md, MAIN-QUEST-OUTLINE.md.
- Имаме стотици сцени, но `scenario/quests/*.md` трябва да се уверим, че отразяват актуалните истории и `available.json`/`unlock-triggers.json` са синхронизирани.
- TODO: run `npm run scenario:index -- --game the-golden-chariot-of-belintash-idea` след синхронизация.

## 5. Capabilities & Stats (status: ✅ pass #1)
- GAME-CAPABILITIES.md описва всички метрики (convoy, ward, morale, и т.н.).
- Gap: да проверим `CONFIG/*.json` дали съдържат тези capabilities и да обновим runtime state schema (особено за DLC-04).

## 6. Economy & Currency (status: ✅ pass #1)
- CURRENCY-SYSTEM.md и ECONOMY секциите в quests.
- Нужда: да пуснем `npm run economy:report -- --game the-golden-chariot-of-belintash-idea` за текущ sanity check.

## 7. Content Sets / DLC (status: ⚠️ needs pass #2)
- Blueprint за DLC-01..04 е в post-credit hooks и validator docs.
- Manifest/entry.json + player-data/runtime/state.json трябва да отразяват `engine_layers`, `engine_features`, `content_sets.*` state.
- TODO: провери `manifest/entry.json` + runtime state срещу новата schema, добави templates (ivan-smoke).

## 8. Exploration & Events (status: ⚠️ needs pass #2)
- Нямаме потвърден `player-data/runtime/exploration-log.json` (трябва да проверим в player-data/runtime/).
- Ако exploration е включено, нужно е да scaffold-нем лог + preview списък.

## 9. UI / Contracts (status: ⚠️ needs pass #2)
- Няма UI папка в списъка → вероятно липсва `ui/index.json` и свързаните файлове.
- Ако искаме UI contract, трябва да го добавим (или изрично да не го изискваме в manifest).

## 10. Telemetry & KPI (status: ⚠️ needs pass #2)
- telemetry templates са налични глобално (ivan-smoke.kpi.json), но game папката няма telemetry директория.
- TODO: `games/<id>/telemetry/kpi.json` + history/log командите.

## 11. Runtime / Loader (status: ✅ pass #1)
- `player-data/runtime/` съществува (ще валидираме state.json, completed-quests.json, session-init).
- Gap: да добавим smoke snapshot (ivan-smoke.state.json) ако искаме бърз валидатор run.

## 12. Compliance & Tests (status: ⚠️ needs pass #2)
- Трябва да пуснем `npm run test:validator` / `npm run test` след updates.
- Все още няма запис, че е пуснат economy/metrics/exploration tooling за тази игра.

### Next Steps
1. Потвърди секциите със ⚠️ (Quests, content sets, exploration, UI, telemetry, compliance) чрез допълнителни въпроси.
2. След като intake е пълен, актуализираме manifest/runtime/quests/telemetry файловете.
3. Пускаме tooling команди и валидираме.
