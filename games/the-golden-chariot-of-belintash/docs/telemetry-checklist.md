# Telemetry & Exploration Checklist (Phase 4 ➜ 5 bridge)

## 1. Runtime sources
| Source | Purpose | Notes |
| --- | --- | --- |
| `player-data/runtime/state.json` | базови метрики за HUD/време/метео | проверявай `world_state` и `stats` блоковете преди логване |
| `player-data/runtime/exploration-log.json` | ground-truth за откритията (Act I) | всички записи имат `quest_id` + `area_id`; новите `mostovo-herb-terraces`, `vrata-sentinel-climb` покриват Мостово/Врата |
| `telemetry/history.json` | roll-up на събития (Act I smoke) | текущо placeholder `[]`; след Phase 5 ще използваме same schema като `history.full.jsonl` |
| `telemetry/kpi.sample.json` | примерни KPI дефиниции | копирай като `telemetry/kpi.json` при финален пас |

## 2. Logging cadence
1. **След всяка основна стъпка в main quests:** добави exploration entry (type `travel`/`area`) и лог в history file (event type `quest-progress`).
2. **Side quests / companions:** когато companion се отключи или approval се променя → телеметричен event `companion:update` с delta стойност.
3. **Икономика:** важни сделки → event `economy:transaction` (payload: валута, стойност, NPC). Следим `currency_delta` за KPI.

## 3. Commands / validation
| Command | Кога | Резултат |
| --- | --- | --- |
| `npm run validate -- --path games/the-golden-chariot-of-belintash --summary` | край на всяка фаза | гарантира CAP / QUEST / AREA clean |
| `npm run telemetry:check -- --game the-golden-chariot-of-belintash` | след като добавим KPI файлове | проверка на JSON schema за `telemetry/*.json` |
| `npm run scenario:index -- --path games/the-golden-chariot-of-belintash` | след нови exploration logs/quests | обновява индексите за tooling |

## 4. Pending telemetry tasks (Phase 5 prep)
1. Попълни `telemetry/history.json` с тестови събития (quest progression, exploration, economy).
2. Деривирай реален `telemetry/kpi.json` от sample: KPIs за skill-check success, currency delta, companion approval, exploration completion.
3. Добави `docs/analysis/telemetry-report.md` (или подобен) за описанието на KPI и как се четат.
4. Свържи validator log с telemetry: добави запис във `docs/plan.md` при всеки run (кратка таблица с дата/резултат) за проследяване.

> Бележка: Phase 5 ще изисква hook към UI/saves, затова всички телеметрични файлове трябва да са финално синхронизирани преди manifest updates.
