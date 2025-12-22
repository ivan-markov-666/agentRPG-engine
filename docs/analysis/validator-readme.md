# AgentRPG Validator CLI (draft)

## Purpose
Проверява файловите договори на игра върху AgentRPG Engine: задължителни файлове, CAP-* правила, orphans, quest ID↔title. Опционално генерира JSON репорт за telemetry.

## Използване
- `node tools/validator/index.js --path games/<gameId> [--json out.json] [--debug] [--run-id <id>] [--log telemetry.json]`
- npm script (package.json): `npm run validate -- --path games/<gameId> [--json out.json] [--debug] [--run-id <id>] [--log telemetry.json] [--strict] [--snapshot prev.json]`
- Ако няма `--run-id`, логът ползва auto-id (timestamp) и append-ва, ако файлът вече е масив.
- `--append` (с `--json out.json`): апендва новия резултат в масив, ако файлът е масив; иначе overwrite.
- `--strict`: treat WARN като ERROR.
- `--snapshot prev.json`: сравнява текущия run с предишен JSON (показва нови/решени кодове).

### Примерни команди
- Базова проверка: `npm run validate -- --path games/demo`
- Запис в JSON + append: `npm run validate -- --path games/demo --json reports/last.json --append`
- Строг режим: `npm run validate -- --path games/demo --strict`
- Snapshot срещу предишен отчет: `npm run validate -- --path games/demo --json reports/last.json --append --snapshot reports/last.json`
- Telemetry с run-id: `npm run validate -- --path games/demo --run-id dev-001 --log telemetry.json`
- Debug (показва INFO): `npm run validate -- --path games/demo --debug`
- Snapshot пример (2 run-а, append):  
  1) `npm run validate -- --path games/demo --json reports/last.json --append`  
  2) оправяш данните, после: `npm run validate -- --path games/demo --json reports/last.json --append --snapshot reports/last.json`  
  Конзолата ще покаже `[INFO][SNAPSHOT] New codes: ... | Resolved: ...`
- Локален “pre-release” чек (без CI): `npm run validate -- --path games/demo --json reports/last.json --append --snapshot reports/last.json --strict --summary`

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
- Exit code: 0 ако няма ERROR; 1 при ERROR
- JSON (ако `--json out.json`): `{ errors, warnings, cap_errors, issues: [...] }`
- Telemetry лог (ако `--run-id` и `--log`): `{ run_id, timestamp, duration_ms, errors, warnings, issues }`

## Проверки (v0)
- Задължителни файлове: manifest/entry, scenario/index, quests/available, quests/unlock-triggers, state, completed-quests, capabilities (exporation-log само ако exploration е включен в state).
- CAP-* : дублиране, липсваща runtime стойност, min>max.
- Orphans: active quest без файл; current_area_id без area файл.
- Quest ID↔title: duplicate titles, липсващи quest файлове спрямо available.json.
- Quest content: WARN ако файлът е празен/твърде кратък или без хедър.
- Exploration log: WARN ако enabled, но log липсва/не е масив/е празен масив.
- Schema: WARN ако нарушава JSON Schema (capabilities/state) или липсва ajv.
- Допълнителни проверки:
  - CAP-RUNTIME-RANGE: runtime стойности извън min/max или range; CAP-DISABLED-RUNTIME: стойност за disabled capability.
  - CAP-DISABLED-RANGE: capability е disabled, но има range/min/max; CAP-UNKNOWN-RUNTIME: runtime stats съдържа ключове, които не са в capabilities.
  - QUEST-ID-FORMAT: quest_id не е slug (a-z0-9-).
  - QUEST-LINK: [[link]] не сочи към съществуващ quest/area; QUEST-LINK-SELF: линк към самия quest.
  - UNLOCK-UNKNOWN: unlock-triggers сочи към липсващ quest; UNLOCK-FORMAT: стойността не е string/array.
  - QUEST-CONTENT: липсва Summary/Steps/Rewards секция; QUEST-EMPTY-LIST ако available.json е празен.
  - INDEX-EMPTY/INDEX-SHORT: scenario/index.md празен или прекалено кратък; MANIFEST-FIELD: липсва id/title/version.

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
- **Retention**: запази последните ~50 run-а (или 14 дни). При нужда архивирай старите в `reports/archive/YYYY-MM-DD-telemetry.json`.
- **run_id naming**: `persona-iteration` (напр. `dev-01`, `gm-release-3`). Помага при групиране по човек/фаза.
- **Метрики за проследяване**:
  - `avg retries to clean run`: колко run-а с ERROR/WARN има преди `errors=warnings=0`.
  - `mean time to green`: разлика между timestamp на първия run с грешки и последния clean run.
  - `% CAP errors`: `cap_errors / errors`.
- **Бърз анализ**:
  - Конзола: `npm run validate -- --path games/demo --summary --snapshot docs/analysis/reports/snapshot-example.json`.
  - JSON: `jq '[.[].errors]' docs/analysis/reports/telemetry-example.json` за тренд.
  - Snapshot: проверявай, че `New codes: none` преди release.
- **DoD**: release не минава, докато telemetry файлът няма последен запис с `errors=0`, `warnings=0` (или WARN допустими според екипа).

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
