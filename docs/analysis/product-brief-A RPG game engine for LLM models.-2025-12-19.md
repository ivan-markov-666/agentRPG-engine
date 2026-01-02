---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - 'docs/analysis/research/domain-similar-open-source-llm-rpg-engines-and-if-frameworks-research-2025-12-19.md'
  - 'docs/analysis/brainstorming-session-2025-12-14T16-45-00+0200.md'
workflowType: 'product-brief'
lastStep: 4
project_name: 'A RPG game engine for LLM models.'
user_name: 'Master'
date: '2025-12-19'
---

# Product Brief: A RPG game engine for LLM models.

**Date:** 2025-12-19
**Author:** Master

---

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Step 2 — Vision

> **Status (22 Dec 2025):** Steps 1–4 are completed and the document is frozen as Product Brief v1. Additions are made only if a new requirement appears from the Decision/PRD phase.

### Executive Summary

AgentRPG Engine is an open-source **npm package** (and GitHub repo) for RPG/interactive narrative games, where a **single centralized Game Master (GM), driven by an LLM**, runs the game and acts as the “backend” logic, **without a classic backend/API layer**.

The engine is **platform-agnostic**: initially integrated with Windsurf (copy/paste workflow via Cascade), but independent from any specific platform (future: Cursor/Claude Code, etc.).

The game is **file-first**: it has a `manifest/entry.json` file that describes the game and contains links to related files (rules/config/content). The game is started via a **session-init file** (`player-data/session-init.json`) that the player provides (copy-paste into Cascade). The engine then opens and provides only the needed files to the LLM via a predictable navigation flow (so the LLM does not “wander” about what comes next).

Primary goal for v1: **reach a playable prototype quickly**, useful for both creators and players.

### Core Vision

#### Problem Statement

Creating an LLM-driven RPG experience often requires a classic backend/game-loop layer, APIs, and infrastructure (including a database), instead of letting the LLM drive gameplay directly on top of a ready engine framework with clear contracts and stable models.

#### Problem Impact

- Slow start: time goes into infrastructure and glue code instead of content and gameplay iteration.
- High entry barrier: requires backend knowledge, deployment, and maintenance.
- Fragility: without a stable state/contract model, prototypes are hard to make repeatable and toolable.

#### Why Existing Solutions Fall Short

(categories)

- “Prompt-first” approaches without a stable **state/contract** model → hard to repeat and hard to tool.
- Approaches with a classic backend/orchestrator layer → more infrastructure and maintenance, against the “no classic backend” goal.

#### Proposed Solution

Engine framework (open-source npm package), which:

- Defines **manifest/entry.json** (static) as the main entry point for the game and source of links to related files (rules/config/content).
- Defines **session-init** (`player-data/session-init.json`), which the player provides at startup (copy-paste into Cascade).
- Has a minimal **Host Adapter interface** (platform-agnostic): engine core works through operations like `readFile/writeFile/listFiles/log`, without vendor lock-in.
- **No HTTP endpoints/server and no DB**: persistence is through **centralized JSON files**.

##### Entry & Session Contracts (file-first)

- `manifest/entry.json` is the single source of truth for:
  - game identity and version
  - engine compatibility range
  - engine layers: `engine_layers` (array of npm packages, e.g. `[@agentrpg/engine, @my/game-engine-custom]`; a custom layer is optional — if absent, the engine runs with core only)
  - enabled capabilities
  - canonical paths to content/config/schemas/ui
  - start entrypoint (e.g. start scene)

- `player-data/session-init.json` contains only parameters for starting a session (without content), e.g.:
  - which game to start (path/id)
  - player profile (name)
  - optional save to load / run id

##### Save model (file-based, no DB)

- Save files live under `player-data/saves/`.
- `player-data/saves/index.json` lists saves (minimum: `save_id`, `created_at`, `scene_id`, `summary`, `file_path`) and can be extended during development.
- Each save stores a canonical state snapshot + cursor (e.g. `scene_id` + `turn_id`/`step_id`), without copies of `ui/*.json`.

