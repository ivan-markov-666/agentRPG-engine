# AgentRPG Engine — PRD / Backlog Extract (v1)

_Last updated: 2025-12-22_

## 1. Goals & Scope
- **Product Brief reference:** `docs/analysis/product-brief-A RPG game engine for LLM models.-2025-12-19.md` (frozen v1).
- **Primary objective:** maintain a local-only AgentRPG engine workflow where LLM/GM operates via file contracts. Focus on validator/tooling fidelity, capabilities guardrails, and scenario/state consistency.
- **Success signals:**
  - Validator DoD met (≥3 clean runs, snapshot New codes = none, avg time <200 ms).
  - Capabilities and runtime state remain within documented guardrails.
  - Scenario/quest contracts prevent orphans and expose actionable diagnostics to GM/dev.

## 2. Functional Requirements → Backlog Items
| ID | Theme | Requirement / Story | Acceptance Criteria | Notes |
|----|-------|---------------------|---------------------|-------|
| FR-01 | Validator workflow | As a dev I can run `npm run validate` with JSON + telemetry + snapshot in one command to confirm DoD. | - CLI supports `--json`, `--log`, `--run-id`, `--snapshot`, `--summary` flags.<br>- DoD: 0 errors/warnings, CAP errors = 0, snapshot new codes = none, avg duration <200 ms.<br>- `docs/analysis/metrics-summary.md` updated per release cycle. | Already implemented; keep regression tests and docs updated. |
| FR-02 | Telemetry retention | As QA I can archive telemetry when history ≥50 entries or before release. | - `npm run archive:telemetry -- --label <tag>` moves `telemetry-history.json` to archive with timestamp.<br>- README documents workflow.<br>- Telemetry files stored under `docs/analysis/reports/archive/`. | Monitor file size; consider automation later. |
| FR-03 | Run ID helpers | As devs on different shells we can generate run IDs consistently. | - `scripts/run-id.ps1` + `scripts/run-id.sh` published and referenced in README.<br>- Profile snippets auto-import helper.<br>- `--run-id` becomes mandatory for telemetry logging. | Already available; keep instructions synced. |
| FR-04 | Capabilities guardrails | As GM/dev I know valid ranges for core capabilities. | - Product brief contains guardrail table.<br>- `games/demo/config/capabilities.json` mirrors ranges (min/max or range array).<br>- Validator warns if runtime values break guardrails (CAP-RUNTIME-RANGE). | Expand tests for new caps when introduced. |
| FR-05 | Scenario/quest contracts | Ensure `scenario/index.md`, `available.json`, `unlock-triggers.json`, quest files, and state stay in sync. | - Validator errors for missing quests, duplicate titles, invalid unlock references.<br>- GM fallback rules (auto template, default area) documented and implemented. | Additional checks for link validity may be added. |
| FR-06 | Exploration logging | When exploration is enabled, a log file exists and is well-formed. | - Validator enforces presence/type.<br>- README explains usage; log template provided. | Future: add schema & viewer support. |
| FR-07 | Metrics tracking | Capture key metrics (time-to-first-active-quest, validation pass rate, avg retries, etc.) | - Step 4 section in product brief kept up to date.<br>- Metrics summary document maintained. | Extend with automation later. |

## 3. Technical Tasks / Enhancements
| ID | Task | Description / Deliverable | Dependencies |
|----|------|--------------------------|--------------|
| T-01 | Validator test coverage | Add unit/integration tests covering new CLI flags, telemetry append, snapshot diffs. | FR-01, FR-07 |
| T-02 | Capabilities schema extension | Update `tools/validator/schemas/capabilities.schema.json` to encode guardrails (min/max optional but type enforced). | FR-04 |
| T-03 | Runtime schema alignment | Ensure `state.schema.json` matches guardrails (stats map: non-negative, nested maps). | FR-04 |
| T-04 | Quest content checks | Extend validator to flag missing sections (Summary/Steps/Rewards) and invalid `[[links]]`. | FR-05 |
| T-05 | Exploration log schema | Provide JSON schema + validator check for exploration log entries (id/title/type/timestamp). | FR-06 |
| T-06 | Metrics automation | Script to recompute metrics summary from telemetry history (avg duration, warnings, retries). | FR-07 |

## 4. Non-Functional Requirements
- **Local-only tooling:** no CI/CD integrations; all commands run via npm/node locally.
- **Docs in BG:** README/Product brief/appendixes remain на български.
- **Telemetry privacy:** reports stay under `docs/analysis/reports/`; no external uploads.
- **Extensibility:** allow future custom engine layers via manifest `engine_layers` without breaking core contracts.

## 5. Open Questions / Next Decisions
1. Should we automate telemetry archiving (cron/CLI option) once history >50? (Depends on FR-02 usage.)
2. Do we need a lightweight UI viewer milestone (Next.js) in this PRD, или остава отделен проект? (Tie-in to Build focus.)
3. How strict да бъдат guardrails за по-екзотични capabilities (напр. `temperature_resist`, `crit_chance`)? Need per-feature decision before enabling in games.

---
_Use this doc as the working PRD/backlog for upcoming Build cycles; update IDs/status as work progresses._
