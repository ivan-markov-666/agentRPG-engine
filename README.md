# AgentRPG Engine — Workspace Guide

## Documentation — entry point

### Product & roadmap
- **Product brief:** `docs/analysis/product-brief-A RPG game engine for LLM models.-2025-12-19.md` — vision, core contracts (manifest, runtime, UI), Definition of Done.
- **PRD / backlog extract:** `docs/analysis/prd-backlog.md` — FR/T backlog table, metrics, and open questions.
- **Epics & stories roadmap:** `docs/analysis/epics-and-stories.md` — EP-xxx ↔ ST-xxx mapping and statuses.
- **Story catalog:** `docs/stories/story-catalog.md` — index of all story files (status, epic links, DoD notes).

### Guides & workflows
- **How to create a new game:** `docs/analysis/how-to-create-a-new-game.md` — end-to-end workflow (copy skeleton, authoring, validate/runtime, telemetry/KPI).
- **Blank game README:** `docs/analysis/blank-game-README.md` — detailed walkthrough of the `samples/blank-game` files + contract guardrails.
- **Validator (CLI) README:** `docs/analysis/validator-readme.md` — all CLI flags, snapshots, telemetry append, auto-archive.
- **Capabilities catalog:** `docs/analysis/capabilities-catalog.md` — full list of capabilities, ranges and schema guardrails.
- **Validation plan (active):** `docs/analysis/validation-plan.md` — test scope, roles and gating; archived version stays in `docs/analysis/validation-plan-archived.md`.
- **Test design (Sprint01):** `docs/analysis/test-design-epic-sprint01.md` — unit/integration test coverage mapped to epic goals.

### Analysis, metrics and telemetry
- **Build Focus — Sprint 01:** `docs/analysis/build-focus-2025-12-sprint01.md` — objective, KPIs and deliverables for the sprint.
- **Metrics summary:** `docs/analysis/metrics-summary.md` — auto-generated KPI/guardrail report (output of `npm run metrics:report`).
- **Metrics insights dashboard:** `docs/analysis/metrics-insights.md` — trend tables, alerts and recommended actions.
- **Telemetry history & archives:** `docs/analysis/reports/` — `telemetry-history.json`, `metrics-summary.md`, `metrics-insights.md`, `archive/*.json` (needed for publish/sync tooling).

### Research & discovery
- **Brainstorming session log:** `docs/analysis/brainstorming-session-2025-12-14T16-45-00+0200.md` — capability model invariants and next steps.
- **Comparative research:** `docs/analysis/research/domain-similar-open-source-llm-rpg-engines-and-if-frameworks-research-2025-12-19.md` — analysis of similar LLM RPG/IF platforms.

### Stories & sprint artifacts
- **Individual story documents:** `docs/stories/XX-*.md` — acceptance criteria + Dev Agent Record (ST-001 … ST-035).
- **Sprint artifacts / status:** `docs/sprint-artifacts/` (e.g. `sprint-status.yaml`) — progress on DoD tasks and release readiness.

## Ivan agent — Game Builder persona
- **Къде е дефиниран:** `ivan.md` описва Ivan — вътрешен agent, който води автора през всички фази (Setup → Post-Launch) и съдържа пълния списък от validator, runtime и tooling guardrails.
- **Какво прави:** гарантира, че работиш само в `games/<gameId>/**`, синхронизира content с Product Brief/PRD, напомня за езиковата „language gate“ сцена и държи quests/areas/capabilities в рамките на схемите. Водещият принцип е „Ivan описва какво е позволено; README описва къде се намират инструментите“.
- **Как се ползва:**  
  1. Отвори `ivan.md` и следвай фазите (Phase 0–7). Всяка фаза съдържа чеклист и tooling hints (примерно `quest:add`, `scenario:index`, exploration helpers).  
  2. Изпълнявай стъпките само в `games/<gameId>/` – Ivan е експлицитен, че промени извън game папката = нарушение.  
  3. Използвай предоставените CLI примери (validate/runtime/metrics) и синхронизирай резултатите с telemetry/KPI файловете, както е описано в README.  
  4. При съмнение за guardrail провери `ivan.md` секциите „ВАЖНО:“ (capabilities↔state, exploration log, UI/saves, runtime CLI). Те обобщават изискванията от validator checks и JSON схемите.  
  5. Когато добавяш нови NPC/areas/quests, копирай от skeleton-а и потвърждавай с Ivan, че backlinks, rewards и exploration записи са покрити (има конкретни bullet-и за това).