##### Folder ownership

- The game package ships with the folders and initial template files for `ui/` and `player-data/`.
- Engine/GM update runtime output during play; the UI and player do not edit `player-data/`.

##### UI (read-only) and runtime output

UI is not part of the engine; UI can ship with the game (e.g. NextJS). The engine provides a stable **file-based UI contract**:

- Fixed paths:
  - `ui/scene.json`
  - `ui/actions.json`
  - `ui/hud.json`
  - `ui/history.json`
  - `ui/index.json`

- Runtime output model:
  - engine core can provide a template/skeleton
  - GM/LLM updates UI files every “turn”
  - UI **only reads and renders** (read-only)
  - Player input is provided only via chat (Windsurf), not through the UI

- `ui/actions.json` contains **suggested actions**, but is not exhaustive. The player may suggest another action, and the GM/LLM must keep the player **within bounds** according to the world/era/rules (e.g. no smartphone in the stone age, no time travel if the game does not allow it, but walking to the nearby village should still be possible even if not explicitly mentioned in the scenario).

- `ui/scene.json` contains at minimum:
  - `scene_id`, `title`, `description`, `location`, `npcs_present`, `timestamp`

- History:
  - `ui/history.json` stores the last **N** events/turns (default **N=20**) + a link to the full history
  - the full history is an append-only JSONL log: `player-data/runtime/history.full.jsonl`

- `ui/index.json` acts as a UI manifest:
  - pointers to `ui/*.json`
  - schema versions for each UI output file (map by file path, e.g. `ui/scene.json` -> `schemas/ui.scene.v1.json`)
  - pointers to `player-data/` (e.g. saves index + full history)

##### Player data / portability

- Progress data is portable and stored inside the game, under `player-data/`.
- `player-data/` is **engine-managed**.
- Save files live under `player-data/saves/`.

##### Schemas / Contracts

The engine publishes schemas/contracts and versions them (major version), e.g.:
- `schemas/ui.scene.v1.json`
- `schemas/state.v1.json`

##### Capabilities (examples)

Engine-level capabilities (the game can disable some per game):
- `health`, `mana`, `stamina`
- `inventory`, `equipment`, `encumbrance/strength`
- `skills`, `level`, `progress`
- `quests`
- `date_time`
- (additional examples): `currency`, `status_effects`, `factions/reputation`, `relationships`, `flags`, `location`, `journal/log`

##### Combat

- Turn-based combat in v1, initial implementation with a feel similar to “The Legend of the Green Dragon”, with a perspective for adding other combat systems.

##### Upgrade-friendly customization (override layer)

- The engine is an open-source npm package, but allows “painless” customization via the **core engine + per-game custom engine layer** model:
  - **Core engine**: the official upstream npm package (e.g. `@agentrpg/engine`)
  - **Per-game custom engine layer**: a separate npm package for the specific game that *depends on* the core engine and adds/overrides:
    - capabilities (engine-level additions)
    - configs
    - schemas/contracts

- This custom layer is integrated via **official extension points** (concept), so upgrading the core engine becomes a dependency update without losing custom changes (mechanism details are clarified in a follow-up specification).

## Step 3 — Target Users

### Primary Users

#### Primary Persona A: Engine-Dev (Structured)

- **Name & Context:** Alex, 29. A self-taught/indie engine-dev who can edit JSON/YAML and “wire” interactions between files. Publishes as a GitHub repo that is packaged as an npm package.
- **What matters most:** contracts, extensibility, determinism.
- **Success (30–60 min prototype):**
  - Playable slice: a small village + NPCs/objects + at least 1 main quest that can be completed.
  - Save/load data is stored in the game, but the mechanism is provided by the engine.

#### Primary Persona B: Prompt-first Creator (v1 target)

