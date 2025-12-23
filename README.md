# ... Loading
## Alert!!! Under Active Development !!! 
### Do not use! Wait until the engine is ready!

# AgentRPG Engine — Workspace Guide

## Основни документи
- Product brief: `docs/analysis/product-brief-A RPG game engine for LLM models.-2025-12-19.md`
- Capabilities каталог: `docs/analysis/capabilities-catalog.md`
- Blank game README (шаблон за игра): `docs/analysis/blank-game-README.md`
- Валидатор (CLI) README: `docs/analysis/validator-readme.md`

## Валидатор (CLI)
- Пускане директно: `node tools/validator/index.js --path games/<gameId> [--json out.json] [--debug]`
- NPM script: `npm run validate -- --path games/<gameId> [--json out.json] [--debug]`
- Проверява: задължителни файлове, CAP-* правила, orphans (quests/areas), quest ID↔title; опционален JSON репорт.
- Локален pre-release run: `npm run validate -- --path games/<gameId> --json reports/last.json --append --snapshot reports/last.json --strict --summary`
- Alias примери:
  - PowerShell (в `$PROFILE`):
    ```powershell
    function arpg-validate {
      param([string]$game = "demo")
      npm run validate -- --path "games/$game" --json reports/last.json --append --snapshot reports/last.json --strict --summary
    }
    ```

### Exploration log helper (CLI)
- Скрипт: `npm run exploration:add -- --title "..." [--game demo] [--type dungeon] [--area area-id] [--origin player-request|gm-suggested] [--desc "..."] [--tags tag1,tag2]`.
- Автоматично генерира slug `id`, ISO8601 `added_at`, базов description (ако липсва), опционални `tags` (до 10), поддържа `--area` само ако има съответен `scenario/areas/<area>.md`.
- Ако `player-data/runtime/exploration-log.json` липсва → създава масив; ако `state.json` няма `exploration_enabled`, го включва и попълва `exploration_log_preview` с последните entry ID-та.

### Quest helper (CLI)
- Скрипт: `npm run quest:add -- --title "..." [--id quest-slug] [--summary "..."] [--steps "Step A|Step B"] [--rewards "500 XP|Rare loot"] [--game demo]`.
- Автоматично генерира slug `quest_id` (ако не е подаден), проверява `scenario/quests/available.json` за дублирани ID/заглавия (поддържа масив или map), добавя новия запис и създава Markdown файл с `Summary / Steps / Rewards` скеле.
- Стъпките по подразбиране са номериран списък; наградите получават placeholder, ако не са подадени. Скриптът отказва да overwrite-ва съществуващ quest файл, за да пази историите.

### Release checklist (преди GM session / pre-release)
- 1) (По нужда) Добави/обнови area: `npm run area:add -- --id <area-id> --title "..." --description "..." --game <gameId>`
- 2) (По нужда) Добави quest scaffold: `npm run quest:add -- --title "..." --game <gameId>`
- 3) (По нужда) Добави exploration entry (само ако area файлът вече съществува): `npm run exploration:add -- --title "..." --type poi --area <area-id> --game <gameId>`
- 4) Пусни валидатор в строг режим: `npm run validate -- --path games/<gameId> --strict --summary`
- 5) (Препоръчително) Snapshot regression чек: `npm run validate -- --path games/<gameId> --json docs/analysis/reports/latest-run.json --append --snapshot docs/analysis/reports/latest-run.json --strict --summary`
- Run ID helper-и:
  - PowerShell profile (пример за `$PROFILE`):
    ```powershell
    Import-Module "$PSScriptRoot/../scripts/run-id.ps1"
    function arpg-run-id {
      param([string]$persona = "dev", [switch]$branch)
      New-AgentRPGRunId -Persona $persona -IncludeBranch:$branch
    }
    ```
    Изпълнение: `npm run validate -- --run-id (arpg-run-id -persona gm -branch)`
  - Bash `~/.bashrc`:
    ```bash
    source ~/Projects/LLMEngine/scripts/run-id.sh
    arpg_run_id() { run_id "${1:-dev}" "${2:-true}"; }
    ```
    Изпълнение: `npm run validate -- --run-id "$(arpg_run_id gm true)" ...`
- Комбиниран task (snapshot → telemetry → summary):
  - PowerShell: `npm run validate -- --path games/demo --json ".\\docs\\analysis\\reports\\latest-run.json" --log ".\\docs\\analysis\\reports\\telemetry-history.json" --run-id dev-001 --append --snapshot ".\\docs\\analysis\\reports\\snapshot-example.json" --strict --summary`
  - Bash: `npm run validate -- --path games/demo --json ./docs/analysis/reports/latest-run.json --log ./docs/analysis/reports/telemetry-history.json --run-id dev-001 --append --snapshot ./docs/analysis/reports/snapshot-example.json --strict --summary`
  - Bash/Zsh:
    ```bash
  arpg_validate() {
    game=${1:-demo}
    npm run validate -- --path "games/$game" --json reports/last.json --append --snapshot reports/last.json --strict --summary
  }
  ```

