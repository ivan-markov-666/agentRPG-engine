# Validator Metrics Summary — 25.12.2025 г.

_Generated: 2025-12-25T19:28:38.123Z via tools/metrics/report.js_

## Run история
| Run ID | Timestamp | Duration (ms) | Errors | Warnings | Бележки |
|--------|-----------|---------------|--------|----------|---------|
| dev-20251225-run5 | 2025-12-25T19:27:58.197Z | 127 | 0 | 0 | clean |
| dev-20251225-run6 | 2025-12-25T19:28:13.058Z | 141 | 0 | 0 | clean |

## Аггрегирани показатели
- Средно време за run: **134.0 ms** (на база 2 run-а)
- Среден брой предупреждения: **0.00**
- Clean run ratio: **2/2**
- Avg retries до зелен статус: **0.00** (по 2 clean run-а)
- Top codes: n/a

## Препоръки
1. Поддържай Definition of Done: ≥3 последователни run-а без warnings/errors и snapshot `New codes = none`.
2. Инсталирай schema dependencies (Ajv + ajv-formats) в нови среди, за да липсват `SCHEMA` предупреждения.
3. Архивирай telemetry история при ≥50 run-а или преди release (`npm run archive:telemetry -- --label <tag>`).
