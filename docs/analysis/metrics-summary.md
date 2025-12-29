# Validator Metrics Summary — 29.12.2025 г.

_Generated: 2025-12-29T10:48:39.660Z via tools/metrics/report.js_

## Run история
| Run ID | Timestamp | Duration (ms) | Errors | Warnings | Бележки |
|--------|-----------|---------------|--------|----------|---------|
| dev-20251225-run5 | 2025-12-25T19:27:58.197Z | 127 | 0 | 0 | clean |
| dev-20251225-run6 | 2025-12-25T19:28:13.058Z | 141 | 0 | 0 | clean |
| dev-local | 2025-12-25T19:44:23.259Z | 140 | 0 | 0 | clean |
| dev-20251225-auto | 2025-12-25T19:48:21.440Z | 116 | 0 | 0 | clean |
| dev-20251225-auto | 2025-12-25T19:48:44.730Z | 119 | 0 | 0 | clean |
| dev-20251225-quests | 2025-12-25T19:53:33.723Z | 111 | 0 | 0 | clean |
| dev-20251228-01 | 2025-12-28T14:27:30.534Z | 254 | 0 | 11 | QUEST-REWARDS-XP, QUEST-REWARDS-GOLD, QUEST-REWARDS-LOOT +3 |
| dev-20251228-02 | 2025-12-28T14:33:38.212Z | 150 | 0 | 11 | QUEST-REWARDS-XP, QUEST-REWARDS-GOLD, QUEST-REWARDS-LOOT +3 |
| dev-20251228-03 | 2025-12-28T14:36:37.918Z | 166 | 0 | 1 | EXPLORATION-PREVIEW-MISMATCH |
| dev-20251228-04 | 2025-12-28T14:37:00.424Z | 176 | 0 | 0 | clean |
| dev-20251228-05 | 2025-12-28T14:42:01.782Z | 182 | 0 | 0 | clean |

## Аггрегирани показатели
- Средно време за run: **152.9 ms** (на база 11 run-а)
- Среден брой предупреждения: **2.09**
- Clean run ratio: **8/11**
- Avg retries до зелен статус: **0.38** (по 8 clean run-а)
- Top codes: QUEST-AREA-BACKLINK:10, EXPLORATION-QUEST-MISMATCH:4, QUEST-REWARDS-XP:2, QUEST-REWARDS-GOLD:2, QUEST-REWARDS-LOOT:2

## Препоръки
1. Поддържай Definition of Done: ≥3 последователни run-а без warnings/errors и snapshot `New codes = none`.
2. Инсталирай schema dependencies (Ajv + ajv-formats) в нови среди, за да липсват `SCHEMA` предупреждения.
3. Архивирай telemetry история при ≥50 run-а или преди release (`npm run archive:telemetry -- --label <tag>`).
