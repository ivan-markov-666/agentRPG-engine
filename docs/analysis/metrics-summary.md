# Validator Metrics Summary — 25.12.2025 г.

_Generated: 2025-12-25T19:48:44.775Z via tools/metrics/report.js_

## Run история
| Run ID | Timestamp | Duration (ms) | Errors | Warnings | Бележки |
|--------|-----------|---------------|--------|----------|---------|
| dev-20251225-run5 | 2025-12-25T19:27:58.197Z | 127 | 0 | 0 | clean |
| dev-20251225-run6 | 2025-12-25T19:28:13.058Z | 141 | 0 | 0 | clean |
| dev-local | 2025-12-25T19:44:23.259Z | 140 | 0 | 0 | clean |
| dev-20251225-auto | 2025-12-25T19:48:21.440Z | 116 | 0 | 0 | clean |
| dev-20251225-auto | 2025-12-25T19:48:44.730Z | 119 | 0 | 0 | clean |

## Аггрегирани показатели
- Средно време за run: **128.6 ms** (на база 5 run-а)
- Среден брой предупреждения: **0.00**
- Clean run ratio: **5/5**
- Avg retries до зелен статус: **0.00** (по 5 clean run-а)
- Top codes: n/a

## Препоръки
1. Поддържай Definition of Done: ≥3 последователни run-а без warnings/errors и snapshot `New codes = none`.
2. Инсталирай schema dependencies (Ajv + ajv-formats) в нови среди, за да липсват `SCHEMA` предупреждения.
3. Архивирай telemetry история при ≥50 run-а или преди release (`npm run archive:telemetry -- --label <tag>`).
