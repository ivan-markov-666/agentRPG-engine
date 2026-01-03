# Blank Game README (LLM-friendly)

Example steps for creating a game from the `samples/blank-game/` skeleton (the structure can be copied into `games/<gameId>/`).

## Steps
1. Copy the `samples/blank-game/` skeleton into `games/<gameId>/` (if `samples/` is missing, just create the structure below).
2. Fill in `manifest/entry.json` (game identity, pointers to files, capabilities file).
3. Fill in `scenario/index.md` + at least 1 quest file (main quest) and 1 area (`scenario/areas/default-area.md`).
4. Fill in `scenario/quests/available.json` (ID ↔ title) and `unlock-triggers.json` (unlock conditions).
5. Fill in `player-data/session-init.json` (player name, `preferred_language`, optional debug).
6. Fill in `player-data/runtime/state.json` (example active quests and stats).
7. Fill in `config/capabilities.json` (example below). If you add/remove a capability, keep it in sync with `state.json`.
8. (Maps, optional but recommended) Copy `maps/` directory, then adjust `manifest/entry.json` pointers (`map_world_index`, `map_assets_dir`, `map_cli`). Update the world/area JSON files with your regions/hotspots.
9. Start the session (GM validation). Fix WARN/ERROR messages (see the validation codes table in Step 3).

### Map assets quick reference
- `maps/world/index.json` describes the global atlas (image, regions pointing to area maps, ASCII preview + legend). Image file lives next to it.
- `maps/areas/<areaId>.json` describes hotspots/bounding boxes within the area and references its PNG/JPG/SVG. ASCII preview is used for CLI fallbacks (HUD mini-map, screenshots).
- `manifest/entry.json` optional pointers:
  - `map_world_index`: relative path to the world JSON (`maps/world/index.json` in the skeleton).
  - `map_assets_dir`: folder containing `world/` and `areas/` subdirectories (defaults to `maps/` in the skeleton).
  - `map_cli`: metadata to document helper commands (future CLI `map:add`, `map:minimap`). Add entries that make sense for your tooling.
- When adding new areas/regions, duplicate the existing JSON files, update coordinates/legend, and keep image paths relative to the game root. Validator expects referenced files to exist when these pointers are present.

## Minimal structure
```
<gameId>/
  manifest/entry.json
  config/capabilities.json
  player-data/
    session-init.json
    runtime/
      state.json
      completed-quests.json
      exploration-log.json
    saves/
      index.json (optional)
  scenario/
    index.md
    areas/
      default-area.md
    quests/
      available.json
      unlock-triggers.json
      main-quest-01.md
  maps/
    world/
      index.json
      world.png
    areas/
      default-area.json
      default-area.png
```

## Example `config/capabilities.json`
The ranges are examples; tune them per game.
```json
{
  "health": { "enabled": true, "desc": "HP", "min": 0, "max": 100 },
  "energy": { "enabled": true, "desc": "Stamina", "min": 0, "max": 100 },
  "mana": { "enabled": true, "desc": "Magic energy", "min": 0, "max": 100 },
  "stamina": { "enabled": true, "desc": "Physical endurance", "min": 0, "max": 100 },
  "hunger": { "enabled": true, "desc": "Hunger level", "min": 0, "max": 100 },
  "thirst": { "enabled": true, "desc": "Thirst level", "min": 0, "max": 100 },
  "reputation": { "enabled": true, "desc": "Faction reputation per group", "range": [-100, 100] },
  "currency": { "enabled": true, "desc": "Gold", "min": 0 },
  "morale": { "enabled": true, "desc": "Party morale", "min": -100, "max": 100 },
  "armor": { "enabled": true, "desc": "Physical damage reduction", "min": 0, "max": 50 },
  "stealth": { "enabled": true, "desc": "Sneak ability", "min": 0, "max": 100 },
  "perception": { "enabled": true, "desc": "Detect hidden", "min": 0, "max": 100 },
  "crit_chance": { "enabled": true, "desc": "Chance to crit", "min": 0, "max": 1 },
  "crit_multiplier": { "enabled": true, "desc": "Critical damage multiplier", "min": 1, "max": 3 }
}
```

## Example `player-data/runtime/state.json` (stats part)
```json
{
  "stats": {
    "health": 50,
    "energy": 50,
    "mana": 0,
    "stamina": 50,
    "morale": 0,
    "hunger": 20,
    "thirst": 20,
    "reputation": {
      "village": 0
    },
    "currency": {
      "gold": 50
    },
    "armor": 5,
    "stealth": 8,
    "perception": 12,
    "crit_chance": 0.05,
    "crit_multiplier": 1.5
  }
}
```

## Notes
- Validation codes are in Step 3 of the product brief (format `[LEVEL][CODE] file:message (suggested fix)`).
- If a capability is enabled in `config/capabilities.json`, add it to runtime `stats` (or unlock it). Missing/duplicate → CAP-MISSING/CAP-DUP.
- If min > max → CAP-RANGE; if a runtime value is missing → CAP-RUNTIME.
- Reputation is per faction (e.g. `guild`, `village`); you can add other keys.
- currency can be a map by type (gold, gems, credits) without an upper limit.
- Naming guide: snake_case, add `desc`; keep boolean keys explicit (`is_cursed`), describe map keys in `desc`.
- Minimal set: health/energy/quests/inventory; combat adds armor/crit/block/dodge; magic adds mana/mana_regen/spell_power/resist; survival adds hunger/thirst/fatigue; stealth/perception for stealth-heavy games.
- HUD recommendation: bars for health/energy/mana, list of status_effects, map for reputation/currency, needs (fatigue/hunger/thirst).
- Status effects: bool/stack; specify the effect (DoT/CC) and how it is cured; CAP-* are blocking, CAP-RUNTIME/UNUSED are WARN.
- GM validation checklist: start → validate required files + capabilities; messages `[LEVEL][CODE] file:message (suggested fix)`; CAP-* blocks, WARN does not; if the GM auto-creates a quest/area, it logs and explains what to fill in.

## Example `ui/hud.json` (skeleton)
```json
{
  "schema_version": "ui.hud.v1",
  "bars": {
    "health": {"current": 32, "max": 100, "label": "HP"},
    "energy": {"current": 12, "max": 100, "label": "Energy"},
    "mana": {"current": 0, "max": 100, "label": "Mana"}
  },
  "status_effects": [
    {"id": "poisoned", "label": "Poisoned", "stack": 0},
    {"id": "stunned", "label": "Stunned", "active": false}
  ],
  "reputation": {"guild": 15, "village": -5},
  "currency": {"gold": 120},
  "needs": {"hunger": 20, "thirst": 10, "fatigue": 5},
  "location": {"area_id": "village-square", "title": "Village Square"},
  "quest_summary": {"active": ["main-quest-01"], "hint": "Talk to the elder"},
  "buffs": [{"id": "blessing", "label": "Blessing", "duration": "3 turns"}],
  "notes": "Customize fields per game; HUD is read-only"
}
```
