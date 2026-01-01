# Как да създадеш нова игра (AgentRPG Engine)

Този документ описва **end-to-end** процеса за създаване на нова игра върху AgentRPG Engine – от копиране на скелета, през попълване на задължителните файлове, до валидиране, runtime smoke и telemetry/KPI.

## 1) Бърз старт (Blank game skeleton)

1. **Копирай скелета**
   - Препоръчано (CLI helper):
     ```bash
     npm run blank:copy -- --dest games/<gameId>
     ```
   - Ръчно:
     - Bash: `cp -R samples/blank-game games/<gameId>`
     - PowerShell: `Copy-Item samples/blank-game games\<gameId> -Recurse`

2. **Задай език/дебъг режим (по избор)**
   ```bash
   npm run lang:set -- --game <gameId> --language bg --debug true
   ```

3. **Пусни валидатора**
   ```bash
   npm run validate -- --path games/<gameId> --run-id dev-local --summary --strict
   ```

## 2) Минимална структура (source-of-truth)

Минималният комплект файлове за playable игра е базиран на Product Brief v1 и validator contract-ите:

```
<gameId>/
  manifest/entry.json
  config/capabilities.json
  scenario/
    index.md
    areas/
      default-area.md
    quests/
      available.json
      unlock-triggers.json
      main-quest-01.md
    world/
      index.md
  player-data/
    session-init.json
    runtime/
      state.json
      completed-quests.json
      exploration-log.json
      history.full.jsonl
    saves/
      index.json
      saves/
        save-001.json
  ui/
    index.json
    scene.json
    actions.json
    hud.json
    history.json
```

## 3) Какво да редактираш първо (recommended order)

1. **`manifest/entry.json`**
   - `id`, `title`, `version`
   - pointers към:
     - `capabilities_file`
     - `scenario_index`
     - `ui_index`
     - `saves_index`
     - `full_history_file`

2. **`config/capabilities.json`**
   - Включи само capabilities, които искаш да използваш.
   - Дръж `state.json` синхронизиран с enabled capabilities (валидаторът проверява runtime наличността/диапазоните).

3. **`player-data/session-init.json`**
   - `preferred_language` е задължително.
   - `debug` е опционално.

4. **`scenario/index.md` + quests/areas**
   - `scenario/quests/available.json` трябва да има поне 1 quest.
   - `scenario/quests/unlock-triggers.json` трябва да е валиден JSON и да не сочи към несъществуващи quest ID-та.

5. **UI contracts (`ui/*.json`)**
   - `ui/index.json` сочи към останалите UI файлове.
   - Всеки файл има `schema_version` и се валидира от схемите в `tools/validator/schemas/`.

## 4) Quest authoring (CLI tooling)

### Добавяне на quest
Използвай helper-а (ако искаш scaffold):
```bash
npm run quest:add -- --path games/<gameId> --id side-quest-01 --title "Side Quest 01"
```

### Сценарен индекс
След добавяне на quests/areas, обнови индексите:
```bash
npm run scenario:index -- --game <gameId>
```

## 5) Area authoring (CLI tooling)

### Добавяне на area
```bash
npm run area:add -- --path games/<gameId> --id town-square --title "Town Square"
```

## 6) Валидиране (local DoD loop)

Препоръчителен local loop:

1. Пусни валидатора:
   ```bash
   npm run validate -- --path games/<gameId> --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary
   ```
2. Поправи WARN/ERROR кодовете.
3. Повтори, докато получиш clean резултат.

Форматът на изхода е:
`[LEVEL][CODE] file:message (suggested fix)`

## 7) Runtime smoke (по избор)

```bash
npm run runtime -- --path games/<gameId> --debug
```

Очаквано поведение:
- runtime loader зарежда manifest + pointers
- потвърждава `preferred_language`
- UI файловете са валидни и налични

## 8) Telemetry / KPI workflow (ST-035)

### 8.1 KPI файл за сесия
KPI измерванията се подават като JSON файл. Има пример:
- `samples/blank-game/telemetry/kpi.sample.json`

Препоръчано място за твоята игра:
- `games/<gameId>/telemetry/kpi.json`

Можеш да го обновяваш с helper:
```bash
npm run kpi:update -- --game <gameId> --first-min 2.5 --refusal-attempts 1 --refusal-successes 1 --validation-attempts 2 --completed-quests 1 --debug false
```

### 8.2 Логване на telemetry entry
За да се запише telemetry entry с KPI metrics:
```bash
npm run validate -- --path games/<gameId> --run-id dev-local --log docs/analysis/reports/telemetry-history.json --kpi games/<gameId>/telemetry/kpi.json
```

### 8.3 Metrics report
```bash
npm run metrics:report -- --history docs/analysis/reports/telemetry-history.json --insights docs/analysis/metrics-insights.md
```

## 9) Чести проблеми (troubleshooting)

- **`[ERROR][RUN-ID] Missing required --run-id`**
  - Винаги подавай `--run-id`. Можеш да генерираш чрез helper скриптовете `tools/scripts/run-id.(ps1|sh)`.

- **`FILE-MISSING`**
  - Липсва задължителен файл (най-често manifest, scenario index, saves index или UI pointer).

- **`CAP-*`**
  - Capabilities и runtime state са в несинхрон (липсващи stats, грешни диапазони, дубли и т.н.).

- **UI schema нарушения**
  - Провери `ui/index.json` pointers и `schema_version` във всеки UI файл.

## 10) Definition of Done (препоръка)

- ≥3 последователни clean run-а (0 errors / 0 warnings) със `--summary --strict`.
- `metrics:report` показва стабилни KPI и няма регресии в ключовите метрики.