- **Как помага на екипа:** Ivan служи като „контрактен асистент“ – описва DoD guardrails, tooling workflows, препоръчителни команди и въпроси към потребителя. Използването му намалява риска от engine-level промени и ускорява валидирането преди `npm run validate` / `npm run runtime`. README + Ivan са двата задължителни референса при онбординг на нов автор или GM.

## Quick Start — Blank Game Skeleton
1. **Copy the skeleton**:
   - CLI helper: `npm run blank:copy -- --dest games/<gameId>`
   - Manual (if you prefer): `cp -R samples/blank-game games/<gameId>` (Bash) / `Copy-Item samples/blank-game games\<gameId> -Recurse` (PowerShell)
2. **Set language / debug mode (optional):**
   ```bash
   npm run lang:set -- --game <gameId> --language bg --debug true
   ```
   This updates `player-data/session-init.json` and ensures the GM starts in the chosen language/style.
3. **Read `samples/blank-game/README.md`** — describes the skeleton structure, what files to edit, and how to run the validate/runtime loop.
4. **Fill in the files** according to the Product Brief (manifest, quests, areas, runtime state, UI).
5. **(Optional) Store KPI measurements**  
   - Create `games/<gameId>/telemetry/kpi.json` (template available at `samples/blank-game/telemetry/kpi.sample.json`).  
   - During a validator run, pass the file:  
     ```bash
     npm run validate -- --path games/<gameId> --run-id dev-local --log docs/analysis/reports/telemetry-history.json --kpi games/<gameId>/telemetry/kpi.json
     ```
6. **Run the validator**:
   ```bash
   npm run validate -- --path games/<gameId> --run-id dev-local --summary --strict
   ```
7. **Use the skeleton for DoD**: it has valid `capabilities.json`, `state.json`, quest/area files, and clean UI/runtime artifacts, so it should pass validation immediately after copy + minimal edits.

