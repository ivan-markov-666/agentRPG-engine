

# Validator Metrics Summary — 29.12.2025

_Generated: 2025-12-29T10:48:39.660Z via tools/metrics/report.js_

## Run history
| Run ID | Timestamp | Duration (ms) | Errors | Warnings | Notes |
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

## Aggregated metrics
- Average run time: **152.9 ms** (based on 11 runs)
- Average number of warnings: **2.09**
- Clean run ratio: **8/11**
- Average retries to green status: **0.38** (across 8 clean runs)
- Top codes: QUEST-AREA-BACKLINK:10, EXPLORATION-QUEST-MISMATCH:4, QUEST-REWARDS-XP:2, QUEST-REWARDS-GOLD:2, QUEST-REWARDS-LOOT:2

## Recommendations
1. Maintain the Definition of Done: ≥3 consecutive runs without warnings/errors and snapshot `New codes = none`.
2. Install schema dependencies (Ajv + ajv-formats) in new environments to avoid `SCHEMA` warnings.
3. Archive telemetry history at ≥50 runs or before release (`npm run archive:telemetry -- --label <tag>`).
