# Test Design — Sprint 01 (Validator Reliability)

_Last updated: 2025-12-28_

## Context
- **Stories in scope:** ST-001, ST-002, ST-003 (виж `docs/stories/story-catalog.md`).
- **Architecture reference:** `docs/architecture/agentRPG-engine-architecture.md`.
- **PRD reference:** `docs/analysis/prd-backlog.md`.
- **Build focus:** `docs/analysis/build-focus-2025-12-sprint01.md`.

## Risk Assessment
| Risk ID | Category | Description | Probability | Impact | Score | Mitigation |
|---------|----------|-------------|-------------|--------|-------|------------|
| R-001 | TECH | CLI флаговете не са валидирани → DoD командата не fail-ва при грешки | 2 | 3 | 6 | Интеграционни тестове за `npm run validate` (ST-001), автоматична проверка за непознати флагове. |
| R-002 | DATA | Capabilities guardrails не съвпадат със схемата и runtime state → runtime inconsistency | 2 | 3 | 6 | Schema тестове + validator проверки (ST-002), синхронизация с Product Brief. |
| R-003 | PERF | Telemetry metrics не се обновяват автоматично → липса на DoD доказателства | 2 | 2 | 4 | Скрипт `npm run metrics:report`, dry-run + архив (ST-003). |
| R-004 | OPS | Telemetry history може да се overwrite без архив | 1 | 3 | 3 | Архивиране преди запис, отделен npm script. |
| R-005 | BUS | Validator не flag-ва broken quest/state връзки → GM получава невалиден bundle | 1 | 3 | 3 | Допълнителни validator сценарии за scenario/quest contracts (част от ST-002/FR-05). |

High-priority (score ≥6): R-001, R-002.

## Coverage Matrix
| Requirement / Story | Test Level | Priority | Risk Link | Notes |
|---------------------|-----------|----------|-----------|-------|
| ST-001 — CLI DoD | Integration + E2E smoke (CLI) | P0 | R-001 | CLI acceptance тестове + smoke run (3 последователни изпълнения). |
| ST-002 — Guardrails schema | Unit + Integration | P0 | R-002, R-005 | Schema unit tests (AJV), validator integration run срещу demo config/state. |
| ST-003 — Metrics automation | Integration | P1 | R-003, R-004 | Скрипт тестове с mock telemetry history, проверка за архив. |
| Scenario/Quest contracts (FR-05) | Integration | P1 | R-005 | Validator run със sample quest, проверка за sync. |

## Test Levels Strategy
- **Unit:** Guardrail validation helpers, metrics calculation functions.
- **Integration/API:** Validator CLI end-to-end (ST-001), schema validation срещу sample data, telemetry script.
- **E2E (CLI smoke):** `npm run validate` + metrics script в CI-like pipeline (локален).
- **Component/UI:** N/A (няма UI в scope).

## Priority & Execution Order
1. **Smoke (P0 subset, <5 мин):** `npm run validate --summary --snapshot` с демо данни.
2. **P0 Tests:**
   - CLI флагове (валидни/невалидни).
   - Schema diff + guardrail enforcement.
3. **P1 Tests:**
   - Metrics automation script (dry-run + архив).
   - Scenario/quest contract validator.
4. **P2 (optional):** Future exploration log schema тестове (out-of-scope).

## Data & Tooling Needs
- Sample telemetry history (`docs/analysis/reports/telemetry-history.json`).
- Demo game config/state under `games/demo/`.
- Snapshot fixtures за validator run (създават се при изпълнение на ST-001).
- Архив директория `docs/analysis/reports/archive/`.

## Quality Gates
- 100% PASS за всички P0 тестове (CLI + schema).
- ≥95% PASS за P1.
- Нито един high-risk (score ≥6) без планирана mitigation.
- Metrics summary актуализиран автоматично след спринта.

## Next Steps
1. Включване на P0/P1 тестове в `npm run test:validator` и документ „Validator README“.
2. Приоритизиране на dev-story за ST-001/002/003 със съответните тест задачи.
3. Подготовка за последващ `testarch/atdd` workflow (генериране на failing tests преди имплементация).
