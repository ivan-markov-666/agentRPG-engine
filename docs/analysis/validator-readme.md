# AgentRPG Validator CLI (draft)

## Purpose
Проверява файловите договори на игра върху AgentRPG Engine: задължителни файлове, CAP-* правила, orphans, quest ID↔title. Опционално генерира JSON репорт за telemetry.

## Използване
- Build-вариант: `npm run validate -- --path games/<gameId> --run-id <id> [--json out.json] [--append] [--debug] [--strict] [--summary] [--log telemetry.json] [--snapshot prev.json] [--ignore CODE1,CODE2] [--auto-archive 50]`. Скриптът автоматично стартира `npm run build:ts` преди да извика `node dist/cli/validate.js`.
- Dev-вариант (без предварителен build): `npm run validate:dev -- --path games/<gameId> --run-id <id> ...` (ts-node върху `src/cli/validate.ts` — полезно при промени по CLI-то).
- Без `--run-id` CLI прекратява изпълнение (`[ERROR][RUN-ID] Missing required --run-id <value>`). Използвай helper скриптовете `tools/scripts/run-id.(ps1|sh)` за генерация.
- `--append` (с `--json out.json`): апендва новия резултат в масив, ако файлът е масив; иначе overwrite.
- `--strict`: treat WARN като ERROR.
- `--summary`: показва само обобщение (удобно за CI или бърз lint pass).
- `--snapshot prev.json`: сравнява текущия run с предишен JSON (показва нови/решени кодове).
- `--ignore CODE1,CODE2`: временно скрива изброените кодове от отчета (само за локални експерименти).

### Примерни команди
- Базова проверка (build output): `npm run validate -- --path games/demo --run-id dev-local`
- Dev run без build: `npm run validate:dev -- --path games/demo --run-id dev-local`
- Запис в JSON + append: `npm run validate -- --path games/demo --run-id dev-local --json reports/last.json --append`
- Строг режим: `npm run validate -- --path games/demo --run-id dev-local --strict`
- Snapshot срещу предишен отчет: `npm run validate -- --path games/demo --run-id dev-local --json reports/last.json --append --snapshot reports/last.json`
- Telemetry + log: `npm run validate -- --path games/demo --run-id dev-001 --log docs/analysis/reports/telemetry-history.json`
- Debug (показва INFO): `npm run validate -- --path games/demo --debug`
- Snapshot пример (2 run-а, append):  
  1) `npm run validate -- --path games/demo --json reports/last.json --append`  
  2) оправяш данните, после: `npm run validate -- --path games/demo --json reports/last.json --append --snapshot reports/last.json`  
  Конзолата ще покаже `[INFO][SNAPSHOT] New codes: ... | Resolved: ...`
- Локален “pre-release” чек (без CI): `npm run validate -- --path games/demo --json reports/last.json --append --snapshot reports/last.json --strict --summary`

### State schema контрол
- `player-data/runtime/state.json` се валидира срещу [`tools/validator/schemas/state.schema.json`]. Schema-та описва очакваните полета (`stats`, `flags`, `inventories`, `exploration_*`) и налага неотрицателни стойности, валидни `status_effects` stack-ове и структури за инвентари.
- Нарушенията се маркират като `STATE-SCHEMA` предупреждения/грешки. Примери:
  - `[/current_day] must be >= 0`
  - `[/inventories/0/items/0/qty] must be >= 0`
  - `[/stats/status_effects/poison/stack] must be >= 0`
- Добави нови ключове чрез `genericStat` секцията на schema файла или разшири `definitions`, за да избегнеш `STATE-SCHEMA` нарушения.

### Quest & Scenario contract контрол (ST-007)
- `scenario/quests/available.json` се сверява срещу `scenario/index.md` и `scenario/quests/unlock-triggers.json`, за да няма orphan-и или несъответствия:
  - `INDEX-QUEST-MISSING` — quest в available.json липсва от таблицата в index.md → пусни `npm run scenario:index` или добави реда ръчно.
  - `INDEX-QUEST-UNKNOWN` — index съдържа quest, който липсва в available.json → изтрий реда или върни quest-а.
  - `QUEST-ORPHAN` — quest файл липсва → създай markdown файла или премахни записа.
  - `UNLOCK-UNKNOWN`, `UNLOCK-DEPENDENCY-UNKNOWN`, `UNLOCK-FORMAT`, `UNLOCK-DUPLICATE` — виж `scenario/quests/unlock-triggers.json`.
