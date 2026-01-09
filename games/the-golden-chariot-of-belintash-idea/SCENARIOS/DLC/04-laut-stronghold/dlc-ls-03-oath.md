# DLC-LS-03 · „Клетвата към лъча“

> **Тип:** Финално решение – ward ритуал, дипломатически избор, възможна евакуация
> **Focus:** `defense_phase = "aftermath"`, заключване на `oath_resolution`, NG+ hook

## Сцена A — Залата на клетвите
- Beam envoy + воинушки капитани + археолозите обсъждат бъдещето на Лаут.
- Играчът избира стратегия:
  1. **Ward Oath:** Вторично активиране на beam (Lore + Presence 14, разход `ward_power ≥ 2`). Успех → `oath_resolution = "ward"`, `artifact_insight.push("beam_anchor")`.
  2. **Evacuation Convoy:** Requires `safehouses >= 2`. Организираш тайно извозване на артефакти (Logistics 13). Успех → `oath_resolution = "evacuation"`, `stronghold_integrity -5`.
  3. **Shadow Pact:** Ако `espionage_alert ≥ 3`, можеш да превърнеш шпионите в двойни агенти (Deception 14). Успех → `oath_resolution = "betrayal"`, но tension +10 за бъдещи DLC.

## Сцена B — Последната атака
- В зависимост от избора:
  - **Ward Oath:** Beam shield → `hazard_tokens = 0`, но roll d6; 1–2 → ward backlash (-10 morale).
  - **Evacuation:** Escort skill challenge (Athletics/Stealth/Lore). Провал → губиш artifact.
  - **Shadow Pact:** Засада срещу наемниците; ако провалиш Warfare 13 → `safehouses.splice(0,1)`.

## Сцена C — Epilogue Hooks
- Опиши последиците в journaling секция:
  - Ward: Лаут става beam bastion, unlock `dlc_state.laut.blessing = "ward"`.
  - Evacuation: получаваш `artifact.sun_eye_fragment_ii`, но селото остава уязвимо.
  - Betrayal: Войнушките фамилии се разделят, но получаваш `dlc_state.laut.blessing = "stealth"` за NG+.
- Добави journal entry „Oath of Laut".

## State Hooks
```json
{
  "content_sets": {
    "laut-stronghold": {
      "state": {
        "defense_phase": "aftermath",
        "stronghold_integrity": 60,
        "ward_power": 1,
        "oath_resolution": "ward",
        "artifact_insight": ["beam_anchor"],
        "safehouses": ["clan_ivash", "clan_kormar"],
        "notes": "Beam shield активен; нови должности за NG+"
      }
    }
  },
  "dlc_state": {
    "laut": {
      "blessing": "ward"
    }
  }
}
```