- **Name & Context:** Mira, 24. Gamer/creator who wants “LLM + idea → game” with minimal edits (mostly templates and the entry file).
- **Definition of playable:** chat loop (UI is nice-to-have).
- **Biggest friction:** “where do I write the scenario”
- **Resolved by convention:**
  - The scenario lives in `games/<gameId>/scenario/`, with `scenario/index.md` as the entry point (with links to smaller files).

### Secondary Users

- **Gamers (players):** people who want to play an LLM-driven RPG; some may evolve into prompt-first creators.

### User Journey

#### Onboarding & Switching (shared concept)

- **Games workspace:** games live in `games/<gameNameWithID>/...` (not part of the engine npm package). Easiest flow: zip archive → unzip into `games/`.
- **Start / Switch game:** to start/switch a game, the LLM reads `games/<gameId>/manifest/entry.json`.
- **Scenario navigation:** `games/<gameId>/scenario/index.md` describes “what is expected” and points to modular parts of the scenario (to fit in the context window).
- **Capabilities selection:** `games/<gameId>/config/capabilities.json` describes which capabilities/metrics from the engine are used (e.g. `mana: off`, `health: on`), and `manifest/entry.json` points to this file.

#### Scenario Navigation Contract (S3 hybrid + active quest state)

- `scenario/index.md` is a catalog with links to `scenario/areas/*` and `scenario/quests/*` + short navigation rules.
- After `scenario/index.md`, the LLM/GM first reads `scenario/quests/main-quest-01.md` to gain focus and a goal for the game. The main quest may not be active/revealed from the start; the file describes appearance/activation conditions, but the GM is not required to “spoil” it before it becomes relevant.
- By default the GM opens only files needed for the current situation: the current area (by `current_area_id` in canonical state) + relevant active quests/parts.
- If the player abandons the current quest, the GM should review all active quests (per canonical state) and provide a list for choosing a new quest, or continue exploration without choosing.
- **Active quests** are stored in `player-data/runtime/state.json` as an array of objects:
  ```json
  "active_quests": [
    {"quest_id": "main-quest-01", "status": "active", "progress": 0, "current_step_id": "step-01", "flags": {"met_npc": false}},
    {"quest_id": "side-quest-01", "status": "active", "progress": 0}
  ]
  ```
- **Unlocked quests** live in `scenario/quests/available.json`; unlock conditions are in `scenario/quests/unlock-triggers.json`.
- The GM shows the active quest list only when: (a) the player explicitly asks, (b) the player abandons the current quest.
- **Completed quests**: file `player-data/runtime/completed-quests.json` (or a field in state.json) with `{ quest_id, title, completed_at }`. Player-facing lists are by title, not ID.
- **Exploration mode**: after the main quest ends, the GM continues to offer exploration within the setting (keeps the player in-world; does not allow an “Apple Store” in medieval times).
- **Validation on start**: checks required files (entry, scenario/index, available, unlock-triggers, completed-quests placeholder). If required files/capabilities are missing → error.
- **World frame for exploration**: `scenario/world/index.md` (or `.../setting.md`) describes era/setting, allowed technologies/magic, taboos/boundaries, and tone. During exploration the GM uses this file + `current_area_id`, rejects out-of-bounds requests, and redirects to a nearby allowed option.
- **Validation (structure + fallbacks):**
  - Checks presence/format: `manifest/entry.json`, `scenario/index.md`, `scenario/quests/available.json`, `scenario/quests/unlock-triggers.json`, `player-data/runtime/state.json` (or placeholder), `player-data/runtime/completed-quests.json` (or empty array), (optional) `scenario/world/index.md`.
  - `available.json`: map/array `quest_id -> title` (canonical for ID ↔ title).
  - `unlock-triggers.json`: `quest_id -> condition/flag`.
  - `state.json`: `active_quests` with no fixed limit; each has `quest_id`, `status`, `progress`, `current_step_id`, `flags`; `title` can be resolved from `available.json`.
  - If `completed-quests.json` is missing → create an empty array `[]`.