- Quest markdown файловете се проверяват за broken `[[links]]`, липсващи секции и reward формати (`QUEST-LINK`, `QUEST-AREA-BACKLINK`, `QUEST-REWARDS-*`, и др.).

### Exploration logging контрол (ST-008)
- Активирай exploration режима чрез `player-data/runtime/state.json` (`"exploration_enabled": true` или `state.exploration.enabled = true`). При активен режим:
  - Липсващ лог → `EXPLORATION-LOG-MISSING` (ERROR). Създай `player-data/runtime/exploration-log.json` и започни с `[]`.
  - Schema нарушения → `EXPLORATION-SCHEMA` (ERROR). JSON Schema изисква `id`, `title`, `type (area|quest|event)`, `added_at` (ISO), `origin`, ≥60 символа `description`, 1–10 уникални тагове и условно `area_id` (за `area`) или `quest_id` (за `quest`).
- Независимо от режима, се изпълняват и допълнителните guardrails от `checkRequiredFiles`: `EXPLORATION-DESCRIPTION-SHORT`, `EXPLORATION-TAGS-MIN`, `EXPLORATION-DUPLICATE-ID/TITLE`, `EXPLORATION-AREA-MISSING`, `EXPLORATION-PREVIEW-MISMATCH`.
- `npm run exploration:add ...` помага за scaffold на валидни записи (виж README секцията „Exploration log helper“).

### Бързи alias-и (по избор)
- PowerShell (добави в `$PROFILE`):
  ```powershell
  function arpg-validate {
    param([string]$game = "demo")
    npm run validate -- --path "games/$game" --json reports/last.json --append --snapshot reports/last.json --strict --summary
  }
  ```
  Изпълнение: `arpg-validate demo`
- Bash/Zsh:
  ```bash
  arpg_validate() {
    game=${1:-demo}
    npm run validate -- --path "games/$game" --json reports/last.json --append --snapshot reports/last.json --strict --summary
  }
  ```
  Изпълнение: `arpg_validate demo`

## Изход
- Конзола: `[LEVEL][CODE] file:message (suggested fix)`
- Exit code: 1 ако:
  - има поне един `ERROR` (или предупреждение, което е ескалирано чрез `--strict`);
  - guardrail операции (`--snapshot`, `--log`) се провалят (валидаторът отпечатва `[ERROR][SNAPSHOT]...`/`[ERROR][LOG]...`).
- `--auto-archive <N>` (по избор): след успешен telemetry лог автоматично извиква архивиращия скрипт, ако историята има ≥N записи. При skip отпечатва `[AUTO-ARCHIVE][SKIP]`, при успех `[AUTO-ARCHIVE] Archived ...` и рестартира history файла.
- Exit code: 0 само когато няма ERRORS и guardrail side-effects са успешни.
- JSON (ако `--json out.json`): `{ errors, warnings, cap_errors, issues: [...] }`
- Telemetry лог (изисква `--run-id` + `--log`): `{ runId, run_id, timestamp, duration_ms, errors, warnings, issues }`

### Troubleshooting (guards)
- `[ERROR][SNAPSHOT] ENOENT ...` — провери, че файлът, подаден към `--snapshot`, съществува (или махни флага). Провалът е блокиращ → CLI връща 1.
- `[ERROR][SNAPSHOT] Unexpected token ...` — JSON е повреден; отвори файла и поправи синтаксиса или изтрий последния run, след което пусни валидатора отново.
- `[ERROR][LOG] EISDIR ...` — `--log` сочи към директория/невалиден път. Задай валиден `.json` файл (примерно `docs/analysis/reports/telemetry-history.json`).
- `[ERROR][LOG] EACCES ...` — липсват права за писане. Смени локацията или дай write permission преди повторен run.

