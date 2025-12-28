# ST-003 — Metrics Automation Script

_Status: ready-for-dev_

## Story Overview
Като QA искам `npm run metrics:report` да генерира автоматично `docs/analysis/metrics-summary.md` от telemetry history, за да следя KPI без ръчни изчисления.

## Acceptance Criteria
- [ ] Скриптът прочита `docs/analysis/reports/telemetry-history.json` и изчислява KPI (CAP error %, средно време, средни retries).
- [ ] Преди overwrite на summary файла се създава архив копие в `docs/analysis/reports/archive/`.
- [ ] CLI поддържа `--dry-run` и `--output <path>` за експерименти.
- [ ] README/metrics docs съдържат инструкции за изпълнение и интерпретация.
- [ ] Тест покрива dry-run поведението и архивирането.

## Tasks / Subtasks
- [ ] Имплементирай Node/TS скрипт (може да споделя код с telemetry архивиране).
- [ ] Добави KPI формули (вкл. средно време <200 ms цели) и форматирай markdown таблици.
- [ ] Реализирай архивиране (timestamp + label) преди overwrite.
- [ ] Добави unit тестове с фиктивни telemetry файлове.
- [ ] Обнови `docs/analysis/metrics-summary.md` структурата.

## Dev Notes
- Наблюдавай locking поведение при едновременни записа; добави предупреждение при open file.

## Dev Agent Record / File List / Change Log
_(pending)_

## Status
ready-for-dev
