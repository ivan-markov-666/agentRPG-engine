# AgentRPG Validator CLI (draft)

## Purpose
Validates the file contracts of a game built on AgentRPG Engine: required files, CAP-* rules, orphans, quest ID↔title. Optionally generates a JSON report for telemetry.

## Related documents
- How to create a new game: `docs/analysis/how-to-create-a-new-game.md`

## Usage
- Build variant: `npm run validate -- --path games/<gameId> --run-id <id> [--json out.json] [--append] [--debug] [--strict] [--summary] [--log telemetry.json] [--snapshot prev.json] [--ignore CODE1,CODE2] [--auto-archive 50]`. The script automatically runs `npm run build:ts` before calling `node dist/cli/validate.js`.
- Dev variant (no pre-build): `npm run validate:dev -- --path games/<gameId> --run-id <id> ...` (ts-node on `src/cli/validate.ts` — useful while developing the CLI).
- Without `--run-id`, the CLI terminates (`[ERROR][RUN-ID] Missing required --run-id <value>`). Use the helper scripts `tools/scripts/run-id.(ps1|sh)` for generation.
- `--append` (with `--json out.json`): appends the new result to an array if the file is an array; otherwise overwrites.
- `--strict`: treat WARN as ERROR.
- `--summary`: prints summary only (useful for CI or a quick lint pass).
- `--snapshot prev.json`: compares the current run with a previous JSON (shows new/resolved codes).
- `--ignore CODE1,CODE2`: temporarily hides the listed codes from the report (local experiments only).

### Example commands
- Basic check (build output): `npm run validate -- --path games/demo --run-id dev-local`
- Dev run (no build): `npm run validate:dev -- --path games/demo --run-id dev-local`
- Write JSON + append: `npm run validate -- --path games/demo --run-id dev-local --json reports/last.json --append`
- Strict mode: `npm run validate -- --path games/demo --run-id dev-local --strict`
- Snapshot against a previous report: `npm run validate -- --path games/demo --run-id dev-local --json reports/last.json --append --snapshot reports/last.json`
- Telemetry + log: `npm run validate -- --path games/demo --run-id dev-001 --log docs/analysis/reports/telemetry-history.json`
- Debug (prints INFO): `npm run validate -- --path games/demo --run-id dev-local --debug`
- Snapshot example (2 runs, append):  
  1) `npm run validate -- --path games/demo --run-id dev-001 --json reports/last.json --append`  
  2) fix the data, then run: `npm run validate -- --path games/demo --run-id dev-002 --json reports/last.json --append --snapshot reports/last.json`  
  The console will show `[INFO][SNAPSHOT] New codes: ... | Resolved: ...`
- Local “pre-release” check (no CI): `npm run validate -- --path games/demo --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary`

### State schema control
- `player-data/runtime/state.json` is validated against [`tools/validator/schemas/state.schema.json`]. The schema describes expected fields (`stats`, `flags`, `inventories`, `exploration_*`) and enforces non-negative values, valid `status_effects` stacks, and inventory structures.
- Violations are reported as `STATE-SCHEMA` warnings/errors. Examples:
  - `[/current_day] must be >= 0`
  - `[/inventories/0/items/0/qty] must be >= 0`
  - `[/stats/status_effects/poison/stack] must be >= 0`
- Add new keys via the `genericStat` section of the schema file or extend `definitions` to avoid `STATE-SCHEMA` violations.

### Quest & Scenario contract control (ST-007)
- `scenario/quests/available.json` is compared against `scenario/index.md` and `scenario/quests/unlock-triggers.json` to avoid orphans or inconsistencies:
  - `INDEX-QUEST-MISSING` — quest in available.json is missing from the table in index.md → run `npm run scenario:index` or add the row manually.
  - `INDEX-QUEST-UNKNOWN` — index contains a quest that is missing in available.json → delete the row or restore the quest.
  - `QUEST-ORPHAN` — quest file is missing → create the markdown file or remove the entry.
  - `UNLOCK-UNKNOWN`, `UNLOCK-DEPENDENCY-UNKNOWN`, `UNLOCK-FORMAT`, `UNLOCK-DUPLICATE` — see `scenario/quests/unlock-triggers.json`.
- Quest markdown files are checked for broken `[[links]]`, missing sections, and reward formats (`QUEST-LINK`, `QUEST-AREA-BACKLINK`, `QUEST-REWARDS-*`, etc.).

