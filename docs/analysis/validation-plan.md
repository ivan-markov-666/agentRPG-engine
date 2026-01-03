# Validator KPI & Auto-Archive Flow

## Run-ID Automation
- `npm run validate` вече генера автоматичен Run ID, когато липсва `--run-id` или е `auto`.
- Префиксът може да се управлява чрез `AGENTRPG_RUN_ID_PREFIX`.
- CLI логва генерирания ID (пример: `[INFO][RUN-ID] Generated run-id 'dev-xxxx'.`).

## KPI Metrics
- KPI файл (например `samples/blank-game/telemetry/kpi.sample.json`) подава метрики към telemetry log.
- Може да се посочи различен KPI път на игра: `--kpi games/demo/telemetry/kpi.sample.json`.
- Поддържат се полета `firstActiveQuestMs`, `refusalAttempts`, `refusalSuccesses`, `validationAttempts`, `completedQuests`, `debugEnabled`.

## Telemetry History per Game
- Основният history файл е `docs/analysis/reports/telemetry-history.json`.
- Възможно е всяка игра да има собствена history локация, например `games/demo/telemetry/history.json`.
- KPI + history функционалността се активира чрез `--log <path>` от CLI-то.

## Auto-Archive
- Флаг `--auto-archive <N>` задейства автоматична архивизация, когато history съдържа >= N run-а.
- Препоръчително е да ползваш нисък праг (2) по време на локални тестове и по-голям (5–10) за “production” валидации. Пример: `--auto-archive 8`.
- Архивите се записват в `docs/analysis/reports/archive/` (или относително към custom history, напр. `games/demo/telemetry/archive/`).
- Пример: `npm run validate -- --path games/demo --log games/demo/telemetry/history.json --kpi games/demo/telemetry/kpi.sample.json --auto-archive 2`.
- При успешно архивиране логът се занулява (`[]`).

## Препоръчителен Workflow
1. Базов run: `npm run validate -- --path <game> --summary --json reports/<game>-validation.json --log <game>/telemetry/history.json --kpi <game>/telemetry/kpi.sample.json`.
2. Ускори ежедневните проверки чрез npm скриптовете:
   - `npm run telemetry:demo`
   - `npm run telemetry:blank`
   - добави аналогичен script за други игри (копирай един от горните и смени пътищата).
3. След корекции: повтори командата и добави `--auto-archive` с праг според нуждите (2 за локален тест, 5+ за release builds).
4. Копирай последния strict `tmp-validation` към snapshot, когато искаш да следиш регресии: `copy reports\tmp-validation-strict.json reports\tmp-validation-snapshot.json`.
5. Ползвай `--snapshot reports/tmp-validation-snapshot.json` при следващата strict валидация, за да видиш нови/затворени кодове.
