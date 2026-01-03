# AgentRPG Engine — Story Catalog (Sprint 01)

_Last updated: 2025-12-31_
 
## ST-001 — Validator DoD CLI Enhancements (FR-01)
Status: done. CLI flags, telemetry/snapshot DoD flow.
 
## ST-002 — Capabilities Guardrails Schema (FR-04)
Status: done. JSON schema with ranges + validator enforcement.
 
## ST-003 — Metrics Automation Script (FR-07 / T-06)
Status: done. `npm run metrics:report` + automatic KPI report.
 
## ST-004 — Telemetry Retention Automation (FR-02)
Status: done. Archiving telemetry history via CLI.
 
## ST-005 — Run ID Helper Integration (FR-03)
Status: done. Helpers for run-id + required flag.

## ST-006 — Runtime State Schema Alignment (T-03)
Status: done. State schema + validator checks.

## ST-007 — Quest & Scenario Contract Validation (FR-05)
Status: done. Checks for orphan quests, triggers, links.

## ST-008 — Exploration Logging Enforcement (FR-06)
Status: done. Schema + validator for exploration log.

## ST-009 — Metrics Insights Dashboard Doc (FR-07)
Status: done. Insights markdown with alerts and recommendations.

## ST-010 — TypeScript Tooling Bootstrap (EP-004)
Status: done. TS configuration, shared types package.

## ST-011 — Engine Core Type Definitions (EP-004)
Status: done. Shared types for capabilities/state/quests.

## ST-012 — Validator CLI Migration to TypeScript (EP-004)
Status: done. CLI rewritten in TS + tests.

## ST-013 — Runtime UI + Saves/History Contracts (Product Brief MVP)
Status: done. Runtime pointers in manifest + schema/validator for ui/* and saves/history.

## ST-014 — Host Adapter Contract (runtime)
Status: done. HostAdapter + reference LocalFsHostAdapter + runtime loader smoke test.

## ST-015 — Session Init Contract (language + debug)
Status: done. Schema + type for player-data/session-init.json + validator schema check.

## ST-016 — Auto-remedy Tooling (init + scaffolds)
Status: done. Tools for exploration:init and quest:scaffold + test.

## ST-017 — Save File Contract + Minimal Load Support
Status: ready-for-dev. Save schema + validator + minimal runtime load smoke.

## ST-018 — Completed Quests Contract (schema + validation)
Status: ready-for-dev. Schema + stricter checks for completed-quests.

## ST-019 — Manifest Entry Contract (schema + engine compatibility)
Status: ready-for-dev. Schema for manifest/entry.json + engine_layers/compat.

## ST-020 — World Frame Contract (scenario/world)
Status: ready-for-dev. Contract for scenario/world/index.md + validator checks.

## ST-021 — Orphan Auto-remedy (quests/areas)
Status: ready-for-dev. Tooling for scaffold/fallback on orphan state references.

## ST-022 — Quest Authoring Tool (quest:add)
Status: ready-for-dev. CLI for adding quest markdown + sync of available/unlock + optional automation.

## ST-023 — Area Authoring Tool (area:add)
Status: ready-for-dev. CLI for scaffolding area markdown with guardrail-friendly placeholders.

## ST-024 — Scenario Index Generator (scenario:index)
Status: ready-for-dev. CLI for regenerating scenario/index.md (quests/areas tables).

## ST-025 — Economy Rewards Report (economy:report)
Status: ready-for-dev. Aggregation of quest rewards into a summary + optional JSON report.

## ST-026 — Telemetry Publish & Sync Tooling
Status: ready-for-dev. Publish/copy artifacts + sync to centralized staging (local/S3) with dry-run.

## ST-027 — Validate + Metrics Wrapper (validate:metrics)
Status: ready-for-dev. Single command: validate + telemetry + metrics report + auto-archive option.

## ST-028 — Pre-push Hook (validate + metrics)
Status: ready-for-dev. Opt-in pre-push hook scripts (sh/ps1) for an automatic DoD gate.

## ST-029 — Docs Alignment / MVP Docs Freeze
Status: ready-for-dev. Sync MVP docs with the real CLI/validator (archive validation-plan, clean up drifts).

## ST-030 — Runtime CLI (load snapshot)
Status: done. Official CLI entrypoint `npm run runtime` for loading runtime snapshot (manifest + session-init + state) and console output.

## ST-031 — Repo TS-only Policy (no JS sources in git)
Status: in-progress. `dist/` is build output (not committed) + tooling for inventory/enforcement of `.js` source.

## ST-032 — Map Assets & Metadata Contracts
Status: drafted. Manifest pointers, maps/ directory structure, JSON schema за world/area карти и image конвенции.

## ST-033 — Runtime State & Telemetry Updates
Status: drafted. Обновен state schema с `current_location`/`visited_locations` + telemetry за movement.

## ST-034 — Map Validator Rules & Tooling
Status: drafted. `map:add` scaffolder, validator MAP-* кодове, minimap генератор.

## ST-035 — UI & World Atlas Integration
Status: drafted. HUD mini-map, World Atlas UI файлове и документация за GM/LLM map UX.