- **Error reporting (debug mode):** validation errors are reported in chat by the GM/LLM; in normal mode only blocking issues (error) are shown, while in debug mode info/warn/error are shown. Debug is enabled if at startup the GM receives an indication/message “debug” (can be text in the startup message or a field `debug: true` in session-init); the GM records locally that it is in debug (file/flag). Format: `[LEVEL] file:message (suggested fix)` + context (quest_id/area if relevant).
- **Exploration log (new places requested by the player):** `player-data/runtime/exploration-log.json` (or YAML) stores GM-approved new locations/cities/MCP/side-quest hooks added during free exploration; uses the same ID ↔ title model (the player sees title, the GM works with ID). Recommended fields: `{ id, title, type ["city","landmark","dungeon","mcp","side-quest-hook","poi"], area_id?, description?, added_at (UTC ISO8601), tags[], origin: "player-request"|"gm-suggested" }`. No additional player confirmation is required; after approval the GM writes it and continues the story. The file is required if the game supports free exploration; if missing and exploration is used → auto-create an empty template.
- **Error reporting (debug mode):** validation errors are reported in chat by the GM/LLM; in normal mode only blocking issues (error) are shown, while in debug mode info/warn/error are shown. Debug is enabled if at startup the GM receives an indication/message “debug” (can be text in the startup message or a field `debug: true` in session-init); the GM records locally that it is in debug (file/flag). Format: `[LEVEL] file:message (suggested fix)` + context (quest_id/area if relevant).
- **Quest ID ↔ Title:** the GM works with `quest_id`, but shows `title` to the player (resolved from `available.json` or the same canonical map). On mismatch (missing title or duplicate title/ID) → error and block start/load; the GM also warns if the player requests a quest with an existing/similar title.
- **Developer onboarding definition:** for Persona B, the first “successful onboarding” is a ready game with 1 working quest that includes at least one combat and at least one NPC.
- **Language preference:** at start the GM asks “Which language/style?” (e.g. EN/DE/BG/Pirate English); the choice is stored in `player-data/session-init.json` as `preferred_language`. The engine does not translate; the GM/LLM communicates in the chosen language/style even if files are in another language. No alternative indexes/i18n folders in v1.
- **Orphan protections and fallbacks:** if there are `active_quests` without a corresponding quest file → the GM creates an empty template for that quest (but logs an error); if `current_area_id` points to a missing area → fallback to default area + error. Missing exploration-log when exploration is enabled is auto-created from a template.
- **Samples/blank game:** the engine provides sample templates (blank game) without metrics, only required files + instructions for building a game by engine rules.
- **Language persistence:** the language is stored in exactly one place (`preferred_language` in session-init) and the GM updates it on change; on restart the GM reads `preferred_language` and can confirm to the player.
- **Metrics (for Step 4 preparation):** added the proposed ones: avg exploration-log entries per session; % sessions with debug enabled; avg retries to pass validation; plus the core ones (time-to-first-active-quest, % successful refusals/switches without dead-end, validation pass rate, % sessions with ≥1 completed quest).
- **Blank game (samples/blank-game/):** a copyable skeleton with a valid structure and instructions: manifest/entry.json; scenario/index.md; scenario/quests/available.json; scenario/quests/unlock-triggers.json; scenario/areas/default-area.md; player-data/runtime/state.json; completed-quests.json; exploration-log.json; player-data/session-init.json (with preferred_language placeholder); config/capabilities.json; README.md with instructions.
- **Orphans auto-remedy:** missing quest file for quest_id in active → GM creates a template (id, title from available, summary “auto-created”, steps: []) and logs an error; missing area for current_area_id → fallback to default-area.md + error; duplicate titles in available → ERROR, GM may suggest rename.
- **Debug semantics:** enabled by “debug” in the startup message or `debug: true` in session-init; disabled on new restart or explicit `debug: false`. WARN/ERROR/INFO format: `[LEVEL][CODE] file:message (suggested fix) [ctx]`.
- **Language UX:** startup prompt “Choose language/style…”; a change in session updates `preferred_language` (single place) and the GM confirms; on restart the GM reads `preferred_language` and confirms.
- **Metrics (detail):** time-to-first-active-quest (minutes from start to first active quest); % successful refusals/switches without dead-end (valid list/next step after refusal); validation pass rate (% starts without critical ERRORs, with problem description from GM/LLM); % with ≥1 completed quest; avg exploration-log entries per session; % sessions with debug enabled; avg retries to pass validation.
  - **Capabilities (ranges/examples):** default examples: health ≤0 → the hero is done → GM asks for load; energy ≥0 (can be 0). Goal: provide example ranges/constraints in templates (without fixed values in blank game).
  - **Capability value guardrails (v1 baseline):**
    | Capability | Allowed range/type | Rationale / GM reaction |
    |------------|-----------------------|-------------------------|
    | `health` | `[0, 100]` (min 0, max 100 by default) | <0 is not allowed → GM marks `dead` and directs to load/save. |
    | `energy`, `stamina` | `[0, 100]` | No negative value; 0 means exhausted hero → needs rest. |
    | `mana` | `[0, 100]` | Cannot drop below 0; if spell requires more mana → GM blocks the action. |
    | `hunger`, `thirst` | `[0, 100]` (0=satiated, 100=critical) | GM monitors thresholds (e.g. >80 → priority task). |
    | `morale` | `[-100, 100]` | < -20 leads to penalty (GM describes fear/panic); > 20 → morale bonus / confidence. |
    | `reputation.*` | `[-100, 100]` | Negative values are allowed, but limited to three-digit bounds for readability. |
    | `currency.gold` | `>=0`, no upper bound (Signed 32-bit int recommendation) | Negative sums are forbidden; on purchase GM checks that the remaining amount stays ≥0. |
    | `level` / `skill_ranks` | `>=1` (no zero/negative level) | Blank game templates set `min: 1`; GM validates at runtime if dev enters 0/-1. |
    | `status_effects.*.stack` | `>=0` (integer) | No negative stack; 0 = no effect. |
    | `date_time` | ISO8601, years ≥0001 | Consistency during serialization. |
    | `flags.*` | bool | True/false; no “null” as an unlock value. |
