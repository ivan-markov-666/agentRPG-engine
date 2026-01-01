# ST-035 — Runtime Telemetry Metrics Wiring

_Status: done_

## Story Overview
Като analyst/QA искам ключовите MVP KPI (time-to-first-active-quest, % успешни откази без dead-end, avg retries до validation pass, % sessions с debug, % sessions с ≥1 completed quest) да се изчисляват автоматично от telemetry history, за да имам repeatable DoD метрики без ръчни изчисления.

## Acceptance Criteria
- [x] Telemetry entries съдържат нужните полета (timestamp-и, event markers) за изчисляване на KPI, включително първи активен quest, отказ/смяна на quest и debug статус.
- [x] `npm run metrics:report` извежда (markdown + JSON) KPI таблица с горните метрики, като използва telemetry history.
- [x] Документиран е алгоритъмът/форматът (README Sprint Metrics Workflow + validator docs), така че dev-овете да разбират как се измерват KPI-тата.
- [x] Добавени са unit тестове за metrics report, които симулират telemetry history и проверяват коректните KPI стойности.
- [x] Telemetry schema/типове са обновени и валидирани (Ajv + TypeScript types) за новите полета.

## Tasks / Subtasks
- [x] Обнови telemetry event schema/типове (`src/types/telemetry.ts`, `docs/analysis/telemetry-schema.md` ако има).
- [x] Имплементирай изчисленията в `tools/metrics/report.ts` (или екв.).
- [x] Обнови README Sprint Metrics раздела с новите KPI дефиниции и примери.
- [x] Добави тестове (`tools/tests/metrics-report.test.ts` или нов файл) с synthetic telemetry данни.

## Dev Agent Record / File List / Change Log
- `src/types/telemetry.ts`
- `tools/metrics/report.ts`
- `tools/tests/metrics-report.test.ts`
- `docs/analysis/metrics-insights.md`, `README.md`

## Status
done