### Архивиране чрез скрипт
- Съществува helper `npm run validation -- ... --log telemetry-history.json --auto-archive 50` (опционално) → автоматично тригърва архивиране, когато telemetry историята стигне ≥50 записа.
- `npm run archive:telemetry -- --label sprint01` (при нужда) → прехвърля историята в `docs/analysis/reports/archive/`.
- `npm run publish:telemetry -- --dest docs/analysis/reports/central-upload --history --all` → подготвя bundle за централен storage.
- `npm run sync:telemetry -- --dest s3://bucket/path` (или локална папка) → качва `central-upload` съдържание (dry-run опция налична).
    - `--history`: път до текущия telemetry файл (default `docs/analysis/reports/telemetry-history.json`).
    - `--archive`: директория за архиви (default `docs/analysis/reports/archive`).
    - `--min`: минимален брой записи преди архив (default 50).
    - `--dry-run`: показва какво би се случило без да променя файловете.
  - Скриптът:
    1. Проверява дали history файлът съществува и има съдържание (не празен масив).
    2. Създава `docs/analysis/reports/archive/<timestamp>-<label>.json`.
    3. Нулира history файла до `[]`.
- Използвай го след release или когато telemetry логът достигне лимита от retention политиката.
- За автоматизация (без npm): ползвай shell/Pwsh wrapper-ите:
  - PowerShell: `tools/scripts/archive-telemetry.ps1 --Label nightly --History docs/analysis/reports/telemetry-history.json`
  - Bash: `tools/scripts/archive-telemetry.sh --label nightly --history docs/analysis/reports/telemetry-history.json`

