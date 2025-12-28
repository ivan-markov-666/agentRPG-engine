# AgentRPG Engine — Epics & Stories Roadmap (v1)

_Last updated: 2025-12-28_

## Overview
Пълна разбивка на всички планирани епики, user stories и технически задачи преди стартиране на изпълнителните workflows. Всички story файлове ще следват стандартизирания шаблон и ще бъдат маркирани `ready-for-dev`, освен ако изрично е посочено друго.

## Epic Summary
| Epic ID | Name | Goal | Linked Stories |
|---------|------|------|----------------|
| EP-001 | Validator Reliability & CLI DoD | Единна команда за DoD, telemetry и snapshot guardrails. | ST-001, ST-004, ST-005 |
| EP-002 | Capabilities & Scenario Guardrails | Строги схеми и контракт валидации за capabilities, state и quests. | ST-002, ST-006, ST-007, ST-008 |
| EP-003 | Observability & Metrics Automation | Пълна проследимост на метриките и telemetry архивиране. | ST-003, ST-009 |
| EP-004 | TypeScript Migration & Tooling | Прехвърляне на core engine и validator към TypeScript с типови договори. | ST-010, ST-011, ST-012 |

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

## Status Legend
- `ready-for-dev`: Story файлът е завършен и може да бъде стартиран чрез `dev-story`.
- `backlog`: Story файлът е дефиниран, но изисква допълнителен input (ще се отбележи в самия файл).

## Next Steps
1. Създаване на индивидуални story файлове (по шаблон) за всички ST-001 … ST-012.
2. Попълване на `docs/sprint-artifacts/sprint-status.yaml` с `development_status` записи, маркирани `ready-for-dev`.
3. Обновяване на архитектурната документация с TypeScript стратегия (EP-004 зависимости).
4. След валидиране на артефактите → стартиране на `dev-story` за избраната история.