- **GM validation & messaging:** the GM validates on start; if it auto-creates a quest template, it reports the path and what to fill in; for missing/duplicate capabilities it returns an ERROR with a suggested fix.
- **Blank game README (LLM-friendly):** contains steps for LLM/dev: copy `samples/blank-game/`; fill `available`, `state`, area; set `preferred_language`; fill capabilities; start the game (GM validation); add quests while playing; follow remediation guidance for fixes/orphans.
- **Language prompt example:** “Choose language/style (e.g., English, Bulgarian, Pirate English, sarcastic English).”
- **Capabilities catalog:** the engine provides a master list (~29 categories, 300+ capabilities) as a base (see Appendix `docs/analysis/capabilities-catalog.md`); games select a subset via `config/capabilities.json` and can add their own.
- **Blank game README:** example steps + sample `config/capabilities.json` and `state.json` in `docs/analysis/blank-game-README.md` (LLM-friendly instructions).
- **GM validation checklist (short):** on start check required files; validate capabilities (CAP-* errors block); format messages `[LEVEL][CODE] file:message (suggested fix)`; WARN ≠ blocking, but the GM reports them; if it auto-creates a quest/area → logs and explains what to fill in.
- **HUD (ui/hud.json) skeleton (recommendation):**
  ```json
  {
    "schema_version": "ui.hud.v1",
    "bars": {"health": {"current": 32, "max": 100}, "energy": {"current": 12, "max": 100}, "mana": {"current": 0, "max": 100}},
    "status_effects": [{"id": "poisoned", "stack": 0}, {"id": "stunned", "active": false}],
    "reputation": {"guild": 15, "village": -5},
    "currency": {"gold": 120},
    "needs": {"hunger": 20, "thirst": 10, "fatigue": 5}
  }
  ```

