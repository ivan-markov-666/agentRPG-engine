# ST-005 — Run ID Helper Integration

_Status: done_

## Story Overview
As the dev team, we want a unified run ID helper (PowerShell + Bash) and a required `--run-id` flag for telemetry, so we can track which run was executed and by whom.

## Acceptance Criteria
- [x] `scripts/run-id.ps1` and `scripts/run-id.sh` generate a UUID-format value and can be sourced in a shell profile.
- [x] The CLI `npm run validate` requires `--run-id` and records the value in telemetry entries.
- [x] The README describes how to set up the helper on Windows/Linux/macOS.
- [x] A test covers missing run-id (expects an error) and a valid run-id.

## Tasks / Subtasks
- [x] Add shell/PowerShell helpers and installation instructions.
- [x] Update the validator CLI to refuse execution without `--run-id`.
- [x] Extend the telemetry structure with a `runId` field and tests.
- [x] Document in `validator-readme.md` and the README.

## Dev Notes
- You can use `crypto.randomUUID()` (Node 18+) or a robust library.
- When run-id is missing, the CLI must return exit code 1 and a helpful message.

## Dev Agent Record
- Added `tools/scripts/run-id.ps1` and `tools/scripts/run-id.sh` with functions `New-AgentRPGRunId` and `run_id_generate`, designed for source/import in shell profiles and clipboard support.
- The validator now refuses execution when `--run-id` is missing, and the telemetry payload contains `runId` and legacy `run_id`.
- Tests in `tools/validator/tests/validator.test.js` validate the error flow for missing run-id, successful log writing, and updated CLI scenarios (snapshot, summary, guardrails).
- Documentation (`README.md`, `docs/analysis/validator-readme.md`) describes the required run-id and helper integration.

## File List
- `tools/scripts/run-id.ps1`
- `tools/scripts/run-id.sh`
- `tools/validator/index.js`
- `tools/validator/utils/telemetry.js`
- `tools/validator/tests/validator.test.js`
- `docs/analysis/validator-readme.md`
- `README.md`
- `docs/stories/1-3-run-id-helper.md`
- `docs/sprint-artifacts/sprint-status.yaml`

## Change Log
1. Created shell helpers for run-id generation (UUID + prefix, clipboard copy, source/import-friendly).
2. Validator CLI requires `--run-id`, telemetry payload includes `runId`, and tests cover the new behavior.
3. README and validator-readme updated with helper instructions and the required flag; story and sprint statuses updated.

## Status
done
