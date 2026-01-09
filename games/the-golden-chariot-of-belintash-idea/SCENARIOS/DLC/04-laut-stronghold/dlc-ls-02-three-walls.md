# DLC-LS-02 · „Обсадата на Трите стени“

> **Тип:** Тактическа защита в три фази + ward ритуали в тунелите
> **Focus:** `defense_phase = "siege"`, управление на `stronghold_integrity`, `ward_power`, `hazard_tokens`

## Сцена A — Външният пръстен
- Избираш commander (Aна / Beam envoy / наследник). Командирът дава различни buff-ове.
- Encounter board с три choke точки: North Gate, Cliff Ladder, Hidden Drain.
- За всяка точка хвърляш Warfare/Leadership check (DC 13). Успех → `stronghold_integrity +3`. Провал → `hazard_tokens +1` и Minor Breach.
- Специална опция: **Use Supplies** (похарчва `supply_tokens` ако пренесени от DLC-03) → reroll.

## Сцена B — Средните тунели и ward камерите
- Пъзел: активираш ward колони в правилен ред. Използвай `artifact_insight` от DLC-03/quest1.
- Skill combo (Lore + Craft DC 12). Успех → `ward_power +1` и `hazard_tokens -1`.
- Ако `espionage_alert ≥ 3`, саботаж намаля ward power, освен ако не направиш Stealth/Insight 13 за да хванеш шпионин.

## Сцена C — Inner Keep & Hearth Ritual
- Кулминация с масиран assault. Играчът избира една от тактики:
  1. **Counter-charge:** Warfare DC 14, награда `stronghold_integrity +5`, риск `woinuk_morale -5`.
  2. **Ward Nova:** изразходва `ward_power ≥ 2`, прави Area stun → `hazard_tokens -2`, но `artifact_insight.push("nova_stress")`.
  3. **Secret Tunnel Evac:** Requires `safehouses >=2`. Запазва хората, но `stronghold_integrity -5` (временно отстъпление).
- След сцената update-ваш `defense_phase = "aftermath"` ако integrity >50, иначе остава "siege" за quest 3 (hard mode).

## State Hooks
```json
{
  "content_sets": {
    "laut-stronghold": {
      "state": {
        "defense_phase": "siege",
        "stronghold_integrity": 72,
        "ward_power": 3,
        "hazard_tokens": 1,
        "woinuk_morale": 70,
        "notes": "Втора стена задържа натиска"
      }
    }
  }
}
```