## Validator (CLI)
- Run directly (after `npm run build:ts`): `node dist/cli/validate.js --path games/<gameId> --run-id <prefix-uuid> [--json out.json] [--debug]`
- NPM script: `npm run validate -- --path games/<gameId> --run-id <prefix-uuid> [--json out.json] [--debug]`
- `--run-id` is **required**. Use the helper scripts `tools/scripts/run-id.ps1` and `tools/scripts/run-id.sh` to generate values like `dev-123e4567-e89b-12d3-a456-426614174000`.
- Checks: required files, CAP-* rules, orphans (quests/areas), quest ID↔title; optional JSON report.
- Local pre-release run: `npm run validate -- --path games/<gameId> --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary`
- Alias examples:
  - PowerShell (in `$PROFILE`):
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
- Script: `npm run exploration:add -- --title "..." [--game demo] [--type area|quest|event] [--area area-id] [--quest quest-id] [--origin player-request|gm-suggested] [--desc "..."] [--tags tag1,tag2] [--notes "..."] [--preview-limit 5] [--preview-mode newest|append]`.
- Validates type against guardrails (`area` requires `--area`, `quest` requires `--quest`) and checks that the target area/quest markdown exists.
- If the description is too short (<60 chars), it adds hints so it passes `EXPLORATION-DESCRIPTION-SHORT`. If you omit tags, it adds placeholder/auto-tags (by type + `area:<id>`/`quest:<id>`) to ensure at least 1 tag. The script supports up to 10 unique tags and updates `state.exploration_log_preview`; `--preview-limit` and `--preview-mode` control ordering (default newest, alternative append).
- Enable it by setting `exploration_enabled: true` (or `exploration.enabled: true`) in `player-data/runtime/state.json`, and keep `player-data/runtime/exploration-log.json` schema-valid. With exploration enabled, a missing log or schema violations are `ERROR`.
- Example entry:
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
- Script: `npm run quest:add -- --title "..." [--id quest-slug] [--summary "..."] [--story "..."] [--hooks "Hook A|Hook B"] [--encounters "Fight|Puzzle"] [--steps "Step A|Step B"] [--rewards "500 XP|Rare loot"] [--notes "NPC: ...|Consequence: ..."] [--outcome "Success hook|Faction change"] [--aftermath "Follow-up hook|World change"] [--outcome-hooks "Hook1|Hook2"] [--conditions "Prereq|Timer"] [--fail "Outcome|Consequence"] [--areas "default-area|training-grounds"] [--game demo]`.
- Automatically generates a slug `quest_id` (if not provided), checks `scenario/quests/available.json` for duplicate IDs/titles (supports arrays or maps), adds a new entry, and creates a Markdown file with sections `Summary / Story / Hooks / Encounters / Steps / Rewards / Notes / Outcome / Aftermath / Outcome Hooks / Conditions / Fail State (+ Linked Areas)`.
- If you don't provide values, the script populates placeholder bullets: Hooks/Encounters/Outcome/Aftermath/Outcome Hooks/Notes with "-" lists, Steps as a numbered list (>=2), Rewards with an XP/Gold/Loot/Social template. This way, new quest files pass guardrails directly.
- `--areas` validates the existence of target area files and adds `## Linked Areas`. Additional automation:
  1. `--auto-area-notes` → note in area `## Notes` (`- Quest hook: [[quest-id]] — Title`).
  2. `--auto-area-hooks` → reminder in quest Notes (`- [[area]]: Add encounter/POI hooks…`).
  3. `--auto-encounters` → generates `"Encounter near [[area]]: ..."` entries.
  4. `--sync-area-notes` → copies area Notes to quest Hooks/Encounters.
  5. `--area-conditions` / `--area-threats` → copies area Conditions/Threats to quest Conditions/Fail State.
  6. `--auto-outcome-hooks` → extracts notes/conditions/threats from areas and makes `Outcome Hooks`.
  7. `--auto-rewards-breakdown` → ensures XP/Gold/Loot/Social rows according to steps, areas, and `--reward-tier`.
  8. `--reward-tier easy|standard|epic` → scales XP/Gold amounts during automatic Rewards generation.
  9. `--auto-area-backlinks` → adds `[[quest-id]] quest tie-in` line under `## Connections` in each linked area to maintain bidirectional links.
  10. `--unlock "<policy>"` and `--unlock-requires "quest-a|quest-b"` → directly populate `unlock-triggers.json` with a condition (`always`, `faction:trusted`, etc.) and a list of dependencies (other quest IDs or tokens). The combined value is `[policy, ...requires]`, defaulting to `always` if no data is provided.
  11. `--exploration-hook` → ensures each linked area has an entry in `player-data/runtime/exploration-log.json` with a `quest:<id>` tag (creating/updating the log automatically to respond to `EXPLORATION-QUEST-*` guardrails).

### Economy tooling
- Command `npm run economy:report -- --game demo [--json out.json]` aggregates Rewards breakdown from all quests, calculates XP/Gold totals/averages, and displays Loot/Social counters. With `--json`, it writes a detailed report (per-quest values + warnings for missing files) to JSON.

### Scenario overview helper
- `npm run scenario:index -- --game demo` regenerates `games/<game>/scenario/index.md`, generating a table with all quests (links, unlock conditions, brief summaries) and all areas (links + descriptions). This ensures `scenario/index.md` never falls below the minimum length (`INDEX-SHORT`) and provides an up-to-date roadmap for the GM team.

### Area helper (CLI)
- Script: `npm run area:add -- --id area-slug [--title "..."] [--description "..."] [--points "POI A|POI B"] [--connections "Link A|Link B"] [--notes "NPC: ...|Threat: ..."] [--conditions "Prereq|Timer"] [--threats "Escalation|Fail"] [--game demo]`.
- Generates a slug for the file `scenario/areas/<id>.md`, checks if it doesn't exist, and scaffolds sections `Description / Points of interest / Connections / Notes`.
- If you don't provide values → the description gets 2-6 sentence placeholders; POI/Connections are populated with example bullets, Notes contain NPC/Threat hints, and Conditions/Threats add requirements/escalations. This way, new area files cover `AREA-POINTS-*`, `AREA-CONNECTIONS-*`, `AREA-NOTES-*`, `AREA-CONDITIONS-*`, `AREA-THREATS-*` guardrails by default.

