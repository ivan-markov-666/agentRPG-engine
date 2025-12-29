# Validator Metrics Insights — 29.12.2025 г.

_Generated: 2025-12-29T10:48:39.681Z via tools/metrics/report.js --insights_

## Summary
- Последен run: **dev-20251228-05** @ 2025-12-28T14:42:01.782Z
- Clean run ratio: **8/11**
- Средно време (последни 11 run-а): **152.9 ms** ✅
- CAP предупреждения: **0.0%** ✅
- Средни предупреждения: **2.09** ❌

## KPI Trends
| KPI | Стойност | Статус |
| --- | --- | --- |
| Avg runtime | 152.9 ms | ✅ |
| Avg warnings/run | 2.09 | ❌ |
| CAP alerts ratio | 0.0% | ✅ |
| Clean run ratio | 8/11 | ❌ |
| Latest warnings | 0 | ✅ |

## Alerts
- ❌ Средните предупреждения са 2.09 на run.

## Recommended Actions
1. Проверявай top codes (QUEST-AREA-BACKLINK:10, EXPLORATION-QUEST-MISMATCH:4, QUEST-REWARDS-XP:2, QUEST-REWARDS-GOLD:2, QUEST-REWARDS-LOOT:2) и адресирай повторяемите нарушения.
2. Архивирай telemetry при ≥50 записи и пази последните clean run-ове за DoD.
3. Увери се, че CAP schema dependencies са актуални (ajv + ajv-formats) в всички среди.