#### Remediation helper (ST-021)
- The validator stays strict for `QUEST-ORPHAN` / `AREA-ORPHAN`, but there is a CLI for quick remediation:  
  `npm run remedy:orphans -- --path games/<gameId>` (or `--game demo`).  
  The script:
  1. Reads `player-data/runtime/state.json` and scaffolds missing quest files for every active `quest_id` (using the same template as `quest:scaffold`).
  2. Checks `current_area_id` and if the area file is missing → ensures `default-area.md` exists (auto-creates it if needed) and updates state to point to it.
  3. Does not delete/overwrite existing files; the only state change is a fallback to `default-area`.
- Use this helper to quickly restore a playable state before running the validator again.

### Exploration logging control (ST-008)
- Enable exploration mode via `player-data/runtime/state.json` (`"exploration_enabled": true` or `state.exploration.enabled = true`). When enabled:
  - Missing log → `EXPLORATION-LOG-MISSING` (ERROR). Create `player-data/runtime/exploration-log.json` and start with `[]`.
  - Schema violations → `EXPLORATION-SCHEMA` (ERROR). JSON Schema requires `id`, `title`, **`type` ∈ {`area`,`quest`,`event`}**, `added_at` (ISO), `origin`, ≥60 chars `description`, 1–10 unique tags, and conditional `area_id` (for `area`) or `quest_id` (for `quest`).
- Regardless of mode, additional guardrails from `checkRequiredFiles` also run: `EXPLORATION-DESCRIPTION-SHORT`, `EXPLORATION-TAGS-MIN`, `EXPLORATION-DUPLICATE-ID/TITLE`, `EXPLORATION-AREA-MISSING`, `EXPLORATION-PREVIEW-MISMATCH`.
- `npm run exploration:add ...` helps scaffold valid entries (see the README section “Exploration log helper”). The script accepts legacy aliases (`poi`, `landmark`, `event-hook`) and maps them to allowed schema values **before** writing JSON, so final files always use `area`/`quest`/`event`.

### Quick aliases (optional)
- PowerShell (add to `$PROFILE`):
  ```powershell
 function arpg-validate {
   param([string]$game = "demo")
   npm run validate -- --path "games/$game" --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary
 }
 ```
  Run: `arpg-validate demo`
- Bash/Zsh:
  ```bash
 arpg_validate() {
   game=${1:-demo}
   npm run validate -- --path "games/$game" --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary
 }
 ```
  Run: `arpg_validate demo`

## Output
- Console: `[LEVEL][CODE] file:message (suggested fix)`
- Exit code: 1 if:
  - there is at least one `ERROR` (or a warning escalated via `--strict`);
  - guardrail operations (`--snapshot`, `--log`) fail (the validator prints `[ERROR][SNAPSHOT]...`/`[ERROR][LOG]...`).
- `--auto-archive <N>` (optional): after a successful telemetry log, automatically invokes the archiving script if the history has ≥N entries. On skip it prints `[AUTO-ARCHIVE][SKIP]`, on success `[AUTO-ARCHIVE] Archived ...` and resets the history file.
- Exit code: 0 only when there are no ERRORS and guardrail side-effects succeed.
- JSON (with `--json out.json`): `{ errors, warnings, cap_errors, issues: [...] }`
- Telemetry log (requires `--run-id` + `--log`): `{ runId, run_id, timestamp, duration_ms, errors, warnings, issues }`

### Troubleshooting (guards)
- `[ERROR][SNAPSHOT] ENOENT ...` — verify that the file passed to `--snapshot` exists (or remove the flag). This failure is blocking → CLI returns 1.
- `[ERROR][SNAPSHOT] Unexpected token ...` — JSON is corrupted; open the file and fix the syntax or delete the last run, then run the validator again.
- `[ERROR][LOG] EISDIR ...` — `--log` points to a directory/invalid path. Provide a valid `.json` file (e.g. `docs/analysis/reports/telemetry-history.json`).
- `[ERROR][LOG] EACCES ...` — missing write permissions. Change location or grant write permission before re-running.

### Archiving via script
- There is a helper `npm run validate -- --path games/<gameId> --run-id <tag> --log docs/analysis/reports/telemetry-history.json --auto-archive 50` (optional) → automatically triggers archiving when telemetry history reaches ≥50 entries.
- `npm run archive:telemetry -- --label sprint01` (as needed) → moves history into `docs/analysis/reports/archive/`.
- `npm run publish:telemetry -- --dest docs/analysis/reports/central-upload --history --all` → prepares a bundle for central storage.

