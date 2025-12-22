# Blank Game README (LLM-friendly)

Примерни стъпки за създаване на игра по скелета `samples/blank-game/` (структурата може да се копира в `games/<gameId>/`).

## Стъпки
1) Копирай скелета `samples/blank-game/` в `games/<gameId>/` (ако липсва `samples/`, просто създай структурата по-долу).
2) Попълни `manifest/entry.json` (идентичност на играта, pointers към файловете, capabilities файл).
3) Попълни `scenario/index.md` + поне 1 quest файл (main quest) и 1 area (`scenario/areas/default-area.md`).
4) Попълни `scenario/quests/available.json` (ID ↔ title) и `unlock-triggers.json` (условия за unlock).
5) Попълни `player-data/session-init.json` (име на играч, `preferred_language`, optional debug).
6) Попълни `player-data/runtime/state.json` (примерни активни quest-ове и stats).
7) Попълни `config/capabilities.json` (пример по-долу). Ако добавяш/махаш capability, дръж sync със `state.json`.
8) Стартирай сесията (GM валидация). Фиксирай WARN/ERROR съобщенията (виж таблицата с validation codes в Step 3).

## Минимална структура
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
      index.json (по избор)
  scenario/
    index.md
    areas/
      default-area.md
    quests/
      available.json
      unlock-triggers.json
      main-quest-01.md
```

## Примерен `config/capabilities.json`
Диапазоните са примерни; настрой ги според играта.
```json
{
  "health": {"enabled": true, "desc": "HP", "min": 0},
  "energy": {"enabled": true, "desc": "Stamina", "min": 0},
  "mana": {"enabled": true, "desc": "Magic energy", "min": 0, "max": 100},
  "stamina": {"enabled": true, "desc": "Physical endurance", "min": 0, "max": 100},
  "hunger": {"enabled": true, "desc": "Hunger level", "min": 0, "max": 100, "note": "below 10 -> penalties"},
  "thirst": {"enabled": true, "desc": "Thirst level", "min": 0, "max": 100, "note": "below 10 -> penalties"},
  "reputation": {"enabled": true, "desc": "Faction reps", "range": [-100, 100]},
  "currency": {"enabled": true, "desc": "Gold", "min": 0},
  "armor": {"enabled": true, "desc": "Physical damage reduction"},
  "magic_resist": {"enabled": false, "desc": "Magical damage reduction"},
  "stealth": {"enabled": true, "desc": "Sneak ability"},
  "perception": {"enabled": true, "desc": "Detect hidden"}
}
```

## Примерно `player-data/runtime/state.json` (stats част)
```json
{
  "stats": {
    "health": 32,
    "energy": 12,
    "mana": 0,
    "stamina": 18,
    "morale": 50,
    "hunger": 20,
    "thirst": 10,
    "reputation": {
      "guild": 15,
      "village": -5
    },
    "currency": {
      "gold": 120
    },
    "armor": 5,
    "stealth": 8,
    "perception": 12
  }
}
```

## Бележки
- Validation codes са в Step 3 на product brief (формат `[LEVEL][CODE] file:message (suggested fix)`).
- Ако capability е enabled в `config/capabilities.json`, добави го и в runtime `stats` (или го отключи). Липсващ/дублиран → CAP-MISSING/CAP-DUP.
- При min > max → CAP-RANGE; при липсваща runtime стойност → CAP-RUNTIME.
- Репутации са per faction (пример `guild`, `village`); можеш да добавиш други ключове.
- currency може да е map по видове (gold, gems, credits) без горен лимит.
- Naming guide: snake_case, добавяй `desc`; Boolean ключове ясни (`is_cursed`), map ключове опиши в `desc`.
- Минимален сет: health/energy/quests/inventory; combat добавя armor/crit/block/dodge; magic добавя mana/mana_regen/spell_power/resist; survival добавя hunger/thirst/fatigue; stealth/perception за stealth-heavy игри.
- HUD препоръка: bars за health/energy/mana, списък status_effects, map за reputation/currency, нужди (fatigue/hunger/thirst).
- Status effects: bool/stack; уточни ефект (DoT/CC) и как се cure-ва; CAP-* са blocking, CAP-RUNTIME/UNUSED са WARN.
- GM validation checklist: стартирай → валидирай задължителни файлове + capabilities; съобщения `[LEVEL][CODE] file:message (suggested fix)`; CAP-* блокират, WARN не; ако GM auto-създаде quest/area, логва и казва какво да се попълни.

## Примерен `ui/hud.json` (скелет)
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