### Orphan remediation helper (CLI)
- Script: `npm run remedy:orphans -- --path games/<gameId>` (or `--game demo` by default if you don't provide `--path`).
- Logic:
  - Checks `player-data/runtime/state.json` for active quests (`active_quests`) and `current_area_id`.
  - If a quest file is missing for an active quest → scaffolds a minimal Markdown using the same template as `quest:scaffold`.
  - If `current_area_id` points to a missing area → ensures `default-area.md` exists (creating a placeholder if needed) and updates `state.current_area_id = "default-area"`.
- The CLI doesn't delete/overwrite existing files (except updating state with a fallback). The validator continues to report `QUEST-ORPHAN` / `AREA-ORPHAN`; remediation is just a helper step.

### Release checklist (before GM session / pre-release)
- 1) (If needed) Add/update area: `npm run area:add -- --id <area-id> --title "..." --description "..." --game <gameId>`
- 2) (If needed) Add quest scaffold: `npm run quest:add -- --title "..." --game <gameId>`
- 3) (If needed) Add exploration entry (only if the area file already exists): `npm run exploration:add -- --title "..." --type poi --area <area-id> --game <gameId>`
- 4) Run the validator in strict mode: `npm run validate -- --path games/<gameId> --run-id <tag> --strict --summary`
- 5) (Recommended) Snapshot regression check: `npm run validate -- --path games/<gameId> --run-id <tag> --json docs/analysis/reports/latest-run.json --append --snapshot docs/analysis/reports/latest-run.json --strict --summary`

### Runtime CLI
- **Quick load check:** `npm run runtime -- --path games/<gameId>` loads manifest, session-init and state, and prints a short summary.
- **Debug mode:** `npm run runtime -- --path games/<gameId> --debug` prints the full JSON snapshot.
- **Error handling:** the CLI returns a non-zero exit code on missing files or invalid JSON.

### Sprint Metrics Workflow
1. **Local validate + telemetry:** run `npm run validate:metrics -- --game <gameId> --run-id <tag>`. It runs the validator, automatically appends telemetry (`docs/analysis/reports/telemetry-history.json`), and regenerates `metrics-summary.md`.
   - *Note:* `validate:metrics` also accepts `--path games/<gameId>`; `--game` is the recommended interface.
2. **Custom history/output (optional):** `npm run metrics:report -- --history docs/analysis/reports/telemetry-history.json --out docs/analysis/metrics-summary.md --limit 10`.
3. **Insights dashboard:** add `--insights docs/analysis/metrics-insights.md` to generate a document with Summary / KPI Trends / Alerts / Recommended Actions. The emojis (✅/⚠️/❌) indicate whether KPIs pass the thresholds (runtime 200/230 ms, warnings 0.5/1, CAP ratio 5%/15%).
4. **Archive telemetry at ≥50 runs or before release:** `npm run archive:telemetry -- --label sprint01` (resets history after writing `docs/analysis/reports/archive/<timestamp>-sprint01.json`).
5. **Definition of Done:** ensure `docs/analysis/metrics-summary.md` and `metrics-insights.md` show ≥3 consecutive clean runs, avg duration <200 ms, snapshot `New codes = none`.

#### Telemetry transfer flow (archive → publish → sync)
| Step | Command | What it does |
|------|---------|--------------|
| 1. Archive | `npm run archive:telemetry -- --label sprint01` | Moves `telemetry-history.json` to `docs/analysis/reports/archive/<timestamp>-sprint01.json` and resets history. |
| 2. Publish bundle | `npm run publish:telemetry -- --source docs/analysis/reports/archive --dest docs/analysis/reports/central-upload --all --include-history docs/analysis/reports/telemetry-history.json` | Copies the latest (or all with `--all`) archives and, optionally, the current history file into the “central upload” directory. Use `--dry-run` to preview without copying. |
| 3. Sync to target | `npm run sync:telemetry -- --dest s3://my-bucket/telemetry` **or** `npm run sync:telemetry -- --dest ../shared/telemetry` | Syncs `docs/analysis/reports/central-upload` to the destination. Supports local directories (recursive copy) and `aws s3 sync` if `--dest` is `s3://...`. AWS CLI + credentials are required for S3; use `--dry-run` to validate the command. |