- The script:
  1. Checks if the history file exists and has content (not an empty array).
  2. Creates `docs/analysis/reports/archive/<timestamp>-<label>.json`.
  3. Resets the history file to `[]`.
- Use it after a release or when the telemetry log reaches the retention limit.
- For automation (without npm), use the shell/PwSh wrappers:
  - PowerShell: `powershell -ExecutionPolicy Bypass -File tools/scripts/archive-telemetry.ps1 -Label nightly -History docs/analysis/reports/telemetry-history.json`
  - Bash: `bash tools/scripts/archive-telemetry.sh --label nightly --history docs/analysis/reports/telemetry-history.json`

### Periodic archiving (local)
- **PowerShell task (Windows)**:
  ```powershell
$stamp = Get-Date -Format 'yyyy-MM-dd'
$archive = "docs/analysis/reports/archive/$stamp-telemetry.json"
Move-Item docs/analysis/reports/telemetry-history.json $archive
Out-File docs/analysis/reports/telemetry-history.json -Encoding utf8 -InputObject "[]"
```
  - Expected output: `Summary: 0 error(s), 0 warning(s)` and `[INFO][SNAPSHOT] New codes: none`.
> ⚠️ GitHub Actions / CI automation is **optional** and not part of the MVP local-only workflow. Use the examples below as reference only.

4. **CI gating & archiving** (optional/out of scope for MVP local-only workflow):
   - Fail the pipeline if exit code != 0 (CAP errors, WARN under strict, snapshot/log guardrail failures).
   - After a clean run (0 errors/0 warnings), run `npm run archive:telemetry -- --label <build-id>` to reset local history and upload the archive file as an artifact.
   - Archive `docs/analysis/reports/latest-run.json` / `telemetry-history.json` as build artifacts (or snapshot JSON + archive output).
  - Example (for reference only, not part of MVP local-only workflow):
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
5. **Before merge**: review the telemetry file for the latest run_id and keep a clean state in the repo (option: commit reports or publish them as CI artifacts).

## Limitations / TODO
- YAML support: available if the `yaml` package is installed; otherwise WARN.
- Schemas (JSON Schema): validates `capabilities.json`, `state.json` and `exploration-log.json` via AJV (codes `CAP-SCHEMA`, `STATE-SCHEMA`, `EXPLORATION-SCHEMA`).
- Telemetry: `--run-id` + `--log` writes JSON (timestamp, duration, errors/warns, issues).

## Example output (console)
```
[ERROR][FILE-MISSING] manifest/entry.json: Missing required file (Create file or fix path)
[WARN][CAP-RUNTIME] player-data/runtime/state.json: Missing runtime values: mana (Add to stats or disable in capabilities.json)
Summary: 1 error(s), 1 warning(s)
```

## Example JSON (report)
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

## Example telemetry log (append)
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

## Snapshot example (JSON)
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
Console on the second run: `[INFO][SNAPSHOT] New codes: none | Resolved: FILE-MISSING, CAP-RUNTIME`

## Example snapshot diff (console)
```
[INFO][SNAPSHOT] Comparing current run with reports/last.json
[INFO][SNAPSHOT] New codes: QUEST-CONTENT (1), QUEST-LINK (1)
[INFO][SNAPSHOT] Resolved: FILE-MISSING (1), CAP-RUNTIME (1)
[INFO][SNAPSHOT] Regression score: +2 new / -2 resolved
Summary: 1 error(s), 1 warning(s) | Top: QUEST-CONTENT:1, QUEST-LINK:1
```
Interpretation: new QUEST problems have appeared; the old FILE/CAP issues were resolved. Keep fixing until New codes = none and errors=0.

## Example telemetry log (JSON line)
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
Interpretation: the run passed with no errors, but with 1 warning. If you require strict releases, fix QUEST-CONTENT and run again — telemetry will have a second entry with errors=warnings=0.
📁 Full example (append history): `docs/analysis/reports/telemetry-example.json`

## Telemetry retention and analysis
- **Location**: by default we write to `docs/analysis/reports/telemetry-history.json`. Use `--log docs/analysis/reports/telemetry-history.json --append` to keep history.
- **Retention policy**:
  1. Keep at most ~50 runs or ~2 weeks locally (team-dependent).
  2. When the limit is exceeded, archive:
    ```bash
stamp=$(date +%Y-%m-%d)
mkdir -p docs/analysis/reports/archive
mv docs/analysis/reports/telemetry-history.json "docs/analysis/reports/archive/${stamp}-telemetry.json"
printf "[]\n" > docs/analysis/reports/telemetry-history.json
```
  3. Option: upload the archive file as a CI artifact or to central storage.
