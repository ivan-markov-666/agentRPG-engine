# ST-007 — Quest & Scenario Contract Validation

_Status: done_

## Story Overview
 As a GM, I want the validator to detect mismatches between `scenario/index.md`, `available.json`, `unlock-triggers.json`, and quest files, so there are no orphan quests or broken links.

## Acceptance Criteria
- [x] The validator throws an error if a quest referenced in `available.json` has no matching file.
- [x] Validation for duplicated quest titles and IDs.
- [x] Check `unlock-triggers.json` → all dependency IDs exist.
- [x] Markdown link checker for quest files (links like `[[QuestName]]`).
- [x] Documentation describes the new rules and offers remediation steps.

## Tasks / Subtasks
- [x] Implement a consolidated loader that builds a graph of quests and triggers.
- [x] Add validator rules with clear codes (`QUEST-MISSING`, `QUEST-DUPLICATE`, `TRIGGER-INVALID`).
- [x] Create sample failing/passing fixtures + tests.
- [x] Update `validator-readme.md` and the Product Brief section for FR-05.

## Dev Notes
- The quest contract checker now compares `available.json`, `scenario/index.md`, quest files, and `unlock-triggers.json`. New codes: `INDEX-QUEST-MISSING`, `INDEX-QUEST-UNKNOWN`, `INDEX-QUEST-DUPLICATE`.
- Markdown links and quest sections now have stricter guardrails (Rewards, Steps, Hooks, etc.).
- The diagnostic JSON report remains optional for a future release (not in scope for ST-007).

## Dev Agent Record / File List / Change Log
- `tools/validator/checks/quests.js` — parses the scenario index, adds guardrails, cross-file validation.
- `tools/validator/tests/validator.test.js` — integration test for mismatches between index and available.
- `docs/analysis/validator-readme.md` — section for Quest & Scenario contract control.
- `npm test` — coverage of validator + archive telemetry.

## Status
done
