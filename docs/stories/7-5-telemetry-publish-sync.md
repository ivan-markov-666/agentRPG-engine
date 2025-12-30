# ST-026 — Telemetry Publish & Sync Tooling

_Status: ready-for-dev_

## Story Overview
Като QA искам tooling за публикуване и синхронизиране на telemetry артефактите към централен staging/архив, за да мога да пренасям доказателства между машини/екипи без ръчни копирания и без риск от загуба на история.

## Acceptance Criteria
- [ ] Команда `npm run publish:telemetry -- [--all] [--dry-run] [--source <dir>] [--dest <dir>]`:
  - [ ] копира telemetry archive файлове към target директория
  - [ ] по избор включва и текущия `telemetry-history.json`
  - [ ] при `--dry-run` не модифицира файловата система и само репортва действията
- [ ] Добавен е npm script за синхронизация (wrapper) към `tools/scripts/sync-telemetry.js` (напр. `npm run sync:telemetry -- ...`).
- [ ] `sync-telemetry` поддържа destination като:
  - [ ] локална директория
  - [ ] S3 bucket path чрез `aws s3 sync` (ако AWS CLI е наличен)
- [ ] Има ясни грешки при липсващи директории/права.
- [ ] README описва препоръчания поток: archive → publish → sync.

## Tasks / Subtasks
- [ ] Добави `sync:telemetry` npm script (ако липсва).
- [ ] Добави тестове за `publish-telemetry.js` (temp dirs) в dry-run и реален режим.
- [ ] Документирай ограниченията за S3 sync (изисква AWS CLI и credentials).

## Dev Agent Record / File List / Change Log
- `tools/scripts/publish-telemetry.js`
- `tools/scripts/sync-telemetry.js`
- `package.json`
- `README.md`

## Status
ready-for-dev
