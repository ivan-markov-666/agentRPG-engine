# DLC-LS-01 · „Сенки над Лаут“

> **Тип:** Разузнаване + дипломация + социално разследване
> **Focus:** `defense_phase = "scouting"`, инициране на safehouses, установяване на морала

## Сцена A — Съветът на фамилиите
- Капитан Ана събира трите водещи фамилии (Иваш, Кормар, Драгаш).
- Играчът прави два избора:
  1. **Diplomacy (Presence/Lore DC 12):** убеждаваш колебаеща се фамилия → `woinuk_morale +5`, `safehouses.push("clan_<name>")`.
  2. **Warden Insight (Lore 13):** анализираш ward руни → подсказка за шпионин (`espionage_alert -1` ако успех).
- Провал при двата чека → `woinuk_morale -5`, `espionage_alert +1`.

## Сцена B — Разузнавателни маршове
- Tactical mini-game с 3 маршрута (ridge, river, tunnels).
- За всеки избран маршрут: хвърли skill check (Survival/Stealth 12). Успех → получаваш `intel_token`. Провал → `hazard_tokens +1` или `stronghold_integrity -3`.
- Събираш поне 2 `intel_token`, за да отключиш safehouse карта в Сцена C.

## Сцена C — Шпионът „Тъмната струя“
- Социално разследване в избрано safehouse.
- Mini-logic puzzle: съпоставяш `intel_token` с NPC testimonies.
- Успех → маркираш infiltratora → `espionage_alert = max(0, current-1)` и `safehouses.push("loyalist")`.
- Провал → шпионинът саботира ward складирането → `ward_power -1`, `hazard_tokens +1`.

## State Hooks
```json
{
  "content_sets": {
    "laut-stronghold": {
      "state": {
        "defense_phase": "scouting",
        "woinuk_morale": 65,
        "espionage_alert": 2,
        "safehouses": ["clan_ivash"],
        "artifact_insight": ["ward_pillar_alpha"],
        "notes": "Шпионът наблюдава тунелите"
      }
    }
  }
}
```
