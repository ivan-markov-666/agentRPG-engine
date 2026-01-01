# Blank Game Skeleton

Този скелет служи като „чиста“ игра, която минава валидатора без допълнителни стъпки и съдържа всички задължителни файлове, описани в Product Brief v1.

## Съдържание
| Папка/файл | Описание |
|------------|----------|
| `manifest/entry.json` | Основен manifest с pointers към всички останали ресурси. |
| `scenario/index.md` | Главен сценарен индекс с линкове към areas/quests. |
| `scenario/areas/default-area.md` | Минимална area с guardrail-friendly секции. |
| `scenario/quests/available.json` / `unlock-triggers.json` | Quest каталог + unlock правила. |
| `scenario/quests/main-quest-01.md` | Основен quest пример. |
| `scenario/world/index.md` | World frame (сетинг, тон, ограничения). |
| `config/capabilities.json` | Активирани capabilities и диапазони. |
| `player-data/session-init.json` | Стартова конфигурация (includes `preferred_language`). |
| `player-data/runtime/*.json` | `state.json`, `completed-quests.json`, `exploration-log.json`, `history.full.jsonl`. |
| `player-data/saves/` | Примерен save index + save файл. |
| `ui/*.json` | Scene/actions/hud/history/index sample файлове. |
| `README.md` (този файл) | Инструкции за работа със скелета. |

## Quick Start
1. **Копирай скелета**
   - CLI helper: `npm run blank:copy -- --dest games/my-new-game`
   - Ръчно: `cp -R samples/blank-game games/my-new-game` (Bash) или `Copy-Item samples/blank-game games\my-new-game -Recurse` (PowerShell)
2. **Актуализирай идентификатори и език**
   - Редактирай `manifest/entry.json` (`id`, `game_id`, `title`).
   - Задай език/дебъг чрез helper-а (по избор): `npm run lang:set -- --game my-new-game --language bg --debug true`.
   - При нужда промени `player-data/session-init.json` ръчно (например `run_id` или други полета).
3. **Попълни съдържание**
   - Scenario: добави нови quests/areas, обнови `scenario/index.md`.
   - Runtime state: настрой `player-data/runtime/state.json` според capabilities.
   - UI файлове: опиши началната сцена в `ui/scene.json`, действия в `ui/actions.json`, HUD стойности и т.н.
4. **Пусни валидатора**
   ```bash
   npm run validate -- --path games/my-new-game --run-id dev-local --summary
   ```
   Очакван резултат: 0 errors / 0 warnings.
5. **Започни runtime smoke** (по избор)
   ```bash
   npm run runtime -- --path games/my-new-game --debug
   ```

## Как да обновиш скелета
- **Capabilities**: обнови `config/capabilities.json` и след това синхронизирай `player-data/runtime/state.json`.
- **Quests**: използвай `npm run quest:add -- --path games/my-new-game ...` за автоматични scaffolds.
- **Areas**: `npm run area:add -- --path games/my-new-game ...`.
- **Scenario index**: `npm run scenario:index -- --game my-new-game`.

## Валидиране в CI / tests
- Smoke тестът в `tools/tests/blank-game.test.ts` копира скелета в temp директория и пуска валидатора с `--summary`.
- Поддържай скелета в синхрон с Product Brief: при промени в контрактите обновявай и този README.
