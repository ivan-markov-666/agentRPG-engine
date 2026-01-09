# Blank Game Skeleton

This skeleton is a “clean” game that passes the validator without extra steps and includes all mandatory files described in Product Brief v1.

## Contents
| Folder/File | Description |
|------------|-------------|
| `manifest/entry.json` | Main manifest with pointers to all other resources. |
| `scenario/index.md` | Primary scenario index with links to areas/quests. |
| `scenario/areas/default-area.md` | Minimal area with guardrail-friendly sections. |
| `scenario/quests/available.json` / `unlock-triggers.json` | Quest catalog + unlock rules. |
| `scenario/quests/main-quest-01.md` | Example main quest. |
| `scenario/world/index.md` | World frame (setting, tone, constraints). |
| `config/capabilities.json` | Enabled capabilities and ranges. |
| `player-data/session-init.json` | Launch configuration (includes `preferred_language`). |
| `player-data/runtime/*.json` | `state.json`, `completed-quests.json`, `exploration-log.json`, `history.full.jsonl`. |
| `player-data/saves/` | Sample save index + save file. |
| `ui/*.json` | Sample scene/actions/hud/history/index files. |
| `README.md` (this file) | Instructions for working with the skeleton. |

## Quick Start
1. **Copy the skeleton**
   - CLI helper: `npm run blank:copy -- --dest games/my-new-game`
   - Manual: `cp -R samples/blank-game games/my-new-game` (Bash) or `Copy-Item samples/blank-game games\my-new-game -Recurse` (PowerShell)
2. **Update identifiers and language**
   - Edit `manifest/entry.json` (`id`, `game_id`, `title`).
   - Set language/debug via the helper (optional): `npm run lang:set -- --game my-new-game --language bg --debug true`.
   - If needed, adjust `player-data/session-init.json` manually (e.g. `run_id` or other fields).
3. **Fill in content**
   - Scenario: add new quests/areas, update `scenario/index.md`.
   - Runtime state: configure `player-data/runtime/state.json` according to the capabilities.
   - UI files: describe the starting scene in `ui/scene.json`, actions in `ui/actions.json`, HUD values, etc.
4. **Run the validator**
   ```bash
   npm run validate -- --path games/my-new-game --run-id dev-local --summary
   ```
   Expected result: 0 errors / 0 warnings.
5. **Start runtime smoke** (optional)
   ```bash
   npm run runtime -- --path games/my-new-game --debug
   ```

## How to update the skeleton
- **Capabilities**: update `config/capabilities.json`, then sync `player-data/runtime/state.json`.
- **Quests**: use `npm run quest:add -- --path games/my-new-game ...` for automatic scaffolds.
- **Areas**: `npm run area:add -- --path games/my-new-game ...`.
- **Scenario index**: `npm run scenario:index -- --game my-new-game`.

## Validation in CI / tests
- The smoke test in `tools/tests/blank-game.test.ts` copies the skeleton into a temp directory and runs the validator with `--summary`.
- Keep the skeleton in sync with the Product Brief: whenever contracts change, update this README as well.
