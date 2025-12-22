# Validator Metrics Summary — 22 дек 2025

## Run история
| Run ID | Timestamp | Duration (ms) | Errors | Warnings | Бележки |
|--------|-----------|---------------|--------|----------|---------|
| dev-001 | 2025-12-22T12:05:00Z | 150 | 0 | 1 | QUEST-CONTENT (липсва Rewards) |
| dev-20251222-1528a | 2025-12-22T13:25:24Z | 17 | 0 | 4 | MANIFEST-FIELD, SCHEMA-NOT-AVAILABLE×2, CAP-UNKNOWN-RUNTIME |
| dev-20251222-1548a | 2025-12-22T13:41:02Z | 143 | 0 | 0 | Чист run (DoD покрит) |

## Аггрегирани показатели
- Средно време за run: **~103 ms** (150, 17, 143)
- Среден брой предупреждения: **1.67**, сведен до 0 след последния run
- Avg retries до зелен статус: **1** (един цикъл фиксове между run 1 и run 3)
- Top codes преди фиксовете: `SCHEMA-NOT-AVAILABLE`, `MANIFEST-FIELD`, `CAP-UNKNOWN-RUNTIME`, `QUEST-CONTENT`

## Препоръки
1. Поддържай Definition of Done: ≥3 последователни run-а без warnings/errors и snapshot `New codes = none`.
2. Инсталирай schema dependencies (Ajv) в нови среди, за да избегнеш `SCHEMA-NOT-AVAILABLE`.
3. Следи telemetry историята и архивирай при ≥50 run-а или преди release (`npm run archive:telemetry -- --label <tag>`).
