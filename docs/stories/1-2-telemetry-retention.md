# ST-004 — Telemetry Retention Automation

_Status: done_

## Story Overview
As QA, I want an automatic way to archive telemetry history when it reaches a threshold or before a release, so I can keep DoD evidence without manual steps.

## Acceptance Criteria
- [x] Command `npm run archive:telemetry -- --label <tag>` moves the current `telemetry-history.json` to `docs/analysis/reports/archive/<timestamp>-<tag>.json`.
- [x] After archiving, a new empty telemetry history file is created with a valid structure.
- [x] The README contains steps for archiving and recovery.
- [x] An automated test covers the scenario “history >= 50 entries → archive”.
- [x] The CLI returns an error if the archive directory is missing or lacks permissions.

## Tasks / Subtasks
- [x] Implement a Node/TS archiving script with arguments `--label`, `--path` (optional).
- [x] Add a safeguard for a minimum number of entries before archiving (configurable threshold).
- [x] Update telemetry README with example runs and recovery steps.
- [x] Write unit tests for the archive logic (mock file system).

## Dev Notes
- Use the same timestamp format as `build-focus` (`YYYY-MM-DDTHH-mm-ss`).
- Prepare a dry-run flag for future automation (can be a TODO comment).

## Dev Agent Record
### Implementation Plan
- Extend `tools/archive-telemetry.js` with threshold (default 50), dry-run, and configurable paths, plus stricter errors.
- Build unit tests (temp dir) for scenarios: under-threshold skip, archive ≥ threshold, missing history.
- Update README/validator docs with instructions for threshold, dry-run, recovery + story logs.

### Debug Log
- `archive-telemetry.js` updated with `--min`, `--dry-run`, new API + exports.
- Added test `tools/tests/archive-telemetry.test.js`, included in `npm test`.

### Completion Notes
- The archiving CLI now supports `--min`, `--dry-run`, configurable paths, and correctly resets history after a successful archive.
- The README includes instructions for threshold/dry-run, recovery steps, and example commands/automation.
- Unit tests cover scenarios for threshold skip, successful archive, missing history, and an inaccessible archive directory.

## File List
- `tools/archive-telemetry.js`
- `tools/tests/archive-telemetry.test.js`
- `docs/analysis/validator-readme.md`
- `tools/scripts/archive-telemetry.ps1`
- `tools/scripts/archive-telemetry.sh`

## Change Log
- Added threshold-aware archiver with tests, docs, and automation wrappers.

## Status
done
