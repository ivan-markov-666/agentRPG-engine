# ST-006 — Runtime State Schema Alignment

_Status: done_

## Story Overview
As a dev, I want `state.schema.json` and the runtime validator to ensure that all stats, nested maps, and inventories in the demo game respect guardrails, so I can prevent invalid session snapshots.

## Acceptance Criteria
- [x] `tools/validator/schemas/state.schema.json` describes the structure of `games/demo/player-data/runtime/state.json`, including non-negative values and types.
- [x] Validator compares the state file against the schema and throws an error on mismatches.
- [x] Documentation (Product Brief / capabilities catalog) references the state schema rules.
- [x] Test suite covers valid and invalid state examples.

## Tasks / Subtasks
- [x] Define a JSON schema with types for `stats`, `flags`, `inventories`, nested structures.
- [x] Update the validator to load the schema and log meaningful errors (`STATE-SCHEMA`).
- [x] Add example state files for tests and documentation.
- [x] Write unit/integration tests.

## Dev Notes
- Preserve backward compatibility, but allow optional fields via `additionalProperties: false` where possible.

## Dev Agent Record
- `tools/validator/schemas/state.schema.json` extended with a full description of runtime fields (current_day/hour, flags, inventories, exploration preview, nested stats).
- Added integration tests for valid and invalid state to `tools/validator/tests/validator.test.js` to ensure `STATE-SCHEMA` coverage.
- Documentation (`docs/analysis/capabilities-catalog.md`, `docs/analysis/validator-readme.md`) updated with state schema guidance and sample structures.
- `npm test` (validator + telemetry tests) passes, proving the schema works.

## File List
- `tools/validator/schemas/state.schema.json`
- `tools/validator/tests/validator.test.js`
- `docs/analysis/capabilities-catalog.md`
- `docs/analysis/validator-readme.md`

## Change Log
1. State schema extension: added inventories/flags/exploration definitions and stricter types.
2. Validator tests: added valid/invalid runtime state scenarios.
3. Documentation: capabilities catalog + validator README describe state schema control and sample errors.

## Status
done
