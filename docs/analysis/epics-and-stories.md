# AgentRPG Engine — Epics & Stories Roadmap (v1)

_Last updated: 2025-12-31_

## Overview
Пълна разбивка на всички планирани епики, user stories и технически задачи преди стартиране на изпълнителните workflows. Всички story файлове ще следват стандартизирания шаблон и ще бъдат маркирани `ready-for-dev`, освен ако изрично е посочено друго.

## Epic Summary
| Epic ID | Name | Goal | Linked Stories |
|---------|------|------|----------------|
| EP-001 | Validator Reliability & CLI DoD | Единна команда за DoD, telemetry и snapshot guardrails. | ST-001, ST-004, ST-005 |
| EP-002 | Capabilities & Scenario Guardrails | Строги схеми и контракт валидации за capabilities, state и quests. | ST-002, ST-006, ST-007, ST-008 |
| EP-003 | Observability & Metrics Automation | Пълна проследимост на метриките и telemetry архивиране. | ST-003, ST-009 |
| EP-004 | TypeScript Migration & Tooling | Прехвърляне на core engine и validator към TypeScript с типови договори. | ST-010, ST-011, ST-012 |
| EP-005 | Runtime Contracts & MVP Closure | File-first runtime contracts + schemas + minimal runtime loader + MVP gap closure. | ST-013, ST-014, ST-015, ST-016, ST-017, ST-018, ST-019, ST-020, ST-021 |
| EP-006 | Content Tooling & Workflow Glue (MVP) | Official helper tools (README) за authoring/pipelines + repeatable local DoD workflow glue. | ST-022, ST-023, ST-024, ST-025, ST-026, ST-027, ST-028, ST-029, ST-030 |
| EP-007 | Repo TS-only Policy & Tooling Migration | Премахване на JS source от git + `dist/` като build output (не се комитва) + миграция на tools към TS. | ST-031 |

## Story Breakdown
### EP-001 — Validator Reliability & CLI DoD
1. **ST-001 Validator DoD CLI Enhancements** — CLI флагове, комбинирани run-и, snapshot + telemetry артефакти.
2. **ST-004 Telemetry Retention Automation** — `npm run archive:telemetry` + README инструкции.
3. **ST-005 Run ID Helper Integration** — cross-shell run-id tooling и задължителен `--run-id` флаг.

### EP-002 — Capabilities & Scenario Guardrails
1. **ST-002 Capabilities Guardrails Schema** — JSON schema + validator enforcement.
2. **ST-006 Runtime State Schema Alignment** — `state.schema.json` + runtime checks за nested maps.
3. **ST-007 Quest & Scenario Contract Validation** — orphan quests, invalid unlock references, link consistency.
4. **ST-008 Exploration Logging Enforcement** — schema + validator warnings за exploration log (FR-06).

### EP-003 — Observability & Metrics Automation
1. **ST-003 Metrics Automation Script** — `npm run metrics:report`, KPI отчет.
2. **ST-009 Metrics Insights Dashboard Doc** — анализ на KPI и препоръки (markdown + charts placeholder).

### EP-004 — TypeScript Migration & Tooling
1. **ST-010 TypeScript Tooling Bootstrap** — добавяне на TS конфигурация, build scripts, shared types пакет.
2. **ST-011 Engine Core Type Definitions** — типизиране на core engine (scenario/state/capabilities contracts).
3. **ST-012 Validator CLI Migration to TS** — пренаписване на CLI entrypoints и тестове в TS, интеграция с AJV types.

### EP-005 — Runtime Contracts & MVP Closure
1. **ST-013 Runtime UI + Saves/History Contracts** — runtime pointers в manifest + schema/валидатор за ui/* и saves/history.
2. **ST-014 Host Adapter Contract (runtime)** — HostAdapter + LocalFsHostAdapter + runtime loader smoke test.
3. **ST-015 Session Init Contract (language + debug)** — schema/тип + validator schema check.
4. **ST-016 Auto-remedy Tooling (init + scaffolds)** — exploration:init и quest:scaffold.
5. **ST-017 Save File Contract + Minimal Load Support** — schema за save file + validator + minimal load.
6. **ST-018 Completed Quests Contract (schema + validation)** — schema + по-строги проверки.
7. **ST-019 Manifest Entry Contract (schema + engine compatibility)** — manifest schema + engine_layers/compat.
8. **ST-020 World Frame Contract (scenario/world)** — world frame файл + validator checks.
9. **ST-021 Orphan Auto-remedy (quests/areas)** — remediation tooling за orphan state references.

### EP-006 — Content Tooling & Workflow Glue (MVP)
1. **ST-022 Quest Authoring Tool (quest:add)** — CLI за добавяне на quest markdown + sync на `available.json` / `unlock-triggers.json`.
2. **ST-023 Area Authoring Tool (area:add)** — CLI scaffold за area markdown с guardrail-friendly placeholder-и.
3. **ST-024 Scenario Index Generator (scenario:index)** — CLI за регенерация на `scenario/index.md` (quests/areas overview).
4. **ST-025 Economy Rewards Report (economy:report)** — агрегиран rewards отчет (console + optional JSON).
5. **ST-026 Telemetry Publish & Sync Tooling** — publish/copy + sync към централен staging (локално/S3) с dry-run.
6. **ST-027 Validate + Metrics Wrapper (validate:metrics)** — validate + telemetry + metrics report + auto-archive.
7. **ST-028 Pre-push Hook (validate + metrics)** — opt-in pre-push hook (sh/ps1) за DoD gate.
8. **ST-029 Docs Alignment / MVP Docs Freeze** — синхронизация на MVP docs с реалния CLI/валидатор и drift почистване.
9. **ST-030 Runtime CLI (load snapshot)** — официален CLI entrypoint `npm run runtime` за зареждане на runtime snapshot и консолен output.

### EP-007 — Repo TS-only Policy & Tooling Migration
1. **ST-031 Repo TS-only Policy (no JS sources in git)** — `dist/` е build output (не се комитва) + инструмент за inventory/enforcement на `.js` source.

## Status Legend
- `ready-for-dev`: Story файлът е завършен и може да бъде стартиран чрез `dev-story`.
- `backlog`: Story файлът е дефиниран, но изисква допълнителен input (ще се отбележи в самия файл).

## Next Steps
1. Създаване на индивидуални story файлове (по шаблон) за всички ST-001 … ST-012.
2. Попълване на `docs/sprint-artifacts/sprint-status.yaml` с `development_status` записи, маркирани `ready-for-dev`.
3. Обновяване на архитектурната документация с TypeScript стратегия (EP-004 зависимости).
4. След валидиране на артефактите → стартиране на `dev-story` за избраната история.