## Step 4 — Metrics

### Primary Metrics (v1)
- **Time-to-first-active-quest**: minutes from session start to the first addition to `active_quests`.
- **% successful refusals/switches without dead-end**: number of refusals/switches where the GM provides a valid list/next step ÷ total refusals/switches.
- **Validation pass rate**: % of starts without critical ERRORs (the GM describes the problem on fail).
- **% with ≥1 completed quest**: share of sessions where `completed-quests.json` has at least one record.

### Secondary / Diagnostic
- **Avg exploration-log entries per session**.
- **% sessions with debug enabled**.
- **Avg retries to pass validation**: how many starts/fixes a dev performs before validation passes.
- **% starts with CAP-* errors** (blocking capabilities validation).
- **Avg time to validation pass** (including CAP-* fixes).

### Notes
- Validation results are communicated by the GM in chat (in debug mode — detailed info/warn/error).
- If validation fails → the dev can retry after a fix; the “avg retries” metric measures this loop.
- Exploration-log can be read partially (last ~10), but full data is available on request.
- Capabilities diagnostics (CAP-*): telemetry for % starts with errors and time-to-fix; details in Appendix/README.

### Target users (recap)
- Persona A (GM/LLM facilitator): wants clear rules, a HUD/scene contract, validation codes, and fast diagnostic signals.
- Persona B (game dev): wants minimal scaffolding (blank game), file contracts, a capabilities guide, a validator with clear errors/fixes, and telemetry for “how quickly I pass validation”.
- Persona C (player-facing UI dev): reads ui/* read-only; no backend.
- Persona D (analyst/QA): works with telemetry/JSON logs and snapshots; cares about % CAP errors, time to pass, and warning counts by code.

### Capabilities contract (v1)
- `config/capabilities.json` is required; snake_case keys; `enabled` boolean; ranges via `min/max` or `range` (instead of min/max).
- Runtime lives in `player-data/runtime/state.json` under `stats`; all enabled capabilities must have values. CAP-RUNTIME-RANGE is blocking, CAP-UNKNOWN-RUNTIME is warn.

### Metrics wiring (validator → telemetry)
- The validator (tools/validator) outputs JSON + a telemetry log; it is run locally before release.
- Diagnostics: top_codes, errors/warns, CAP error count; snapshot shows New/Resolved codes between runs.
- Recommended local loop: `npm run validate -- --path games/<id> --json reports/last.json --append --snapshot reports/last.json --strict --summary`.
- Interpretation: if Summary:0/0 and CAP errors:0 → done; if snapshot New codes is empty and Resolved contains previous problems → clean.
- Validation results are communicated by the GM in chat (in debug mode — detailed info/warn/error).
- If validation fails → the dev can retry after a fix; the “avg retries” metric measures this loop.
- Exploration-log can be read partially (last ~10), but full data is available on request.
- Capabilities diagnostics (CAP-*): telemetry for % starts with errors and time-to-fix; details in Appendix/README.

#### Latest measurements (22 Dec 2025)
| Metric | Value | Source |
|-----------|----------|----------|
| Avg run time | ~103 ms (150 ms, 17 ms, 143 ms) | `telemetry-history.json` |
| Avg number of warnings | 1.67 → reduced to 0 after the last run | `telemetry-history.json` |
| Top codes before fix | `SCHEMA-NOT-AVAILABLE` (2×), `MANIFEST-FIELD` (1×), `CAP-UNKNOWN-RUNTIME` (1×) | `telemetry-history.json` |
| Definition of Done | 3 consecutive runs with `errors=0`, `warnings=0`, CAP errors = 0 <br> + avg time <200 ms + snapshot `New codes = none` | Current practice |

*Note:* the latest run `dev-20251222-1548a` meets DoD (0 warnings/errors, snapshot clean). Next teams should archive telemetry when ≥50 entries are added or after a release (@docs/analysis/reports/telemetry-history.json#1-63).
