# DLC-BT-02 · "Пазители на прохода"

> **Quest type:** Expedition encounter loop / Diplomacy vs Sabotage
> **State hooks:** `content_sets.balkan-trail.state.alliance_track.*`, `convoy_morale`, `supply_tokens`, `trail_notes[]`

## Сцена A — Проходът край Кричим
- Hex map със три входа: дипломатически (манастир), контрабанден тунел, открит път.
- Играчът избира approach:
  - **Diplomacy:** Presence/Lore checks (DC 12). Успех → `alliance_track.byzzies += 1`, `convoy_morale +5`.
  - **Sabotage:** Stealth/Athletics (DC 13). Успех → `supply_tokens += 1`, unlock "smuggler" side-route.
  - **Brute escort:** Warfare (DC 11). Успех → remove hazard, но tension +5.
- Провал → `convoy_morale -10`, trigger crisis card "Rockslide" (разход 1 supply).

## Сцена B — Пловдивският пазар
- Социална карта: латински инженери, местни търговци, воинушки патрули.
- Mini-game: избираш до 2 искания (gear, intel, passage). Всяко плаща с `artifact_clues`, `supply_tokens` или дипломатически обещания.
- If DLC-02 `structures.includes("library")` → допълнителен lore roll за свитък (clue).
- **State outcomes:**
  - `alliance_track.latins += 1` ако изпълниш искане.
  - `artifact_clues.push("plovdiv_code")` при успех на Lore DC 12.

## Сцена C — Засада в прохода "Пазителите"
- Encounter с избраната фракция: voinuk scouts срещу латински legionaries.
- Играчът може да:
  1. **Negotiate armistice** (Diplomacy 12, bonus ако `heir_alignment = wind`).
  2. **Stage diversion** (Stealth 12, разход 1 supply).
  3. **Call reinforcements** (requires alliance track ≥2 за някоя фракция).
- Успешно решение → `trail_notes.push("guardian_pass_secured")`, `convoy_morale +5`.
- Провал → `convoy_morale -10`, `trail_notes.push("guardian_pass_blocked")` → Quest 3 започва с допълнителен hazard wave.

## Outcomes
- `alliance_track` отразява поне едно положително изменение.
- `supply_tokens` може да падне до 0 → ако да, Quest 3 започва с кризисен event "Resupply".
- Journal entry: "Guardians' Pass negotiated".