### Периодично архивиране (локално)
- **PowerShell task (Windows)**:
  ```powershell
  $script = "d:\Projects\agentRPG-engine\tools\archive-telemetry.ps1"
  Set-Content $script @'
  cd d:\Projects\agentRPG-engine
  npm run archive:telemetry -- --label scheduled
  '@
  schtasks /Create /SC DAILY /ST 23:00 /TN "AgentRPG Telemetry Archive" /TR "powershell -ExecutionPolicy Bypass -File `"$script`""
  ```
- **Cron job (Linux/macOS)**:
  ```bash
  # m h dom mon dow command
  0 23 * * * cd /path/to/agentRPG-engine && npm run archive:telemetry -- --label cron
  ```
- Цел: дори без CI, локалните run-ове се архивират веднъж дневно (или според нуждата), за да не трупаме огромни telemetry-history файлове.
- **Възстановяване на telemetry history**:
  1. Избери архивния файл от `docs/analysis/reports/archive/<timestamp>-<label>.json`.
  2. Копирай го обратно в `docs/analysis/reports/telemetry-history.json` (или нов файл) и продължи append-ването.
  3. При нужда пускай `npm run metrics:report -- --history <архив>` за ретроспективен анализ.
- **Централен storage / dashboard export**:
  - Скрипт: `npm run publish:telemetry -- --dest docs/analysis/reports/central-upload --history --all`
    - `--dest`: директория, която после синхронизираш с S3/Share/Analytics pipeline.
    - `--all` (по избор): копира всички архивни JSON-и; иначе само най-новия.
    - `--history`: добавя текущия `telemetry-history.json` към пакета.
    - `--dry-run`: показва кои файлове ще се копират без да прави промени.
  - Използвай след `archive:telemetry`, за да публикуваш данните към централен сторидж или да качиш артефакт в CI (пример: `actions/upload-artifact`).

## Проверки (v0)
- Задължителни файлове: manifest/entry, scenario/index, quests/available, quests/unlock-triggers, state, completed-quests, capabilities (exporation-log само ако exploration е включен в state).
- CAP-* : дублиране, липсваща runtime стойност, min>max.
- Orphans: active quest без файл; current_area_id без area файл.
- Quest ID↔title: duplicate titles, липсващи quest файлове спрямо available.json.
- Quest content: WARN ако файлът е празен/твърде кратък или без хедър.
- Exploration log: WARN ако enabled, но log липсва/не е масив/е празен масив.
- Schema: WARN ако нарушава JSON Schema (capabilities/state/exploration log) или липсва ajv (`CAP-SCHEMA`, `STATE-SCHEMA`, `EXPLORATION-SCHEMA`).
- Допълнителни проверки:
  - CAP-RUNTIME-RANGE: runtime стойности извън min/max или range; CAP-DISABLED-RUNTIME: стойност за disabled capability.
  - CAP-DISABLED-RANGE: capability е disabled, но има range/min/max; CAP-UNKNOWN-RUNTIME: runtime stats съдържа ключове, които не са в capabilities.
  - QUEST-ID-FORMAT: quest_id не е slug (a-z0-9-); QUEST-ID-DUPLICATE: два записа споделят един и същи quest_id.
  - QUEST-LINK: [[link]] не сочи към съществуващ quest/area; QUEST-LINK-SELF: линк към самия quest; QUEST-AREA-BACKLINK: quest сочи към area, която не връща [[quest_id]].
  - UNLOCK-UNKNOWN: unlock-triggers сочи към липсващ quest; UNLOCK-FORMAT: стойността не е string/array; UNLOCK-MISSING: quest от available.json няма unlock политика; UNLOCK-EMPTY/UNLOCK-DUPLICATE/UNLOCK-VALUE-TYPE: празни/дублирани или не-string условия.
  - QUEST-CONTENT: липсва Summary/Steps/Rewards секция; QUEST-TITLE-SHORT ако заглавието е под 5 символа; QUEST-EMPTY-LIST ако available.json е празен.
  - INDEX-EMPTY/INDEX-SHORT: scenario/index.md празен или прекалено кратък; MANIFEST-FIELD: липсва id/title/version.
  - AREA-* guardrails: AREA-DESCRIPTION / AREA-POINTS / AREA-CONNECTIONS за липсващи секции, AREA-POINTS-FORMAT / AREA-CONNECTIONS-FORMAT за списъци, AREA-LINK за неизвестни цели, AREA-QUEST-BACKLINK когато area сочи към quest без [[area_id]] референция, AREA-LINK-SELF за само-линкове.
  - EXPLORATION-* guardrails: EXPLORATION-DESCRIPTION-SHORT (описание <60 знака), EXPLORATION-TAGS-MIN (липсват tags), EXPLORATION-DUPLICATE-ID/TITLE, EXPLORATION-AREA-MISSING (несъществуваща area), EXPLORATION-PREVIEW-MISMATCH (preview IDs без реални записи).

## Release checklist (локално, преди GM session)
1) `npm run validate -- --path games/<gameId> --strict --summary`
2) Ако добавяш нови неща:
   - area: `npm run area:add -- --id <area-id> --title "..." --description "..." --game <gameId>`
   - quest: `npm run quest:add -- --title "..." --game <gameId>`
   - exploration entry: `npm run exploration:add -- --title "..." --type poi --area <area-id> --game <gameId>`
3) Snapshot regression (по избор): `npm run validate -- --path games/<gameId> --json docs/analysis/reports/latest-run.json --append --snapshot docs/analysis/reports/latest-run.json --strict --summary --auto-archive 50`

## CI / clean-run checklist
1. **Install deps**: `npm install` (или pnpm/yarn еквивалент).
2. **Smoke run** (warnings allowed): `npm run validate -- --path games/<gameId> --summary`.
3. **DoD run** (изисква telemetry + snapshot):
   ```bash
   npm run validate -- \
     --path games/<gameId> \
     --json docs/analysis/reports/latest-run.json \
     --append \
     --snapshot docs/analysis/reports/latest-run.json \
     --strict \
     --summary \
     --run-id "$(whoami)-$(date +%Y%m%d-%H%M%S)" \
     --log docs/analysis/reports/telemetry-history.json
   ```
   - Очакван изход: `Summary: 0 error(s), 0 warning(s)` и `[INFO][SNAPSHOT] New codes: none`.
4. **CI gating & архив**:
   - Fail the pipeline ако exit code != 0 (CAP errors, WARN при strict, snapshot/log guardrail fail).
   - След clean run (0 errors/0 warnings) стартирай `npm run archive:telemetry -- --label <build-id>` за да нулираш локалния history и качи архивния файл като artifact.
   - Архивирай `docs/analysis/reports/latest-run.json` / `telemetry-history.json` като build artifacts (или snapshot JSON + archive резултата).
   - Примерен GitHub Actions job:
     ```yaml
     jobs:
       validator:
         runs-on: ubuntu-latest
         steps:
           - uses: actions/checkout@v4
           - uses: actions/setup-node@v4
             with:
               node-version: 20
           - run: npm ci
           - run: npm run validate -- --path games/demo --json docs/analysis/reports/latest-run.json --append --snapshot docs/analysis/reports/latest-run.json --strict --summary --run-id "${{ github.run_id }}" --log docs/analysis/reports/telemetry-history.json
           - run: npm run archive:telemetry -- --label github-${{ github.run_number }}
           - run: npm run publish:telemetry -- --dest docs/analysis/reports/central-upload --history --all
           - uses: actions/upload-artifact@v4
             with:
               name: validator-artifacts
               path: |
                 docs/analysis/reports/latest-run.json
                 docs/analysis/reports/archive/*.json
                 docs/analysis/reports/central-upload
     ```
5. **Before merge**: прегледай telemetry файла за последния run_id и запази clean state в репото (опция: комитни отчетите или ги качи като CI артефакти).

## Ограничения / TODO
- YAML поддръжка: налична ако е инсталиран `yaml` пакет; иначе WARN.
- Не валидира схемите (JSON Schema) — това е отделен етап.
- Телеметрия: `--run-id` + `--log` записва JSON (timestamp, duration, errors/warns, issues).

## Примерен изход (конзола)
```
[ERROR][FILE-MISSING] manifest/entry.json: Missing required file (Create file or fix path)
[WARN][CAP-RUNTIME] player-data/runtime/state.json: Missing runtime values: mana (Add to stats or disable in capabilities.json)
Summary: 1 error(s), 1 warning(s)
```

## Примерен JSON (report)
```json
{
  "errors": 1,
  "warnings": 2,
  "cap_errors": 1,
  "top_codes": [
    { "code": "FILE-MISSING", "count": 1 },
    { "code": "CAP-RUNTIME", "count": 1 },
    { "code": "INDEX-SHORT", "count": 1 }
  ],
  "issues": [
    {
      "level": "ERROR",
      "code": "FILE-MISSING",
      "file": "manifest/entry.json",
      "message": "Missing required file",
      "fix": "Create file or fix path"
    },
    {
      "level": "WARN",
      "code": "CAP-RUNTIME",
      "file": "player-data/runtime/state.json",
      "message": "Missing runtime values: mana",
      "fix": "Add to stats or disable in capabilities.json"
    }
  ]
}
```

## Примерен telemetry log (append)
```json
[
  {
    "run_id": "dev-001",
    "timestamp": "2025-12-22T09:00:00.000Z",
    "duration_ms": 120,
    "errors": 1,
    "warnings": 2,
    "issues": []
  },
  {
    "run_id": "dev-002",
    "timestamp": "2025-12-22T09:05:00.000Z",
    "duration_ms": 90,
    "errors": 0,
    "warnings": 1,
    "issues": []
  }
]
```

## Snapshot пример (JSON)
```json
[
  {
    "errors": 1,
    "warnings": 1,
    "issues": [
      { "level": "ERROR", "code": "FILE-MISSING", "file": "manifest/entry.json", "message": "Missing required file" },
      { "level": "WARN", "code": "CAP-RUNTIME", "file": "player-data/runtime/state.json", "message": "Missing runtime values: mana" }
    ]
  },
  {
    "errors": 0,
    "warnings": 0,
    "issues": []
  }
]
```
Конзола при втория run: `[INFO][SNAPSHOT] New codes: none | Resolved: FILE-MISSING, CAP-RUNTIME`

## Примерен snapshot diff (конзола)
```
[INFO][SNAPSHOT] Comparing current run with reports/last.json
[INFO][SNAPSHOT] New codes: QUEST-CONTENT (1), QUEST-LINK (1)
[INFO][SNAPSHOT] Resolved: FILE-MISSING (1), CAP-RUNTIME (1)
[INFO][SNAPSHOT] Regression score: +2 new / -2 resolved
Summary: 1 error(s), 1 warning(s) | Top: QUEST-CONTENT:1, QUEST-LINK:1
```
Интерпретация: появили са се нови QUEST проблеми; старите FILE/CAP са решени. Продължи с фиксове докато New codes = none и errors=0.

## Примерен telemetry log (JSON ред)
```json
{
  "run_id": "release-001",
  "timestamp": "2025-12-22T11:20:00.000Z",
  "duration_ms": 142,
  "errors": 0,
  "warnings": 1,
  "top_codes": [
    { "code": "QUEST-CONTENT", "count": 1 }
  ],
  "issues": [
    {
      "level": "WARN",
      "code": "QUEST-CONTENT",
      "file": "scenario/quests/main-quest.md",
      "message": "Missing \"Rewards\" section",
      "fix": "Add ## Rewards with XP/loot"
    }
  ]
}
```
Интерпретация: runът е минал без грешки, но с 1 предупреждение. Ако държиш strict release, оправи QUEST-CONTENT и пусни пак — телеметрията ще има втори ред с errors=warnings=0.
📁 Пълен пример (append история): `docs/analysis/reports/telemetry-example.json`

## Telemetry retention и анализ
- **Локация**: по подразбиране записваме в `docs/analysis/reports/telemetry-history.json`. Ползвай `--log docs/analysis/reports/telemetry-history.json --append`, за да пазиш история.
- **Retention политика**:
  1. Пази максимум ~50 run-а или ~2 седмици локално (според екипа).
  2. Когато лимитът бъде надхвърлен, архивирай:
     ```bash
     stamp=$(date +%Y-%m-%d)
     mkdir -p docs/analysis/reports/archive
     mv docs/analysis/reports/telemetry-history.json "docs/analysis/reports/archive/${stamp}-telemetry.json"
     printf "[]\n" > docs/analysis/reports/telemetry-history.json
     ```
  3. Опция: качи архивния файл като CI artifact или в централен storage.
- **run_id naming**: `persona-iteration` (напр. `dev-01`, `gm-release-3`) или `<branch>-<timestamp>`. Помага при групиране по човек/фаза/feature.
- **Метрики за проследяване**:
  - `avg retries to clean run`: колко run-а с ERROR/WARN има преди `errors=warnings=0`.
  - `mean time to green`: разлика между timestamp на първия run с грешки и последния clean run.
  - `% CAP errors`: `cap_errors / errors`.
- **Бърз анализ**:
  - Конзола: `npm run validate -- --path games/demo --summary --snapshot docs/analysis/reports/snapshot-example.json`.
  - JSON: `jq '[.[].errors]' docs/analysis/reports/telemetry-example.json` за тренд.
  - Snapshot: проверявай, че `New codes: none` преди release.
- **DoD**: release не минава, докато telemetry файлът няма последен запис с `errors=0`, `warnings=0` (или WARN допустими според екипа).

## Метрики и KPI отчети
- Скрипт: `npm run metrics:report` (wrapper около `tools/metrics/report.js`).
- Вход: `docs/analysis/reports/telemetry-history.json` (по подразбиране). Промени с `--history <path>`.
- Изход: `docs/analysis/metrics-summary.md` (markdown таблици + KPI). Промени с `--output <path>` / `--out`.
- Архив: преди overwrite се създава копие в `docs/analysis/reports/archive/metrics-summary-<timestamp>-<label>.md`. Можеш да подадеш:
  - `--archive-dir <dir>` — алтернативна директория за архиви.
  - `--archive-label release-123` — суфикс към името (алфанумеричен, авто-саниран).
- Dry run: `npm run metrics:report -- --dry-run` калкулира KPI и логва действията, без да пише summary/insights/архив.
- Insights: добави `--insights docs/analysis/metrics-insights.md`, за да генерираш втори markdown с KPI статуси и препоръки; honor-ва `--dry-run`.
- Допълнителни флагове:
  - `--limit 20` — анализира само последните N run-а.
  - `--output` е еквивалент на `--out`.
  - `--history`, `--insights`, `--archive-dir`, `--archive-label` приемат относителни или абсолютни пътища.
- Пример:
  ```bash
  npm run metrics:report -- \
    --history docs/analysis/reports/telemetry-history.json \
    --output docs/analysis/metrics-summary.md \
    --archive-label sprint01 \
    --insights docs/analysis/metrics-insights.md
  ```
- Тестове: `node tools/tests/metrics-report.test.js` валидират архивирането и dry-run режима (част от `npm test`).

### Архивиране на telemetry
1. Създай папка `docs/analysis/reports/archive/` (еднократно).
2. PowerShell:  
   ```powershell
   $stamp = Get-Date -Format 'yyyy-MM-dd'
   $archive = "docs/analysis/reports/archive/$stamp-telemetry.json"
   Move-Item docs/analysis/reports/telemetry-history.json $archive
   Out-File docs/analysis/reports/telemetry-history.json -Encoding utf8 -InputObject "[]"
   ```
3. Bash:  
   ```bash
   stamp=$(date +%Y-%m-%d)
   archive="docs/analysis/reports/archive/${stamp}-telemetry.json"
   mv docs/analysis/reports/telemetry-history.json "$archive"
   printf "[]\n" > docs/analysis/reports/telemetry-history.json
   ```
4. (Опция) качи архивите в artifact storage или Git LFS.

### Автоматично генериране на run_id
- PowerShell helper:
  ```powershell
  function new-run-id {
    param([string]$persona = "dev")
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    return "$persona-$stamp"
  }
  ```
  Използване: `npm run validate -- --run-id (new-run-id -persona 'gm') ...`
- Bash helper:
  ```bash
  run_id() {
    persona=${1:-dev}
    printf "%s-%s\n" "$persona" "$(date +%Y%m%d-%H%M%S)"
  }
  ```
  Използване: `npm run validate -- --run-id "$(run_id gm)" ...`
- За branch-базирани ID добави `git rev-parse --abbrev-ref HEAD`:
  ```powershell
  function run-id-branch {
    $branch = (git rev-parse --abbrev-ref HEAD)
    "$($branch)-$(Get-Date -Format 'HHmmss')"
  }
  ```

## Screenshots (описание)
- Конзола (summary-only): редове като  
  `Summary: 0 error(s), 1 warning(s) | Top: CAP-RUNTIME:1`  
  `CAP errors: 0`
- JSON report (в редактор): ключове `errors`, `warnings`, `top_codes`, `issues`.
- Telemetry лог (append масив): няколко обекта с `run_id`, `timestamp`, `errors`, `warnings`.

## Как да четем отчетите (локално)
- `Summary: X error(s), Y warning(s) | Top: CODE1:cnt, CODE2:cnt`: ако има errors>0 → поправи и пусни пак; top_codes помагат да видиш най-честите проблеми.
- `CAP errors: N`: ако N>0, поправи capabilities/state (blocking).
- JSON report: `top_codes` е масив `{code,count}` по честота; `issues` съдържа файлове и suggested fix.
- Telemetry log (append): масив от run-ове; виж `errors/warnings`, `duration_ms`, `run_id` за ретроспекция.
- Snapshot: `[INFO][SNAPSHOT] New codes: ... | Resolved: ...` — ако новите са празни и errors=0 → готов си.
- `--summary` скрива детайлните редове и оставя само summary (удобно за бърз чек).
- `--ignore CODE1,CODE2` временно скрива изброените кодове (не ползвай в release).

### Top codes → следващи стъпки
| Категория | Примерни кодове | Какво да направиш |
|-----------|-----------------|-------------------|
| **CAP** | CAP-RUNTIME, CAP-RUNTIME-RANGE, CAP-UNKNOWN-RUNTIME, CAP-DISABLED-RANGE | Прегледай `config/capabilities.json` и `player-data/runtime/state.json`; добави липсващи стойности, коригирай диапазоните или премахни непознати ключове. |
| **FILE / INDEX** | FILE-MISSING, INDEX-EMPTY, MANIFEST-FIELD | Създай липсващите файлове (`manifest/entry.json`, `scenario/index.md`), попълни id/title/version, добави съдържание в index. |
| **QUEST** | QUEST-EMPTY-LIST, QUEST-CONTENT, QUEST-LINK, QUEST-LINK-SELF, UNLOCK-UNKNOWN | Провери `scenario/quests/*`; добави Summary/Steps/Rewards, оправи [[links]] към реални quest/area ID, синхронизирай `available.json` и `unlock-triggers.json`. |
| **EXPLORATION / STATE** | EXPLORATION-EMPTY, INDEX-SHORT | Ако `exploration_enabled=true`, попълни `player-data/runtime/exploration-log.json`; добави повече контекст в `scenario/index.md`. |
| **SCHEMA / YAML** | SCHEMA-ERROR, YAML-PARSE | Увери се, че JSON отговаря на схемата; при YAML инсталирай `yaml` пакета и валидирай структурата. |

## Exploration log пример (валиден запис)
```json
{
  "id": "mistwood-spire",
  "title": "Mistwood Spire lookout",
  "type": "landmark",
  "area_id": "mistwood",
  "description": "Crystal tower that pierces the fog above Mistwood; scouts use it to watch the northern frontier.",
  "added_at": "2025-12-22T18:55:00Z",
  "tags": ["scouting", "fog"],
  "origin": "gm-suggested"
}
```
Guardrails: slug `id`, тип от {`city`,`landmark`,`dungeon`,`mcp`,`side-quest-hook`,`poi`}, описания ≥40 символа, ISO8601 `added_at`, максимум 10 уникални `tags`, `origin` = `player-request`/`gm-suggested`.

## Definition of Done (локален чеклист)
- `npm run validate -- --path games/<id> --json reports/last.json --append --snapshot reports/last.json --strict --summary` връща `Summary: 0 error(s), 0 warning(s)`.
- Няма CAP errors (CAP errors: 0).
- Quest файлове имат Summary/Steps/Rewards; няма QUEST-LINK към несъществуващи цели.
- manifest/entry.json има id/title/version; scenario/index.md не е празен/къс.
- Ако exploration_enabled=true → exploration-log.json съществува и не е празен масив след игра.
- Telemetry log записан (ако ползваш `--run-id ... --log telemetry.json`) и snapshot показва, че предишните кодове са Resolved.

### Примерни съобщения (по код)
- CAP-UNKNOWN-RUNTIME: `[WARN][CAP-UNKNOWN-RUNTIME] player-data/runtime/state.json: Runtime has unknown capabilities: stamina_extra (Remove or add to capabilities.json)`
- CAP-DISABLED-RANGE: `[WARN][CAP-DISABLED-RANGE] config/capabilities.json: 'luck' is disabled but has min/max/range (Remove ranges or enable capability)`
- QUEST-LINK: `[WARN][QUEST-LINK] scenario/quests/main-quest.md: Link [[unknown-area]] not found as quest or area (Create file or adjust link target)`
- QUEST-LINK-SELF: `[WARN][QUEST-LINK-SELF] scenario/quests/main-quest.md: Quest links to itself (Remove or change link target)`
- UNLOCK-UNKNOWN: `[ERROR][UNLOCK-UNKNOWN] scenario/quests/unlock-triggers.json: Unlock references missing quest 'side-02' (Add quest to available.json or remove trigger)`
- UNLOCK-FORMAT: `[WARN][UNLOCK-FORMAT] scenario/quests/unlock-triggers.json: Unlock value for 'main-quest-01' should be string or array (Use string condition or array of conditions)`
- INDEX-EMPTY: `[WARN][INDEX-EMPTY] scenario/index.md: Scenario index is empty (Add intro/summary)`
- MANIFEST-FIELD: `[WARN][MANIFEST-FIELD] manifest/entry.json: Missing 'title' (Add required manifest fields)`
- CAP-RUNTIME-RANGE: `[ERROR][CAP-RUNTIME-RANGE] player-data/runtime/state.json: Runtime values out of range: mana (120 > max 100) (Adjust stats or capability ranges)`
- CAP-DISABLED-RUNTIME: `[WARN][CAP-DISABLED-RUNTIME] player-data/runtime/state.json: Runtime has values for disabled capabilities: stealth (Remove from stats or enable capability)`
- QUEST-EMPTY-LIST: `[WARN][QUEST-EMPTY-LIST] scenario/quests/available.json: No quests listed in available.json (Add at least one quest entry)`
- QUEST-CONTENT: `[WARN][QUEST-CONTENT] scenario/quests/main-quest.md: Missing "Rewards" section (Add "## Rewards" with XP/loot)`
- EXPLORATION-EMPTY: `[WARN][EXPLORATION-EMPTY] player-data/runtime/exploration-log.json: Exploration enabled but log is empty (Add entries when exploration occurs or disable exploration)`

### Чести грешки и фиксове
- FILE-MISSING: Файл липсва → създай празен или поправи пътя.
- CAP-RUNTIME: Enabled capability без runtime стойност → добави в state.stats или disable.
- CAP-RUNTIME-RANGE: Стойност извън min/max или range → коригирай стойност или диапазон.
- QUEST-ORPHAN / UNLOCK-UNKNOWN: Quest липсва, но е рефериран → създай файла или махни референцията.
- QUEST-CONTENT: Липсва Summary/Steps/Rewards → добави секции в markdown.
- EXPLORATION-EMPTY: Exploration е включен, но log е празен → добави entries или изключи exploration.
- CAP-UNKNOWN-RUNTIME: runtime.stats съдържа ключове, които не са в capabilities → премахни или добави capability.
- CAP-DISABLED-RANGE: capability е disabled, но има range/min/max → премахни диапазон или enable.
- QUEST-LINK / QUEST-LINK-SELF: линкът не съществува или сочи към себе си → поправи целта или премахни линка.
- UNLOCK-FORMAT: unlock-triggers стойност не е string/array → поправи на string или масив от условия.
- INDEX-EMPTY/SHORT: scenario/index.md е твърде кратък → добави overview и стартов hook.
- MANIFEST-FIELD: липсва id/title/version → добави ги в manifest/entry.json.

## Инсталиране на YAML (по избор)
- `npm install yaml` (или `pnpm add yaml`) ако искаш да парсваш .yml/.yaml файлове.
