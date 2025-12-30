# AgentRPG Engine — Story Catalog (Sprint 01)

_Last updated: 2025-12-30_

## ST-001 — Validator DoD CLI Enhancements (FR-01)
Status: done. CLI флагове, telemetry/snapshot DoD поток.

## ST-002 — Capabilities Guardrails Schema (FR-04)
Status: done. JSON schema с диапазони + validator enforcement.

## ST-003 — Metrics Automation Script (FR-07 / T-06)
Status: done. `npm run metrics:report` + KPI авто отчет.

## ST-004 — Telemetry Retention Automation (FR-02)
Status: done. Архивиране на telemetry history чрез CLI.

## ST-005 — Run ID Helper Integration (FR-03)
Status: done. Хелпери за run-id + задължителен флаг.

## ST-006 — Runtime State Schema Alignment (T-03)
Status: done. State schema + validator checks.

## ST-007 — Quest & Scenario Contract Validation (FR-05)
Status: done. Проверки за orphan quests, triggers, links.

## ST-008 — Exploration Logging Enforcement (FR-06)
Status: done. Schema + validator за exploration лог.

## ST-009 — Metrics Insights Dashboard Doc (FR-07)
Status: done. Insights markdown с alerts и препоръки.

## ST-010 — TypeScript Tooling Bootstrap (EP-004)
Status: done. TS конфигурация, shared types пакет.

## ST-011 — Engine Core Type Definitions (EP-004)
Status: done. Общи типове за capabilities/state/quests.

## ST-012 — Validator CLI Migration to TypeScript (EP-004)
Status: done. CLI пренаписан в TS + тестове.

## ST-013 — Runtime UI + Saves/History Contracts (Product Brief MVP)
Status: done. Runtime pointers в manifest + schema/валидатор за ui/* и saves/history.

## ST-014 — Host Adapter Contract (runtime)
Status: done. HostAdapter + референтен LocalFsHostAdapter + runtime loader smoke тест.

## ST-015 — Session Init Contract (language + debug)
Status: done. Schema + тип за player-data/session-init.json + validator schema check.

## ST-016 — Auto-remedy Tooling (init + scaffolds)
Status: done. tools за exploration:init и quest:scaffold + тест.

## ST-017 — Save File Contract + Minimal Load Support
Status: ready-for-dev. Save schema + валидатор + минимален runtime load smoke.

## ST-018 — Completed Quests Contract (schema + validation)
Status: ready-for-dev. Schema + по-строги проверки за completed-quests.

## ST-019 — Manifest Entry Contract (schema + engine compatibility)
Status: ready-for-dev. Schema за manifest/entry.json + engine_layers/compat.

## ST-020 — World Frame Contract (scenario/world)
Status: ready-for-dev. Контракт за scenario/world/index.md + validator checks.

## ST-021 — Orphan Auto-remedy (quests/areas)
Status: ready-for-dev. Tooling за scaffold/fallback при orphan state references.

## ST-022 — Quest Authoring Tool (quest:add)
Status: ready-for-dev. CLI за добавяне на quest markdown + sync на available/unlock + опционални automation-и.

## ST-023 — Area Authoring Tool (area:add)
Status: ready-for-dev. CLI за scaffold на area markdown с guardrail-friendly placeholder-и.

## ST-024 — Scenario Index Generator (scenario:index)
Status: ready-for-dev. CLI за регенерация на scenario/index.md (quests/areas таблици).

## ST-025 — Economy Rewards Report (economy:report)
Status: ready-for-dev. Агрегация на quest rewards към summary + optional JSON отчет.

## ST-026 — Telemetry Publish & Sync Tooling
Status: ready-for-dev. Publish/copy артефакти + sync към централен staging (локално/S3) с dry-run.

## ST-027 — Validate + Metrics Wrapper (validate:metrics)
Status: ready-for-dev. Една команда: validate + telemetry + metrics report + auto-archive опция.

## ST-028 — Pre-push Hook (validate + metrics)
Status: ready-for-dev. Opt-in pre-push hook скриптове (sh/ps1) за автоматичен DoD gate.

## ST-029 — Docs Alignment / MVP Docs Freeze
Status: ready-for-dev. Синхронизация на MVP docs с реалния CLI/валидатор (архивиране на validation-plan, почистване на drift-ове).

## ST-030 — Runtime CLI (load snapshot)
Status: ready-for-dev. Официален CLI entrypoint `npm run runtime` за зареждане на runtime snapshot (manifest + session-init + state) и консолен output.
