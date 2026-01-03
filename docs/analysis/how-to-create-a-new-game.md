# How to Create a New Game (AgentRPG Engine)

This document describes the **end-to-end** process for creating a new game on top of AgentRPG Engine — from copying the skeleton, through filling the required files, to validation, runtime smoke checks, and telemetry/KPI.

## 1) Quick start (blank game skeleton)

1. **Copy the skeleton**
   - Recommended (CLI helper):
     ```bash
     npm run blank:copy -- --dest games/<gameId>
     ```
   - Manual:
     - Bash: `cp -R samples/blank-game games/<gameId>`
     - PowerShell: `Copy-Item samples/blank-game games\<gameId> -Recurse`

2. **Set language / debug mode (optional)**
   ```bash
   npm run lang:set -- --game <gameId> --language bg --debug true
   ```

3. **Run the validator**
   ```bash
   npm run validate -- --path games/<gameId> --run-id dev-local --summary --strict
   ```

## 2) Minimal structure (source of truth)

The minimal set of files for a playable game is based on Product Brief v1 and the validator contracts:

```
<gameId>/
  manifest/entry.json
  config/capabilities.json
  scenario/
    index.md
    areas/
      default-area.md
    quests/
      available.json
      unlock-triggers.json
      main-quest-01.md
    world/
      index.md
  player-data/
    session-init.json
    runtime/
      state.json
      completed-quests.json
      exploration-log.json
      history.full.jsonl
    saves/
      index.json
      saves/
        save-001.json
  ui/
    index.json
    scene.json
    actions.json
    hud.json
    history.json
```

## 3) What to edit first (recommended order)

1. **`manifest/entry.json`**
   - `id`, `title`, `version`
   - pointers to:
     - `capabilities_file`
     - `scenario_index`
     - `ui_index`
     - `saves_index`
     - `full_history_file`
     - `map_world_index`, `map_assets_dir`, `map_cli` (optional but recommended when you ship atlases/maps)

2. **`config/capabilities.json`**
   - Enable only the capabilities you want to use.
   - Keep `state.json` in sync with enabled capabilities (the validator checks runtime presence/ranges).

3. **`player-data/session-init.json`**
   - `preferred_language` is required.
   - `debug` is optional.

4. **`scenario/index.md` + quests/areas**
   - `scenario/quests/available.json` must contain at least 1 quest.
   - `scenario/quests/unlock-triggers.json` must be valid JSON and must not reference missing quest IDs.

5. **UI contracts (`ui/*.json`)**
   - `ui/index.json` points to the other UI files.
   - Each file has `schema_version` and is validated by schemas in `tools/validator/schemas/`.

## 4) Quest authoring (CLI tooling)

### Add a quest
Use the helper (if you want a scaffold):
```bash
npm run quest:add -- --path games/<gameId> --id side-quest-01 --title "Side Quest 01"
```

### Scenario index
After adding quests/areas, update the indexes:
```bash
npm run scenario:index -- --game <gameId>
```

## 5) Area authoring (CLI tooling)

### Add an area
```bash
npm run area:add -- --path games/<gameId> --id town-square --title "Town Square"
```

### Map assets (world + area)
- World atlas lives under `maps/world/index.json` + image (PNG/JPG/SVG). Each region links to `maps/areas/<areaId>.json`.
- Area maps describe hotspots/bounding boxes and reference their image file. Both JSONs include `ascii_preview`/`legend` for CLI fallback.
- Recommended helpers (coming from tooling roadmap): `npm run map:add -- --game <gameId> --area <areaId>` (scaffold JSON + ASCII) and `npm run map:minimap -- --game <id> --area <areaId>` (preview in console). Until the CLI ships, copy the blank-game samples and edit coordinates/headings manually.
- Update `manifest/entry.json` with:
  - `map_world_index`: relative path to the world JSON.
  - `map_assets_dir`: directory that contains map images/JSON.
  - `map_cli`: version + optional helper commands (so LLM tooling knows how to call the helpers).
- Keep images inside the game folder; do not reference absolute paths.

## 6) Validation (local DoD loop)

Recommended local loop:

1. Run the validator:
   ```bash
   npm run validate -- --path games/<gameId> --run-id dev-local --json reports/last.json --append --snapshot reports/last.json --strict --summary
   ```
2. Fix WARN/ERROR codes.
3. Repeat until you get a clean result.

Output format:
`[LEVEL][CODE] file:message (suggested fix)`

## 7) Runtime smoke (optional)

```bash
npm run runtime -- --path games/<gameId> --debug
```

Expected behavior:
- the runtime loader loads manifest + pointers
- it confirms `preferred_language`
- UI files are valid and present

## 8) Telemetry / KPI workflow (ST-035)

### 8.1 KPI file for a session
KPI measurements are provided as a JSON file. There is an example:
- `samples/blank-game/telemetry/kpi.sample.json`

Recommended location for your game:
- `games/<gameId>/telemetry/kpi.json`

You can update it with the helper:
```bash
npm run kpi:update -- --game <gameId> --first-min 2.5 --refusal-attempts 1 --refusal-successes 1 --validation-attempts 2 --completed-quests 1 --debug false
```

### 8.2 Logging a telemetry entry
To write a telemetry entry with KPI metrics:
```bash
npm run validate -- --path games/<gameId> --run-id dev-local --log docs/analysis/reports/telemetry-history.json --kpi games/<gameId>/telemetry/kpi.json
```

### 8.3 Metrics report
```bash
npm run metrics:report -- --history docs/analysis/reports/telemetry-history.json --insights docs/analysis/metrics-insights.md
```

## 9) Common problems (troubleshooting)

- **`[ERROR][RUN-ID] Missing required --run-id`**
  - Always pass `--run-id`. You can generate one via the helper scripts `tools/scripts/run-id.(ps1|sh)`.

- **`FILE-MISSING`**
  - A required file is missing (most commonly manifest, scenario index, saves index, or a UI pointer).

- **`CAP-*`**
  - Capabilities and runtime state are out of sync (missing stats, invalid ranges, duplicates, etc.).

- **UI schema violations**
  - Check `ui/index.json` pointers and the `schema_version` in each UI file.

## 10) Definition of Done (recommendation)

- ≥3 consecutive clean runs (0 errors / 0 warnings) with `--summary --strict`.
- `metrics:report` shows stable KPIs and no regressions in key metrics.

### Migration note (maps, Jan 2026)
- Existing games can keep running without map pointers, but to adopt the atlas/minimap features add the optional fields to `manifest/entry.json` and create the `maps/` directory following the skeleton example. The validator treats map pointers as optional unless they are present; once added, the referenced files/images must exist and pass the new schemas.
