# AgentRPG Engine — Epics & Stories Roadmap (v1)

_Last updated: 2025-12-31_

## Overview
Full breakdown of all planned epics, user stories, and technical tasks before starting execution workflows. All story files follow the standardized template and are marked `ready-for-dev`, unless explicitly stated otherwise.

## Epic Summary
| Epic ID | Name | Goal | Linked Stories |
|---------|------|------|----------------|
| EP-001 | Validator Reliability & CLI DoD | One command for DoD, telemetry, and snapshot guardrails. | ST-001, ST-004, ST-005 |
| EP-002 | Capabilities & Scenario Guardrails | Strict schemas and contract validation for capabilities, state, and quests. | ST-002, ST-006, ST-007, ST-008 |
| EP-003 | Observability & Metrics Automation | Full traceability of metrics and telemetry archiving. | ST-003, ST-009 |
| EP-004 | TypeScript Migration & Tooling | Migrating core engine and validator to TypeScript with typed contracts. | ST-010, ST-011, ST-012 |
| EP-005 | Runtime Contracts & MVP Closure | File-first runtime contracts + schemas + minimal runtime loader + MVP gap closure. | ST-013, ST-014, ST-015, ST-016, ST-017, ST-018, ST-019, ST-020, ST-021 |
| EP-006 | Content Tooling & Workflow Glue (MVP) | Official helper tools (README) for authoring/pipelines + repeatable local DoD workflow glue. | ST-022, ST-023, ST-024, ST-025, ST-026, ST-027, ST-028, ST-029, ST-030 |
| EP-007 | Repo TS-only Policy & Tooling Migration | Remove JS source from git + `dist/` as build output (not committed) + migrate tools to TS. | ST-031 |
| EP-008 | Map & Location Awareness | World + area maps with hotspots, runtime state tracking, validator/tooling support, and HUD mini-maps. | ST-032, ST-033, ST-034, ST-035 |

## Story Breakdown
### EP-001 — Validator Reliability & CLI DoD
1. **ST-001 Validator DoD CLI Enhancements** — CLI flags, combined runs, snapshot + telemetry artifacts.
2. **ST-004 Telemetry Retention Automation** — `npm run archive:telemetry` + README instructions.
3. **ST-005 Run ID Helper Integration** — cross-shell run-id tooling and mandatory `--run-id` flag.

### EP-002 — Capabilities & Scenario Guardrails
1. **ST-002 Capabilities Guardrails Schema** — JSON schema + validator enforcement.
2. **ST-006 Runtime State Schema Alignment** — `state.schema.json` + runtime checks for nested maps.
3. **ST-007 Quest & Scenario Contract Validation** — orphan quests, invalid unlock references, link consistency.
4. **ST-008 Exploration Logging Enforcement** — schema + validator warnings for exploration log (FR-06).

### EP-003 — Observability & Metrics Automation
1. **ST-003 Metrics Automation Script** — `npm run metrics:report`, KPI report.
2. **ST-009 Metrics Insights Dashboard Doc** — KPI analysis and recommendations (markdown + charts placeholder).

### EP-004 — TypeScript Migration & Tooling
1. **ST-010 TypeScript Tooling Bootstrap** — add TS configuration, build scripts, shared types package.
2. **ST-011 Engine Core Type Definitions** — typing the core engine (scenario/state/capabilities contracts).
3. **ST-012 Validator CLI Migration to TS** — rewrite CLI entrypoints and tests in TS, integrate AJV types.

### EP-005 — Runtime Contracts & MVP Closure
1. **ST-013 Runtime UI + Saves/History Contracts** — runtime pointers in manifest + schema/validator for ui/* and saves/history.
2. **ST-014 Host Adapter Contract (runtime)** — HostAdapter + LocalFsHostAdapter + runtime loader smoke test.
3. **ST-015 Session Init Contract (language + debug)** — schema/type + validator schema check.
4. **ST-016 Auto-remedy Tooling (init + scaffolds)** — exploration:init and quest:scaffold.
5. **ST-017 Save File Contract + Minimal Load Support** — schema for save file + validator + minimal load.
6. **ST-018 Completed Quests Contract (schema + validation)** — schema + stricter checks.
7. **ST-019 Manifest Entry Contract (schema + engine compatibility)** — manifest schema + engine_layers/compat.
8. **ST-020 World Frame Contract (scenario/world)** — world frame file + validator checks.
9. **ST-021 Orphan Auto-remedy (quests/areas)** — remediation tooling for orphan state references.

### EP-006 — Content Tooling & Workflow Glue (MVP)
1. **ST-022 Quest Authoring Tool (quest:add)** — CLI to add quest markdown + sync `available.json` / `unlock-triggers.json`.
2. **ST-023 Area Authoring Tool (area:add)** — CLI scaffold for area markdown with guardrail-friendly placeholders.
3. **ST-024 Scenario Index Generator (scenario:index)** — CLI to regenerate `scenario/index.md` (quests/areas overview).
4. **ST-025 Economy Rewards Report (economy:report)** — aggregated rewards report (console + optional JSON).
5. **ST-026 Telemetry Publish & Sync Tooling** — publish/copy + sync to a central staging (local/S3) with dry-run.
6. **ST-027 Validate + Metrics Wrapper (validate:metrics)** — validate + telemetry + metrics report + auto-archive.
7. **ST-028 Pre-push Hook (validate + metrics)** — opt-in pre-push hook (sh/ps1) for DoD gating.
8. **ST-029 Docs Alignment / MVP Docs Freeze** — sync MVP docs with the real CLI/validator and clean up drift.
9. **ST-030 Runtime CLI (load snapshot)** — official CLI entrypoint `npm run runtime` to load a runtime snapshot and print console output.

### EP-007 — Repo TS-only Policy & Tooling Migration
1. **ST-031 Repo TS-only Policy (no JS sources in git)** — `dist/` is build output (not committed) + tooling for inventory/enforcement of `.js` source.

### EP-008 — Map & Location Awareness
1. **ST-032 Map Assets & Metadata Contracts** — manifest pointers, maps directory structure, JSON schema for world/area maps, image conventions.
2. **ST-033 Runtime State & Telemetry Updates** — extend `state.json` with `current_location`, `visited_locations`, guardrails + telemetry capture.
3. **ST-034 Validator & Tooling for Maps** — validator rules for map references, CLI `map:add` scaffolder, ASCII/minimap generation.
4. **ST-035 UI & World Atlas Integration** — HUD mini-map output, world atlas view wiring, documentation for GM/LLM usage.

## Status Legend
- `ready-for-dev`: The story file is complete and can be started via `dev-story`.
- `backlog`: The story is defined but requires additional input (noted in the file itself).

## Next Steps
1. Create individual story files (by template) for all ST-001 … ST-012.
2. Fill in `docs/sprint-artifacts/sprint-status.yaml` with `development_status` entries marked `ready-for-dev`.
3. Update the architecture documentation with the TypeScript strategy (EP-004 dependencies).
4. After validating artifacts → start `dev-story` for the selected story.
