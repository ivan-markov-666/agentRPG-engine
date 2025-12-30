# ST-003 — Metrics Automation Script

_Status: done_

## Story Overview
Като QA искам `npm run metrics:report` да генерира автоматично `docs/analysis/metrics-summary.md` от telemetry history, за да следя KPI без ръчни изчисления.

## Acceptance Criteria
- [x] Скриптът прочита `docs/analysis/reports/telemetry-history.json` и изчислява KPI (CAP error %, средно време, средни retries).
- [x] Преди overwrite на summary файла се създава архив копие в `docs/analysis/reports/archive/`.
- [x] CLI поддържа `--dry-run` и `--output <path>` (alias `--out`) за експерименти.
- [x] README/metrics docs съдържат инструкции за изпълнение и интерпретация.
- [x] Тест покрива dry-run поведението и архивирането.

## Tasks / Subtasks
- [x] Имплементирай Node/TS скрипт (може да споделя код с telemetry архивиране).
- [x] Добави KPI формули (вкл. средно време <200 ms цели) и форматирай markdown таблици.
- [x] Реализирай архивиране (timestamp + label) преди overwrite.
- [x] Добави unit тестове с фиктивни telemetry файлове.
- [x] Обнови `docs/analysis/metrics-summary.md` структурата.

## Dev Notes
- Наблюдавай locking поведение при едновременни записа; добави предупреждение при open file.

## Dev Agent Record / File List / Change Log
- `tools/metrics/report.js`: добавени `--dry-run`, `--output`, `--archive-dir`, `--archive-label`, автоматично архивиране и conditional insights писане.
- `tools/tests/metrics-report.test.js`: тест за архивиране и dry-run режим.
- `docs/analysis/validator-readme.md`: секция за метрики и CLI опции.
- `docs/analysis/metrics-summary.md`: пример за автоматично генерирания отчет (обновен при последния run).
- `docs/sprint-artifacts/sprint-status.yaml`: статусът на ST-003 е обновен.

## Status
done
