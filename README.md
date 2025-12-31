# ... Loading
## Alert!!! Under Active Development !!! 
### Do not use! Wait until the engine is ready!

# AgentRPG Engine — Workspace Guide

## Основни документи
- Product brief: `docs/analysis/product-brief-A RPG game engine for LLM models.-2025-12-19.md`
- Capabilities каталог: `docs/analysis/capabilities-catalog.md`
- Blank game README (шаблон за игра): `docs/analysis/blank-game-README.md`
- Валидатор (CLI) README: `docs/analysis/validator-readme.md`

## Quick Start — Blank Game Skeleton
1. **Копирай скелета** (избери shell):  
   - PowerShell: `Copy-Item samples/blank-game games/<gameId> -Recurse`  
   - Bash: `cp -R samples/blank-game games/<gameId>`
2. **Попълни минималните файлове** според `docs/analysis/blank-game-README.md` (manifest title, quest/area описания, runtime stats).
3. **Пусни валидатора**:
   ```bash
   npm run validate -- --path games/<gameId> --run-id dev-local --summary --strict
   ```
4. **Използвай скелета за DoD**: той вече има валидни `capabilities.json`, `state.json`, quest/area файлове и ще мине clean run-ове веднага след копиране.

## Валидатор (CLI)
- Пускане директно (след `npm run build:ts`): `node dist/cli/validate.js --path games/<gameId> --run-id <prefix-uuid> [--json out.json] [--debug]`
- NPM script: `npm run validate -- --path games/<gameId> --run-id <prefix-uuid> [--json out.json] [--debug]`
- `--run-id` е **задължителен**. Използвай helper-ите `tools/scripts/run-id.ps1` и `tools/scripts/run-id.sh`, за да генерираш стойности като `dev-123e4567-e89b-12d3-a456-426614174000`.
- Проверява: задължителни файлове, CAP-* правила, orphans (quests/areas), quest ID↔title; опционален JSON репорт.
- Локален pre-release run: `npm run validate -- --path games/<gameId> --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary`
- Alias примери:
  - PowerShell (в `$PROFILE`):
    ```powershell
    function arpg-validate {
      param([string]$game = "demo")
      npm run validate -- --path "games/$game" --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary
    }
    ```
    ```powershell
    function arpg-run-id {
      param([string]$Prefix = "dev", [switch]$Copy)
      New-AgentRPGRunId -Prefix $Prefix -Copy:$Copy
    }
    ```

### Exploration log helper (CLI)
- Скрипт: `npm run exploration:add -- --title "..." [--game demo] [--type area|quest|event] [--area area-id] [--quest quest-id] [--origin player-request|gm-suggested] [--desc "..."] [--tags tag1,tag2] [--notes "..."] [--preview-limit 5] [--preview-mode newest|append]`.
- Валидира типа срещу guardrails (`area` изисква `--area`, `quest` изисква `--quest`) и проверява дали целевата area/quest markdown съществува.
- Ако описанието е твърде кратко (<60 символа) добавя подсказки, за да мине `EXPLORATION-DESCRIPTION-SHORT`. Ако не подадеш tags → добавя placeholder/автотагове (по тип + `area:<id>`/`quest:<id>`) за минимум 1 таг. Скриптът поддържа до 10 уникални тага и обновява `state.exploration_log_preview`, като `--preview-limit` и `--preview-mode` контролират подредбата (по подразбиране newest, алтернатива append).
- Активиране: в `player-data/runtime/state.json` задай `exploration_enabled: true` (или `exploration.enabled: true`) и поддържай `player-data/runtime/exploration-log.json` валиден спрямо schema. При активиран режим липсващ лог или schema нарушения водят до `ERROR`.
- Пример entry:
  ```json
  {
    "id": "training-spur",
    "title": "Training Grounds Recon",
    "type": "area",
    "area_id": "training-grounds",
    "added_at": "2025-12-22T21:27:12.100Z",
    "origin": "gm-suggested",
    "tags": ["scouting", "quest:main-quest-01"],
    "description": "Sergeant Isla highlighted the wolf incursion vectors and marked hotspots tied to sabotage rumors.",
    "notes": "Add this entry to exploration_log_preview for quick recap."
  }
  ```