### Telemetry baseline (22 дек 2025)
| Показател | Стойност | Източник |
|-----------|----------|----------|
| Средно време за run | ~103 ms (150 ms, 17 ms, 143 ms) | `docs/analysis/reports/telemetry-history.json` |
| Среден брой предупреждения | 1.67 → 0 след финалния run `dev-20251222-1548a` | `telemetry-history.json`, `latest-run.json` |
| Най-чести кодове преди fix | `SCHEMA-NOT-AVAILABLE`, `MANIFEST-FIELD`, `CAP-UNKNOWN-RUNTIME` | `telemetry-history.json` |
| Definition of Done | ≥3 поредни run-а с `errors=0`, `warnings=0`, `CAP errors=0`, snapshot `New codes = none`, средно време <200 ms | Product brief Step 4 |

> Напомняне: при ≥50 run-а или преди release – пусни `npm run archive:telemetry -- --label <tag>` и рестартирай `telemetry-history.json`.

## Sprint 01 — Validator Reliability
- **Schema guardrails:** `config/capabilities.*` и `player-data/runtime/state.json` вече се валидират чрез JSON Schema + Ajv (вкл. `ajv-formats`). Валидацията следи вложени стойности (`reputation.*`, `currency.*`, `status_effects.*.stack>=0`) и връща `CAP-RUNTIME-RANGE` / `CAP-STATUS-STACK` при отклонения.
- **Exploration log schema:** `player-data/runtime/exploration-log.json` минава през `EXPLORATION-SCHEМА` guardrail (slug `id`, тип от {`city`,`landmark`,`dungeon`,`mcp`,`side-quest-hook`,`poi`}, `added_at` ISO8601, `origin` = `player-request`/`gm-suggested`, описания ≥40 символа, `tags` ≤10 уникални записа). Липсващ/празен лог при включено exploration води до `FILE-MISSING-OPTIONAL` / `EXPLORATION-EMPTY`. Допълнителни проверки: `EXPLORATION-DESCRIPTION-SHORT`, `EXPLORATION-TAGS-MIN`, `EXPLORATION-DUPLICATE-*`, `EXPLORATION-AREA-MISSING`, както и `EXPLORATION-PREVIEW-MISMATCH` когато `state.json` съдържа preview ID-та без реални записи.
- **Unit & integration tests:** `tools/validator/tests/validator.test.js` покрива SCHEMA guardrails, YAML fallback, snapshot/ignore сценарий и изисква чист `scenario/index.md`.
- **Quest / area guardrails:** `available.json` засича `QUEST-ID-DUPLICATE`, заглавия под 5 символа (`QUEST-TITLE-SHORT`) и липсващи unlock политики (`UNLOCK-MISSING`). Unlock стойностите проверяват празни/дублирани условия (`UNLOCK-EMPTY`, `UNLOCK-DUPLICATE`, `UNLOCK-VALUE-TYPE`). Линковете към `[[areas]]` искат двупосочни връзки (`QUEST-AREA-BACKLINK`). Новият area guardrail следи `scenario/areas/*.md` за задължителни секции, списъци и валидни линкове (`AREA-DESCRIPTION`, `AREA-POINTS`, `AREA-CONNECTIONS`, `AREA-LINK`, `AREA-QUEST-BACKLINK`, др.).
- **Telemetry отчети:** пусни `npm run metrics:report` (по избор с `--history <file> --out <file> --limit <N>`), за да регенерираш `docs/analysis/metrics-summary.md` от `docs/analysis/reports/telemetry-history.json`.
- **DoD reminder:** ≥3 последователни чисти run-а (`errors=0`, `warnings=0`, `CAP errors=0`, snapshot `New codes = none`, средно време <200 ms). Документ: `docs/analysis/build-focus-2025-12-sprint01.md`.

**Пример exploration log entry**
```json
{
  "id": "sunken-ruins",
  "title": "Sunken Ruins beneath Velora Bay",
  "type": "dungeon",
  "area_id": "velora-bay",
  "description": "Collapsed stone halls revealed at low tide; echoes of an old mage guild linger here.",
  "added_at": "2025-12-22T19:41:00Z",
  "tags": ["ancient", "water"],
  "origin": "player-request"
}
```

## Къде са изходните файлове
- Валидатор код: `tools/validator/` (checks, reporters, utils).
- Конфигурации/документи: `docs/analysis/`.

## Отговорности (dev vs GM)
| Роля | Какво прави | Кога |
|------|-------------|------|
| Dev (feature branch) | Стартира `npm run validate ... --run-id dev-XX` преди push; поддържа `latest-run.json` чист. | Преди всеки PR / merge. |
| Dev (release candidate) | Пуска комбинирания task + `npm run archive:telemetry -- --label rc-<номер>`, ако историята надхвърля 50 run-а. | При смяна на спринт/RC. |
| GM / Facilitator | Чете telemetry-history, изисква архив преди major session; проверява snapshot (New codes = none). | Преди GM session и след финална QA проверка. |
| Analyst / QA | Изнася архивите (`docs/analysis/reports/archive/*.json`) към хранилище; анализира avg retries / mean time to green. | Седмична ретроспекция или при инцидент. |

## Забележка за UI
Engine-ът е file-first и няма UI; `ui/*.json` са read-only контракти за бъдещ viewer/framework.
