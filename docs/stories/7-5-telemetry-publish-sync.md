# ST-026 — Telemetry Publish & Sync Tooling

_Status: done_

## Story Overview
Като QA искам tooling за публикуване и синхронизиране на telemetry артефактите към централен staging/архив, за да мога да пренасям доказателства между машини/екипи без ръчни копирания и без риск от загуба на история.

## Acceptance Criteria
- [x] Команда `npm run publish:telemetry -- [--all] [--dry-run] [--source <dir>] [--dest <dir>]`:
  - [x] копира telemetry archive файлове към target директория
  - [x] по избор включва и текущия `telemetry-history.json`
  - [x] при `--dry-run` не модифицира файловата система и само репортва действията
- [x] Добавен е npm script за синхронизация (wrapper) към `tools/scripts/sync-telemetry.js` (напр. `npm run sync:telemetry -- ...`).
- [x] `sync-telemetry` поддържа destination като:
  - [x] локална директория
  - [x] S3 bucket path чрез `aws s3 sync` (ако AWS CLI е наличен)
- [x] Има ясни грешки при липсващи директории/права.
- [x] README описва препоръчания поток: archive → publish → sync.

## Tasks / Subtasks
- [x] Добави `sync:telemetry` npm script (ако липсва).
- [x] Добави тестове за `publish-telemetry.js` (temp dirs) в dry-run и реален режим.
- [x] Добави тестове за `sync-telemetry.ts` (локален copy, dry-run и S3 stub).
- [x] Документирай ограниченията за S3 sync (изисква AWS CLI и credentials).

## Dev Agent Record / File List / Change Log
- ✅ `tools/scripts/publish-telemetry.ts` — CLI за копиране на архиви с поддръжка на `--all`, `--dry-run`, `--include-history`.
- ✅ `tools/scripts/sync-telemetry.ts` — CLI за локален copy/S3 sync + unit-friendly `syncTelemetry` API.
- ✅ `tools/tests/publish-telemetry.test.ts` — temp dir тестове (реален copy + dry-run).
- ✅ `tools/tests/sync-telemetry.test.ts` — покрива локален copy, dry-run, S3 и грешки от AWS CLI.
- ✅ `package.json` — добавен `sync:telemetry` script и hook към новия тест.
- ✅ `README.md` — описан поток archive → publish → sync, AWS изисквания.

## Status
done