> **Tip:** If you work offline, you can stop after Step 2 and provide the contents of `docs/analysis/reports/central-upload/` as a zip. For team sync, always go through archive → publish → sync to avoid drift between local telemetry histories.

#### Metrics Insights Dashboard
- File: `docs/analysis/metrics-insights.md` (generated via `npm run metrics:report -- --insights docs/analysis/metrics-insights.md`).
- **Summary:** last run, clean ratio, average KPIs with emoji status.
- **KPI Trends:** table with Avg runtime, Avg warnings/run, CAP alerts ratio, Clean run ratio, Latest warnings.
- **Alerts:** list of active threshold alerts; when none, they remain ✅.
- **Recommended Actions:** automatic hints for CAP problems, slow runs, or repeating codes (the `top codes` list).
- Use it as an “operational dashboard” between sprint retro and DoD checks.

### TypeScript Tooling (EP-004)
- **Scripts:** `npm run typecheck` (strict `tsc --noEmit`), `npm run build:ts` (`tsc -p tsconfig.build.json` → `dist/` with declarations/source maps), `npm run lint:ts` (ESLint + `@typescript-eslint`).
- **tsconfig structure:** `tsconfig.json` sets strict rules, Node16 module resolution, alias `@types/* → src/types/*`; `tsconfig.build.json` inherits and enables declaration emit.
- **Shared types:** `src/types/` contains `CapabilitiesConfig`, `ScenarioContract`, `TelemetryEntry` and barrel `index.ts`. Can be imported via `import { TelemetryEntry } from '@types';`.
- **Migration:** repo policy is TS-only for source code; JS tooling/scripts are migrated story-by-story. New TS code lives in `src/` and compiles to `dist/` (build output, not committed). When adding new types/contracts, update `src/types/` and describe the change in the architecture document.
- **Lint & formatting:** `.eslintrc.json` is configured for TS; Prettier can be used as a formatter (optional `npx prettier --write src/**/*.ts`).

### Git hook (pre-push validate + metrics)
1. Script: `scripts/pre-push-validate.sh` reads `ARPG_GAME`, `ARPG_RUN_ID`, `ARPG_LIMIT` (optional) and `ARPG_AUTO_ARCHIVE` (default 50), then runs `npm run validate:metrics -- --game <game> --run-id <tag> --auto-archive <value>`.
2. Install:
   ```bash
   cp scripts/pre-push-validate.sh .git/hooks/pre-push
   chmod +x .git/hooks/pre-push
   ```
3. Optional for PowerShell: add a `.git/hooks/pre-push` file that calls `pwsh -File scripts\\pre-push-validate.ps1` (if you add an equivalent PS script). This guarantees automatic DoD validation before `git push`.

### Telemetry baseline (22 Dec 2025)
| Metric | Value | Source |
|--------|-------|--------|
| Avg run duration | ~103 ms (150 ms, 17 ms, 143 ms) | `docs/analysis/reports/telemetry-history.json` |
| Avg warnings/run | 1.67 → 0 after the final run `dev-20251222-1548a` | `telemetry-history.json`, `latest-run.json` |
| Most frequent codes before fix | `SCHEMA-NOT-AVAILABLE`, `MANIFEST-FIELD`, `CAP-UNKNOWN-RUNTIME` | `telemetry-history.json` |
| Definition of Done | ≥3 consecutive runs with `errors=0`, `warnings=0`, `CAP errors=0`, snapshot `New codes = none`, avg duration <200 ms | Product brief Step 4 |

> Reminder: at ≥50 runs or before release, run `npm run archive:telemetry -- --label <tag>` and reset `telemetry-history.json`.