- **run_id naming**: `persona-iteration` (e.g. `dev-01`, `gm-release-3`) or `<branch>-<timestamp>`. Helps grouping by person/phase/feature.
- **Metrics to track**:
  - `avg retries to clean run`: how many ERROR/WARN runs occur before `errors=warnings=0`.
  - `mean time to green`: time between the first failing run and the final clean run.
  - `% CAP errors`: `cap_errors / errors`.
- **Quick analysis**:
  - Console: `npm run validate -- --path games/demo --run-id dev-local --summary --snapshot docs/analysis/reports/snapshot-example.json`.
  - JSON: `jq '[.[].errors]' docs/analysis/reports/telemetry-example.json` for trend.
  - Snapshot: verify `New codes: none` before release.
- **DoD**: a release does not pass until the telemetry file has a last entry with `errors=0`, `warnings=0` (or WARNs allowed by the team).

## Metrics and KPI reports
- Script: `npm run metrics:report` (wrapper around `tools/metrics/report.js`).
- Input: `docs/analysis/reports/telemetry-history.json` (default). Override via `--history <path>`.
- Output: `docs/analysis/metrics-summary.md` (markdown tables + KPIs). Override via `--output <path>` / `--out`.
- Archive: before overwrite, a copy is created in `docs/analysis/reports/archive/metrics-summary-<timestamp>-<label>.md`. You can pass:
  - `--archive-dir <dir>` — alternative archive directory.
  - `--archive-label release-123` — suffix for the name (alphanumeric, auto-sanitized).
- Dry run: `npm run metrics:report -- --dry-run` computes KPIs and logs actions without writing summary/insights/archive.
- Insights: add `--insights docs/analysis/metrics-insights.md` to generate a second markdown with KPI statuses and recommendations; honors `--dry-run`.
- Additional flags:
  - `--limit 20` — analyze only the last N runs.
  - `--output` is equivalent to `--out`.
  - `--history`, `--insights`, `--archive-dir`, `--archive-label` accept relative or absolute paths.
- Example:
  ```bash
npm run metrics:report -- \
  --history docs/analysis/reports/telemetry-history.json \
  --output docs/analysis/metrics-summary.md \
  --archive-label sprint01 \
  --insights docs/analysis/metrics-insights.md
```
- Tests: `node tools/tests/metrics-report.test.js` validates archiving and dry-run mode (part of `npm test`).

### Archiving telemetry
1. Create the folder `docs/analysis/reports/archive/` (one-time).
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
4. (Optional) upload archives to artifact storage or Git LFS.

### Automatic run_id generation
- PowerShell helper:
  ```powershell
function new-run-id {
  param([string]$persona = "dev")
  $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  return "$persona-$stamp"
}
```
  Usage: `npm run validate -- --run-id (new-run-id -persona 'gm') ...`
- Bash helper:
  ```bash
run_id() {
  persona=${1:-dev}
  printf "%s-%s\n" "$persona" "$(date +%Y%m%d-%H%M%S)"
}
```
  Usage: `npm run validate -- --run-id "$(run_id gm)" ...`
- For branch-based IDs, add `git rev-parse --abbrev-ref HEAD`:
  ```powershell
function run-id-branch {
  $branch = (git rev-parse --abbrev-ref HEAD)
  "$($branch)-$(Get-Date -Format 'HHmmss')"
}
```

## Screenshots (description)
- Console (summary-only): lines like  
  `Summary: 0 error(s), 1 warning(s) | Top: CAP-RUNTIME:1`  
  `CAP errors: 0`
- JSON report (in an editor): keys `errors`, `warnings`, `top_codes`, `issues`.
- Telemetry log (append array): multiple objects with `run_id`, `timestamp`, `errors`, `warnings`.

## How to read the reports (local)
- `Summary: X error(s), Y warning(s) | Top: CODE1:cnt, CODE2:cnt`: if errors>0 → fix and run again; top_codes help you identify the most frequent problems.
- `CAP errors: N`: if N>0, fix capabilities/state (blocking).
- JSON report: `top_codes` is an array of `{code,count}` by frequency; `issues` contains files and suggested fixes.
- Telemetry log (append): array of runs; see `errors/warnings`, `duration_ms`, `run_id` for retrospectives.
- Snapshot: `[INFO][SNAPSHOT] New codes: ... | Resolved: ...` — if new codes are empty and errors=0 → you are done.
- `--summary` hides detailed lines and prints only summary (useful for a quick check).
- `--ignore CODE1,CODE2` temporarily hides codes (do not use for release).

