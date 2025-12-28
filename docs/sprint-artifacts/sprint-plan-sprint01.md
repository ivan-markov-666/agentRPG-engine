# Sprint Plan — Sprint 01 (Validator Reliability)

_Last updated: 2025-12-28_

## 1. Sprint Goal
Да засилим валидатора и наблюдаемостта така, че DoD да е автоматизирано проследим и guardrails за capabilities/state да са enforce-нати.

## 2. Backlog Slice
| Story | Description | Owner | Status |
|-------|-------------|-------|--------|
| ST-001 | Validator DoD CLI Enhancements | Dev | TODO |
| ST-002 | Capabilities Guardrails Schema | Dev | TODO |
| ST-003 | Metrics Automation Script | Dev/QA | TODO |

## 3. Tasks & Dependencies
- ST-001
  - Update CLI entrypoints (`npm run validate`).
  - Add integration tests (T-01) + telemetry snapshot wiring.
- ST-002
  - Extend `capabilities.schema.json` (T-02) + runtime schema (T-03).
  - Sync guardrail table в Product Brief.
- ST-003
  - Script `npm run metrics:report`, архивиране на стария summary.
  - Update `docs/analysis/metrics-summary.md` след всяко изпълнение.

## 4. Definition of Done
- 3 последователни чисти validator run-а с новите схеми/тестове.
- Telemetry history архивиран преди финалния отчет.
- Metrics summary автоматично обновен.

## 5. Risks / Mitigation
1. **Schema-breaking change** — снабдяваме sample game с migration бележки.
2. **Test runtime** — отделяме тежките тестове в `npm run test:validator`.
3. **Telemetry overwrite** — dry-run и архив скрипт.

## 6. Communication & Artifacts
- Daily updates → `docs/analysis/build-focus-2025-12-sprint01.md`.
- Sprint board → този файл.
- Outputs → story каталог + PRD + architecture.
