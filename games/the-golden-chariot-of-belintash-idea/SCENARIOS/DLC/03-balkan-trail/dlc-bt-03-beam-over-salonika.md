# DLC-BT-03 · "Лъчът над Солун"

> **Quest type:** Multi-phase finale / Diplomatic choice / Artifact ritual
> **State hooks:** `content_sets.balkan-trail.state.trails_resolution`, `alliance_track.*`, `artifact_clues`, `convoy_morale`

## Сцена A — Нощта преди ритуала
- Camp outside Thessaloniki. Играчът прави последна проверка на `artifact_clues`. Ако <3 → трябва да импровизира (Lore DC 13 или жертва 1 supply, иначе финалният ритуал е по-труден).
- Morale gate: ако `convoy_morale < 40` → event "Doubt" (Leadership DC 12), при провал `trail_notes.push("mutiny_risk")` и wave в сцена B.
- Подготвяш кой ally да поканиш (Byzantine magi, Latin artificers, Voinuk guardians, или Solo).

## Сцена B — Порталът на Лъча
- Encounter board със три колони (Ward, Mechanism, Chorus). Всяка се решава чрез skill check/ally support.
- **Allied routes:**
  - **Byzantine:** Ritual DC 13 → ако успешно, `trails_resolution = "byzantine"`, получаваш ward buff за DLC-04.
  - **Latin:** Engineering DC 12 + Logistics cost → `trails_resolution = "latin"`, unlock supply airship hook.
  - **Voinuk:** Warfare/Athletics DC 12 → `trails_resolution = "voinuk"`, heavy infantry reinforcement.
  - **Solo:** Requires `artifact_clues` = 4+ и `trail_notes` да съдържа "guardian_pass_secured". Успех → stealth opener за DLC-04, но tension +10.
- Провал на някоя колона → `convoy_morale -10`, трябва backup plan (жертва ally или supply).

## Сцена C — Решението за лъча
- След като портала се стабилизира, NPC-ти спорят дали лъчът да се активира с външна помощ или да се заключи.
- Играчът избира:
  1. **Open the beam** (requires alliance track ≥2 с избраната фракция). Дава NG+ artifact, но фракцията иска услуга (hook в DLC-04).
  2. **Seal the beam** (Lore DC 14). Записва `trails_resolution = "solo"`, tension +5, но пазиш независимост.
  3. **Split the power** – ако имаш `artifact_clues` от минимум две фракции. Разпределя buffs, но risk → roll d6, 1-2 → malfunction (NG+ debuff).

## Outcomes
- Задължително записвай:
  ```json
  "content_sets": {
    "balkan-trail": {
      "state": {
        "trails_resolution": "byzantine",
        "convoy_morale": 70,
        "artifact_clues": ["prism_resonance", "plovdiv_code"],
        "trail_notes": ["guardian_pass_secured"]
      }
    }
  }
  ```
- Добави `dlc_state.balkan_trail.boon = <resolution>` за telemetry/NG+.
- Journal entry: "Beam over Salonika completed".