### Quest helper (CLI)
- Скрипт: `npm run quest:add -- --title "..." [--id quest-slug] [--summary "..."] [--story "..."] [--hooks "Hook A|Hook B"] [--encounters "Fight|Puzzle"] [--steps "Step A|Step B"] [--rewards "500 XP|Rare loot"] [--notes "NPC: ...|Consequence: ..."] [--outcome "Success hook|Faction change"] [--aftermath "Follow-up hook|World change"] [--outcome-hooks "Hook1|Hook2"] [--conditions "Prereq|Timer"] [--fail "Outcome|Consequence"] [--areas "default-area|training-grounds"] [--game demo]`.
- Автоматично генерира slug `quest_id` (ако не е подаден), проверява `scenario/quests/available.json` за дублирани ID/заглавия (поддържа масив или map), добавя новия запис и създава Markdown файл със секции `Summary / Story / Hooks / Encounters / Steps / Rewards / Notes / Outcome / Aftermath / Outcome Hooks / Conditions / Fail State (+ Linked Areas)`.
- Ако не подадеш стойности, скриптът попълва placeholder bullets: Hooks/Encounters/Outcome/Aftermath/Outcome Hooks/Notes с "-" списъци, Steps като номериран списък (>=2), Rewards с XP/Gold/Loot/Social шаблон. Така новият quest файл минава guardrails директно.
- `--areas` валидира съществуването на таргет area файлове и добавя `## Linked Areas`. Допълнителни automation-и:
  1. `--auto-area-notes` → бележка в area `## Notes` (`- Quest hook: [[quest-id]] — Title`).
  2. `--auto-area-hooks` → напомняне в quest Notes (`- [[area]]: Add encounter/POI hooks…`).
  3. `--auto-encounters` → генерира `"Encounter near [[area]]: ..."` entries.
  4. `--sync-area-notes` → копира area Notes в quest Hooks/Encounters.
  5. `--area-conditions` / `--area-threats` → копират area Conditions/Threats към quest Conditions/Fail State.
  6. `--auto-outcome-hooks` → извлича ноти/условия/заплахи от areas и прави `Outcome Hooks`.
  7. `--auto-rewards-breakdown` → гарантира XP/Gold/Loot/Social редове според стъпки, areas и `--reward-tier`.
  8. `--reward-tier easy|standard|epic` → мащабира XP/Gold сумите при автоматично генериране на Rewards.
  9. `--auto-area-backlinks` → добавя `[[quest-id]] quest tie-in` ред под `## Connections` във всяка свързана area, за да поддържа двупосочни линкове.
  10. `--unlock "<policy>"` и `--unlock-requires "quest-a|quest-b"` → директно попълват `unlock-triggers.json` с условие (`always`, `faction:trusted`, и т.н.) и списък dependencies (други quest id или token-и). Комбинираното значение е `[policy, ...requires]`, при липса на данни се използва `always`.
  11. `--exploration-hook` → гарантира, че всяка линкната area има запис в `player-data/runtime/exploration-log.json` с `quest:<id>` таг (създава/обновява лог-а автоматично, за да отговори на `EXPLORATION-QUEST-*` guardrails).

### Economy tooling
- Команда `npm run economy:report -- --game demo [--json out.json]` събира Rewards breakdown от всички куестове, агрегира XP/Gold общо/средно и показва Loot/Social броячите. При `--json` записва подробен отчет (пер-квест стойности + предупреждения за липсващи файлове) в JSON.

### Scenario overview helper
- `npm run scenario:index -- --game demo` регенерира `games/<game>/scenario/index.md`, генерирайки таблица с всички куестове (линкове, unlock conditions, кратки summary) и всички areas (линк + описание). Това гарантира, че `scenario/index.md` никога не пада под минималната дължина (`INDEX-SHORT`) и предоставя актуален roadmap за GM екипа.

### Area helper (CLI)
- Скрипт: `npm run area:add -- --id area-slug [--title "..."] [--description "..."] [--points "POI A|POI B"] [--connections "Link A|Link B"] [--notes "NPC: ...|Threat: ..."] [--conditions "Prereq|Timer"] [--threats "Escalation|Fail"] [--game demo]`.
- Генерира slug за файл `scenario/areas/<id>.md`, проверява дали не съществува и scaffold-ва секции `Description / Points of interest / Connections / Notes`.
- Ако не подадеш стойности → описанието получава 2-6 изречения placeholder; POI/Connections се попълват с примерни bullet-и, Notes съдържа NPC/Threat подсказки, а Conditions/Threats добавят изисквания/ескалации. Така новите area файлове покриват `AREA-POINTS-*`, `AREA-CONNECTIONS-*`, `AREA-NOTES-*`, `AREA-CONDITIONS-*`, `AREA-THREATS-*` guardrails по подразбиране.

