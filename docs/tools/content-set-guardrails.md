---
title: Content set guardrails
description: Tooling и проверки за добавяне на DLC content sets, изисквани файлове и runtime state
---

# Content Set Guardrails & Tooling

Тази бележка описва вътрешния tooling за добавяне на нов DLC content set и guardrail/checklist стъпките, които трябва да покрием при всяка нова продукция.

## 1. CLI командата `npm run content-set:add`

Този скрипт `tools/content-set/add.ts` автоматизира следните задачи:

1. **Manifest entry** – Добавя запис в `games/<game>/manifest/entry.json` със зададени `id`, `title`, `scenario_index`, `capabilities_file`, `unlock_condition`, `state_namespace`.
2. **Scaffolding** (по подразбиране):
   - Създава базов сценарен index файл (markdown) в пътя, указан от `--scenario-index`.
   - Създава capabilities JSON (един примерен метър) – ще го редактираме ръчно.
   - Добавя stub в `player-data/runtime/state.json` с `content_sets[<id>] = { enabled, notes }`.
3. **Нови параметри**:
   - `--quest path::Title[::Summary]` — може да се повтори, за да scaffold-не `SCENARIOS/...` или `SCENARIO/QUESTS/...` markdown-и.
   - `--capabilities-template <path>` — използва custom JSON за capabilities вместо генератора (по подразбиране можем да посочим `tools/templates/content-set/capabilities.sample.json`).
   - `--state-template <path>` — инжектира готов state JSON в `player-data/runtime/state.json` (пример: `tools/templates/content-set/state.sample.json`).
   - `--quest` без допълнителен параметър ще използва inline template; ако искаш custom файл, просто копирай `tools/templates/content-set/quest.sample.md` и подай път към него чрез допълнителен tooling.
   - `--preset <id>` — prefill-ва всички по-горни параметри + quest списък според blueprint. Пример: `laut-stronghold` preset зарежда сценарните файлове, capabilities/state шаблоните и unlock условието.
4. **Стандартни параметри**:
   - `--game <id>` – директория под `games/`.
   - `--path <abs/rel>` – директен път до база на играта (override на `--game`).
   - `--id <slug>` – задължителен slug (използва се за manifest id).
   - `--title "<Title>"`, `--description "<...>"`.
   - `--scenario-index`, `--capabilities-file`, `--unlock`, `--state-namespace`, `--notes`.
   - `--default-enabled` – initial enabled flag.
   - `--no-files`, `--no-state` за пропускане на scaffolding.

### Пример: Добавяне на DLC-03 (Balkan Trail)

```bash
npm run content-set:add -- \
  --game the-golden-chariot-of-belintash-idea \
  --id balkan-trail \
  --title "Balkan Trail / Светлинният лъч" \
  --description "Експедиционен sandbox по линията Белинташ–Солун." \
  --scenario-index SCENARIOS/DLC/03-balkan-trail/index.md \
  --capabilities-file CONFIG/balkan-trail.capabilities.json \
  --unlock "state.flags.final_vision == true" \
  --state-namespace balkan_trail \
  --notes "Expedition map, convoy, diplomacy tracks." \
  --quest "SCENARIOS/DLC/03-balkan-trail/dlc-bt-01-map-of-light.md::Карта на Светлината::Стратегическо планиране на експедицията" \
  --quest "SCENARIOS/DLC/03-balkan-trail/dlc-bt-02-guardians-pass.md::Пазители на прохода::Тактически избори и дипломация" \
  --state-template templates/balkan-trail-state.json \
  --capabilities-template templates/balkan-trail-capabilities.json
```

### Пример: Добавяне на DLC-04 (Лаут) чрез preset

```bash
npm run content-set:add -- \
  --game the-golden-chariot-of-belintash-idea \
  --preset laut-stronghold \
  --id laut-stronghold \
  --title "Лаут — войнушкото селище"
```