### Top codes → next steps
| Category | Example codes | What to do |
|-----------|-----------------|-------------------|
| **CAP** | CAP-RUNTIME, CAP-RUNTIME-RANGE, CAP-UNKNOWN-RUNTIME, CAP-DISABLED-RANGE | Review `config/capabilities.json` and `player-data/runtime/state.json`; add missing runtime values, fix ranges, or remove unknown keys. |
| **FILE / INDEX** | FILE-MISSING, INDEX-EMPTY, MANIFEST-FIELD | Create missing files (`manifest/entry.json`, `scenario/index.md`), fill in id/title/version, add content to the index. |
| **QUEST** | QUEST-EMPTY-LIST, QUEST-CONTENT, QUEST-LINK, QUEST-LINK-SELF, UNLOCK-UNKNOWN | Check `scenario/quests/*`; add Summary/Steps/Rewards, fix [[links]] to real quest/area IDs, sync `available.json` and `unlock-triggers.json`. |
| **EXPLORATION / STATE** | EXPLORATION-EMPTY, INDEX-SHORT | If `exploration_enabled=true`, populate `player-data/runtime/exploration-log.json`; add more context to `scenario/index.md`. |
| **SCHEMA / YAML** | SCHEMA-ERROR, YAML-PARSE | Ensure JSON matches the schema; for YAML install the `yaml` package and validate the structure. |

## Exploration log example (valid entry)
```json
{
  "id": "mistwood-spire",
  "title": "Mistwood Spire lookout",
  "type": "area",
  "area_id": "mistwood",
  "description": "Crystal tower that pierces the fog above Mistwood; scouts use it to watch the northern frontier.",
  "added_at": "2025-12-22T18:55:00Z",
  "tags": ["scouting", "fog"],
  "origin": "gm-suggested"
}
```
Guardrails: slug `id`, type in {`area`,`quest`,`event`}, descriptions ≥60 chars, ISO8601 `added_at`, max 10 unique `tags`, `origin` = `player-request`/`gm-suggested`.  
*Note: The CLI tool `npm run exploration:add` accepts legacy type names (e.g. `poi`, `landmark`) and maps them to the schema types before writing to the file.*

## Definition of Done (local checklist)
- `npm run validate -- --path games/<id> --run-id <tag> --json reports/last.json --append --snapshot reports/last.json --strict --summary` returns `Summary: 0 error(s), 0 warning(s)`.
- No CAP errors (CAP errors: 0).
- Quest files have Summary/Steps/Rewards; no QUEST-LINK to missing targets.
- manifest/entry.json has id/title/version; scenario/index.md is not empty/short.
- If exploration_enabled=true → exploration-log.json exists and is not an empty array after play.
- Telemetry log is written (if you use `--run-id ... --log telemetry.json`) and snapshot shows previous codes are Resolved.

### Example messages (by code)
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

### Common errors and fixes
- FILE-MISSING: missing file → create it (empty is OK) or fix the path.
- CAP-RUNTIME: enabled capability without a runtime value → add it to state.stats or disable.
- CAP-RUNTIME-RANGE: value out of min/max or range → adjust the value or the range.
- QUEST-ORPHAN / UNLOCK-UNKNOWN: quest is missing but referenced → create the file or remove the reference.
- QUEST-CONTENT: missing Summary/Steps/Rewards → add sections to the markdown.
- EXPLORATION-EMPTY: exploration enabled but log is empty → add entries or disable exploration.
- CAP-UNKNOWN-RUNTIME: runtime.stats contains keys not present in capabilities → remove them or add the capability.
- CAP-DISABLED-RANGE: capability is disabled but has range/min/max → remove the ranges or enable.
- QUEST-LINK / QUEST-LINK-SELF: link missing or self-referential → fix the target or remove the link.
- UNLOCK-FORMAT: unlock-triggers value is not string/array → change it to a string or array of conditions.
- INDEX-EMPTY/SHORT: scenario/index.md is too short → add an overview and starter hook.
- MANIFEST-FIELD: missing id/title/version → add them to manifest/entry.json.

## Installing YAML (optional)
- `npm install yaml` (or `pnpm add yaml`) if you want to parse .yml/.yaml files.