### Release checklist (преди GM session / pre-release)
- 1) (По нужда) Добави/обнови area: `npm run area:add -- --id <area-id> --title "..." --description "..." --game <gameId>`
- 2) (По нужда) Добави quest scaffold: `npm run quest:add -- --title "..." --game <gameId>`
- 3) (По нужда) Добави exploration entry (само ако area файлът вече съществува): `npm run exploration:add -- --title "..." --type poi --area <area-id> --game <gameId>`
- 4) Пусни валидатор в строг режим: `npm run validate -- --path games/<gameId> --run-id <tag> --strict --summary`
- 5) (Препоръчително) Snapshot regression чек: `npm run validate -- --path games/<gameId> --run-id <tag> --json docs/analysis/reports/latest-run.json --append --snapshot docs/analysis/reports/latest-run.json --strict --summary`
 66- Run ID helper-и:
 67-  - PowerShell (заявете функция в `$PROFILE`):
 68-    ```powershell
69-    . "$PSScriptRoot/../scripts/run-id.ps1"
70-    function arpg-run-id {
71-      param([string]$Prefix = "dev", [switch]$Copy)
72-      New-AgentRPGRunId -Prefix $Prefix -Copy:$Copy
73-    }
74-    ```
75-    Изпълнение: `npm run validate -- --run-id (arpg-run-id -Prefix 'gm') ...`
76-  - Bash `~/.bashrc` или `~/.zshrc`:
77-    ```bash
78-    source ~/Projects/agentRPG-engine/tools/scripts/run-id.sh
79-    arpg_run_id() { run_id_generate "${1:-dev}"; }
80-    ```
81-    Изпълнение: `npm run validate -- --run-id "$(arpg_run_id gm)" ...`
- Комбиниран task (snapshot → telemetry → summary):
  - PowerShell: `npm run validate -- --path games/demo --json ".\\docs\\analysis\\reports\\latest-run.json" --log ".\\docs\\analysis\\reports\\telemetry-history.json" --run-id dev-001 --append --snapshot ".\\docs\\analysis\\reports\\snapshot-example.json" --strict --summary`
  - Bash: `npm run validate -- --path games/demo --json ./docs/analysis/reports/latest-run.json --log ./docs/analysis/reports/telemetry-history.json --run-id dev-001 --append --snapshot ./docs/analysis/reports/snapshot-example.json --strict --summary`
  - Bash/Zsh:
    ```bash
    arpg_validate() {
      game=${1:-demo}
      npm run validate -- --path "games/$game" --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary
    }
    ```
    game=${1:-demo}
    npm run validate -- --path "games/$game" --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary
  }
  ```

### Runtime CLI
- **Quick load check:** `npm run runtime -- --path games/<gameId>` зарежда manifest, session-init и state, и извежда кратка информация.
- **Debug mode:** `npm run runtime -- --path games/<gameId> --debug` извежда пълния JSON snapshot.
- **Error handling:** CLI връща non-zero exit code при липсващи файлове или невалидни JSON.

### Sprint Metrics Workflow
1. **Локално validate + telemetry:** стартирай `npm run validate:metrics -- --game <gameId> --run-id <tag>`, който ще изпълни валидатора и автоматично ще запише telemetry (`docs/analysis/reports/telemetry-history.json`) и регенерира `metrics-summary.md`.
   - *Note:* `validate:metrics` also accepts `--path games/<gameId>`; `--game` is the preferred interface.
2. **Custom history/output (по избор):** `npm run metrics:report -- --history docs/analysis/reports/telemetry-history.json --out docs/analysis/metrics-summary.md --limit 10`.
3. **Insights dashboard:** добави `--insights docs/analysis/metrics-insights.md`, за да генерираш документ с Summary / KPI Trends / Alerts / Recommended Actions. Емоджитата (✅/⚠️/❌) показват дали KPI пресищат прагoвете (runtime 200/230 ms, warnings 0.5/1, CAP ratio 5%/15%).
4. **Архив преди release или при ≥50 run-а:** `npm run archive:telemetry -- --label sprint01`.
5. **Definition of Done:** следи `docs/analysis/metrics-summary.md` и `metrics-insights.md` да показват ≥3 поредни clean run-а, avg duration <200 ms, snapshot `New codes = none`.

#### Metrics Insights Dashboard
- Файл: `docs/analysis/metrics-insights.md` (генерира се чрез `npm run metrics:report -- --insights docs/analysis/metrics-insights.md`).
- **Summary:** последният run, clean ratio, средни KPI с емоджи статус.
- **KPI Trends:** таблица с Avg runtime, Avg warnings/run, CAP alerts ratio, Clean run ratio, Latest warnings.
- **Alerts:** списък с активните прагови аларми; при липса остават ✅.
- **Recommended Actions:** автоматични подсказки за CAP проблеми, бавни run-ове или повторяеми кодове (`top codes` списъка).
- Използвай го като „оперативен dashboard“ между sprint retro и DoD проверки.

### TypeScript Tooling (EP-004)
- **Скриптове:** `npm run typecheck` (строг `tsc --noEmit`), `npm run build:ts` (`tsc -p tsconfig.build.json` → `dist/` с declaration/source maps), `npm run lint:ts` (ESLint + `@typescript-eslint`).
- **tsconfig структура:** `tsconfig.json` задава strict правила, Node16 module resolution, alias `@types/* → src/types/*`; `tsconfig.build.json` наследява и включва емитване на декларации.
- **Shared типове:** `src/types/` съдържа `CapabilitiesConfig`, `ScenarioContract`, `TelemetryEntry` и barrel `index.ts`. Може да се импортират чрез `import { TelemetryEntry } from '@types';`.
- **Миграция:** repo policy е TS-only за source code; JS tooling/скриптове се мигрират story-by-story. Новият TS код живее в `src/` и се компилира към `dist/` (build output, не се комитва). При добавяне на нови типове/контракти обновявай `src/types/` и описвай промяната в архитектурния документ.
- **Lint & формат:** `.eslintrc.json` е настроен за TS; Prettier служи като форматър (по избор `npx prettier --write src/**/*.ts`).

### Git hook (pre-push validate + metrics)
1. Скрипт: `scripts/pre-push-validate.sh` приема средата `ARPG_GAME`, `ARPG_RUN_ID`, `ARPG_LIMIT` (по избор) и изпълнява `npm run validate:metrics -- --game <game> --run-id <tag> --auto-archive 50`.
2. Инсталация:
   ```bash
   cp scripts/pre-push-validate.sh .git/hooks/pre-push
   chmod +x .git/hooks/pre-push
   ```
3. По желание за PowerShell: добави `.git/hooks/pre-push` файл, който извиква `pwsh -File scripts\\pre-push-validate.ps1` (ако добавиш еквивалентен PS скрипт). Това гарантира автоматично DoD валидиране преди `git push`.

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
- **Exploration log schema:** `player-data/runtime/exploration-log.json` минава през `EXPLORATION-SCHEМА` guardrail (slug `id`, тип от {`city`,`landmark`,`dungeon`,`mcp`,`side-quest-hook`,`poi`}, `added_at` ISO8601, `origin` = `player-request`/`gm-suggested`, описания ≥60 символа, `tags` 1–10 уникални записа). Липсващ/празен лог при включено exploration води до `FILE-MISSING-OPTIONAL` / `EXPLORATION-EMPTY`. Допълнителни проверки: `EXPLORATION-DESCRIPTION-SHORT`, `EXPLORATION-TAGS-MIN`, `EXPLORATION-DUPLICATE-*`, `EXPLORATION-AREA-MISSING`, както и `EXPLORATION-PREVIEW-MISMATCH` когато `state.json` съдържа preview ID-та без реални записи.
- **Unit & integration tests:** `tools/validator/tests/validator.test.js` покрива SCHEMA guardrails, YAML fallback, snapshot/ignore сценарий и изисква чист `scenario/index.md`.
- **Quest / area guardrails:** `available.json` засича `QUEST-ID-DUPLICATE`, заглавия под 5 символа (`QUEST-TITLE-SHORT`) и липсващи unlock политики (`UNLOCK-MISSING`). Unlock стойностите проверяват празни/дублирани условия (`UNLOCK-EMPTY`, `UNLOCK-DUPLICATE`, `UNLOCK-VALUE-TYPE`). Линковете към `[[areas]]` искат двупосочни връзки (`QUEST-AREA-BACKLINK`). Quest файловете задължително съдържат `Summary`, `Story`, `Hooks`, `Encounters`, `Steps`, `Rewards` и `Notes` секции (Steps ≥2 entries, Rewards/Hooks/Encounters/Notes ≥1). Area файловете следят за `Description` ≥60 символа, списъци в `Points of interest` и `Connections`, плюс `Notes` bullet list за NPC hooks/заплахи (`AREA-NOTES-*`). Guardrail-ите `AREA-LINK` и `AREA-QUEST-BACKLINK` гарантират, че връзките към quests са реални и двупосочни.
- **Telemetry отчети:** пусни `npm run metrics:report` (по избор с `--history <file> --out <file> --limit <N>`), за да регенерираш `docs/analysis/metrics-summary.md` от `docs/analysis/reports/telemetry-history.json`.
- **DoD reminder:** ≥3 последователни чисти run-а (`errors=0`, `warnings=0`, `CAP errors=0`, snapshot `New codes = none`, средно време <200 ms). Документ: `docs/analysis/build-focus-2025-12-sprint01.md`.

**Пример quest / area секции**

```markdown
# Quest Name
## Summary
Кратък pitch (≥30 символа).
## Story
По-дълъг narrative контекст.
## Hooks
- Списък с GM prompts / table entries.
## Encounters
- Списък с врагове или препятствия.
## Steps
1. Насочени стъпки (≥2).
## Rewards
- XP / loot / социални последици (≥1).
## Notes
- NPC hooks, тайни, специални условия.
```

```markdown
# Area Name
## Description
≥60 символа атмосфера.
## Points of interest
- Списък с POI (≥1).
## Connections
- Списък с линкове към други areas/quests (≥1).
## Notes
- NPC-та, plot hooks, опасности.
```

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