## Sprint 01 — Validator Reliability
- **Schema guardrails:** `config/capabilities.*` and `player-data/runtime/state.json` are validated via JSON Schema + Ajv (incl. `ajv-formats`). Validation checks nested values (`reputation.*`, `currency.*`, `status_effects.*.stack>=0`) and returns `CAP-RUNTIME-RANGE` / `CAP-STATUS-STACK` when out of bounds.
- **Exploration log schema:** `player-data/runtime/exploration-log.json` is checked by the `EXPLORATION-SCHEMA` guardrail (slug `id`, type in {`area`,`quest`,`event`}, `added_at` ISO8601, `origin` = `player-request`/`gm-suggested`, descriptions ≥60 chars, `tags` 1-10 unique). Missing/empty log when exploration is enabled results in `FILE-MISSING-OPTIONAL` / `EXPLORATION-EMPTY`. Additional checks: `EXPLORATION-DESCRIPTION-SHORT`, `EXPLORATION-TAGS-MIN`, `EXPLORATION-DUPLICATE-*`, `EXPLORATION-AREA-MISSING`, and `EXPLORATION-PREVIEW-MISMATCH` when `state.json` contains preview IDs with no real entries. The CLI helper `npm run exploration:add` accepts legacy aliases (`poi`, `landmark`, etc.) and maps them to the three allowed values before writing JSON.
- **Unit & integration tests:** `tools/validator/tests/validator.test.js` covers SCHEMA guardrails, YAML fallback, snapshot/ignore scenarios, and requires a clean `scenario/index.md`.
- **Quest / area guardrails:** `available.json` detects `QUEST-ID-DUPLICATE`, titles shorter than 5 characters (`QUEST-TITLE-SHORT`), and missing unlock policies (`UNLOCK-MISSING`). Unlock values are checked for empty/duplicate conditions (`UNLOCK-EMPTY`, `UNLOCK-DUPLICATE`, `UNLOCK-VALUE-TYPE`). Links to `[[areas]]` require bidirectional references (`QUEST-AREA-BACKLINK`). Quest files must contain the `Summary`, `Story`, `Hooks`, `Encounters`, `Steps`, `Rewards` and `Notes` sections (Steps ≥2 entries, Rewards/Hooks/Encounters/Notes ≥1). Area files require `Description` ≥60 chars, lists in `Points of interest` and `Connections`, plus a `Notes` bullet list for NPC hooks/threats (`AREA-NOTES-*`). The `AREA-LINK` and `AREA-QUEST-BACKLINK` guardrails ensure quest links are real and bidirectional.
- **Telemetry reports:** run `npm run metrics:report` (optionally with `--history <file> --out <file> --limit <N>`) to regenerate `docs/analysis/metrics-summary.md` from `docs/analysis/reports/telemetry-history.json`.
- **DoD reminder:** ≥3 consecutive clean runs (`errors=0`, `warnings=0`, `CAP errors=0`, snapshot `New codes = none`, avg duration <200 ms). Doc: `docs/analysis/build-focus-2025-12-sprint01.md`.

**Example quest / area sections**

```markdown
# Quest Name
## Summary
Short pitch (≥30 characters).
## Story
Longer narrative context.
## Hooks
- List of GM prompts / table entries.
## Encounters
- List of enemies or obstacles.
## Steps
1. Guided steps (≥2).
## Rewards
- XP / loot / social consequences (≥1).
## Notes
- NPC hooks, secrets, special conditions.
```

```markdown
# Area Name
## Description
≥60 characters of atmosphere.
## Points of interest
- List of POIs (≥1).
## Connections
- List of links to other areas/quests (≥1).
## Notes
- NPCs, plot hooks, dangers.
```

**Example exploration log entry**
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

## Where the source files live
- Validator code: `tools/validator/` (checks, reporters, utils).
- Config/docs: `docs/analysis/`.

## Responsibilities (dev vs GM)
| Role | What they do | When |
|------|-------------|------|
| Dev (feature branch) | Runs `npm run validate ... --run-id dev-XX` before push; keeps `latest-run.json` clean. | Before every PR / merge. |
| Dev (release candidate) | Runs the combined task + `npm run archive:telemetry -- --label rc-<number>` if history exceeds 50 runs. | On sprint/RC boundary. |
| GM / Facilitator | Reads telemetry history, requires an archive before a major session; checks snapshot (New codes = none). | Before a GM session and after final QA. |
| Analyst / QA | Exports archives (`docs/analysis/reports/archive/*.json`) to storage; analyzes avg retries / mean time to green. | Weekly retro or incident response. |

## Note on UI
The engine is file-first and does not ship a UI; `ui/*.json` are read-only contracts for a future viewer/framework.
