# Architecture Validation — QA Guardrails (Sprint 01)

_Last updated: 2025-12-28_

## 1. Objective
Да валидираме архитектурните решения и QA границите преди изпълнение, като се уверим, че:
- Validator pipeline може да улавя нарушения на guardrails.
- Capabilities/state схемите остават синхронизирани с Product Brief.
- Telemetry/metrics предоставят наблюдаемост за DoD.

## 2. Inputs Reviewed
- `docs/architecture/agentRPG-engine-architecture.md`
- `docs/analysis/prd-backlog.md`
- `docs/analysis/build-focus-2025-12-sprint01.md`
- `docs/stories/story-catalog.md`
- `docs/analysis/test-design-epic-sprint01.md`

## 3. QA Boundary Checklist
| Area | Status | Evidence |
|------|--------|----------|
| Capabilities guardrails синхронизирани (Product Brief ↔ schemas ↔ runtime config) | ✅ | FR-04 + ST-002 tasks, архитектурен документ §4. |
| Validator CLI DoD дефиниран, има telemetry/snapshot артефакти | ✅ | FR-01, Build Focus, story ST-001. |
| Scenario/quest contracts подсигурени | ⚠️ | FR-05 описано, но нужни допълнителни validator тестове (R-005). |
| Metrics automation и архивиране | ⚠️ | ST-003 планира скрипт, но трябва да се верифицира преди release. |
| UX/Visualization поток | ❌ (out of scope) | create-ux-design остава conditional. |

## 4. QA Guardrails & Actions
1. **Validator Blocking Rules** — всички P0 нарушения (guardrails, missing quests, telemetry без snapshot) трябва да fail-ват `npm run validate` (ST-001/ST-002).
2. **Schema Sync Procedure** — при промяна в capabilities или state schema се изисква:
   - Update в Product Brief таблицата;
   - Обновяване на demo config + validator tests.
3. **Telemetry Safety** — преди metrics отчет се прави архив в `docs/analysis/reports/archive/` и dry-run сравнение.
4. **Quest/Scenario Consistency** — добави автоматични проверки за orphan quests, invalid unlock references (FR-05) в предстоящия dev-story.
5. **Future UX Gate** — ако се активира create-ux-design, добави отделен QA слой (component/UI tests) преди release.

## 5. Decision
- ✅ Архитектурните guardrails са достатъчни за стартиране на Sprint 01 изпълнение, при условие че горните действия (особено #4) бъдат включени в dev-story.
- ✅ QA границите са документирани; test-design планът покрива P0/P1 сценарии.
- ⚠️ Monitor optional UX/Exploration work за следващите спринтове.