Preset-ът:
- добавя manifest entry със зададеното unlock условие (`state.laut.alliance >= 'trusted'`) и state namespace;
- scaffold-ва `SCENARIOS/DLC/04-laut-stronghold/index.md` и свързаните куестове `dlc-ls-01..03`;
- копира capabilities/state шаблони от `tools/templates/content-set/laut-stronghold.*`;
- инжектира runtime state stub със същите полета като validator blueprint.

След изпълнение ще се генерира базов scaffolding в `games/<game>/...`. Ръчно преглеждаме:
- Обновяване на генерирания capabilities файл с реалните показатели (вж. по-долу).
- Допълване на сценарния index и добавяне на куест markdown-ите.
- Обновяване на runtime state със специфични полета и стойности.

## 2. Guardrail Checklist за всеки нов content set

### 2.1 Manifest & Paths

- [ ] `manifest/entry.json`: има запис с коректен `id`, `scenario_index`, `capabilities_file`, `unlock_condition`, `state_namespace`.
- [ ] За всяко DLC опиши `engine_layers` и `engine_features` (нови schema полета). Primaries: `["core-runtime","dlc-engine"]`, feature флагове като `"needs-loading-screen": true`.
- [ ] Основният manifest може да има глобално `engine_features` и `engine_notes`, които `ivan.md` използва за да синхронизира с engine build-овете.
- [ ] Пътеките сочат към реални файлове (SCENARIOS/..., CONFIG/...).
- [ ] Ако content set наследява други флагове, опиши ги в `notes`.

### 2.2 Scenarios & Markdown

- [ ] Създай `SCENARIOS/DLC/<id>/index.md` с таблица за куестите и overview.
- [ ] Създай куест файлове (`dlc-xx-01-*.md`), outline + state hooks.
- [ ] Обнови документацията в `docs/analysis/post-credit-hooks.md` / други аналитични документи (unlock, системи, cross-DLC влияния).

### 2.3 Capabilities

- [ ] `CONFIG/<id>.capabilities.json`: изброи всички метрики/гейтове, които ще чете UI/validator.
- [ ] Увери се, че полета имат коректни `min`/`max` и `desc`.
- [ ] Ако има нови капабилити, update-вай и `docs/systems/<...>.md` при нужда.

### 2.4 Runtime State

- [ ] `player-data/runtime/state.json`: добави `content_sets.<id>.state` с всички нужни полета.
- [ ] Добави `notes` за TODO и cross-DLC hook описания.
- [ ] Ако се използват cross-save telemetry полета, синхронизирай `dlc_state.<id>` секцията.

### 2.5 Validator Guardrails

- [ ] `src/validator/checks/files.ts`: добави `REQUIRED_FILES` списък за content set-а, state правила (`CONTENT-SET-<ID>-STATE`).
- [ ] `tools/validator/schemas/state.schema.json`: добави schema definition за runtime state блока.
- [ ] `tools/validator/schemas/manifest.entry.schema.json`: поддържа и новите `engine_features`/`engine_layers` полета (общо и на ниво content set). Обнови документация и типовете когато добавяш нови полета.
- [ ] `tools/validator/tests/validator.test.ts`: добави тестове за:
  - липсващи файлове (`CONTENT-SET-<ID>-FILE`);
  - валиден сценарий с налични файлове;
  - state guardrails (missing fields, wrapper).
- [ ] Ако manifest schema изисква допълнителни полета, обнови `tools/validator/schemas/manifest.entry.schema.json`.

### 2.6 Documentation & Communication

- [ ] Актуализирай `docs/analysis/post-credit-hooks.md` за новата структура.
- [ ] Ако DLC влияе на бъдещи content sets, добави го в секцията „Cross-DLC state влияния“.
- [ ] Добави резюме в release notes / README, ако е публично.

## 3. Future Work / Ideas

- Автоматично генериране на куест markdown-и през допълнителни CLI флагове (`--quests 3` + templates).
- Директно вкарване на runtime state schema/capabilities skeleton според predefined blueprint.
- Hook към validator CLI за бърз smoke-check: `npm run validate -- --path games/<game> --checks content-set`.

---

**TL;DR**: Използвай `npm run content-set:add` за бързо scaffold-ване и следвай checklist-a, за да не пропуснем manifest/runtime/validator синхронизацията.
