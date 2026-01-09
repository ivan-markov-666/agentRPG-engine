# DLC-NG-02 · "Изграждане на цитаделата"

> **Quest type:** Town management / Resource strategy
> **State hooks:** `content_sets.next-guardians.state.structures`, `content_sets.next-guardians.state.town_morale`, `content_sets.next-guardians.state.legacy_rank`

## Сцена A — Планирането на сезони
- **Gameplay loop:** две фази (Пролет, Есен). Всяка фаза избираш две инициативи. Поддържа resource board `wood`, `ore`, `arcana`, `labor`.
- **Строежи / инициативи:**

| Инициатива | Цена | Skill check | Успех | Провал |
|------------|------|-------------|-------|--------|
| Tower bastion | 3 wood, 2 ore | Engineering DC 12 (advantage ако имаш engineer trainees) | `structures.push("tower")`, `legacy_rank += 1` | tension +5, mark `project_delay:tower` |
| Library annex | 2 wood, 2 arcana | Lore DC 11 (bonus ако Елена е лидер) | `structures.push("library")`, unlock `research_insight` | morale -5, NPC спор → side quest „Burned notes“ |
| Ward lattice | 2 arcana, 1 ore | Ritual DC 13 (requires heir_alignment ≠ pragmatic) | `structures.push("ward")`, `town_morale +5` | `arcana` изгаря, tension +5 |
| Diplomacy envoy | 1 ore, 1 labor | Diplomacy DC 12 (bonus ако legacy_rank ≥3) | unlock `plovdiv_alliance` flag | провал → `diplomacy_modifier -5`, запис `plovdiv_skepticism` |
| Militia drills | 2 labor | Athletics DC 11 (Стоян II bonus) | `structures.push("training_yard")`, morale +5 | injury token (нужни ресурси в сцена B) |

- **State hook:** записвай всяка инициатива: `state.content_sets.next-guardians.state.season_log.push({ season, initiative, result })`.

## Сцена B — Събития в лагера
- **Random event deck:** изтегли 2 карти на сезон. Примери:
  - **Flooded terraces** – Engineering DC 11 или жертва 1 wood. Успех → morale +5; провал → `structures` губят един tag „repair_needed“.
  - **Spy rumours** – Insight DC 12. Успех → `security_tokens +1`; провал → `heir_alignment = "pragmatic"` и tension +5.
  - **Festival of Guardians** – Lore DC 11 за ритуал. Успех → morale +10, `legacy_rank += 1`; провал → `dlc_note.festival_disaster = true`.
  - **Archivist visit** – ако библиотеката е готова, без check → unlock `codex_slot`.
- Реакциите тук влияят на `town_morale`, `heir_alignment shifts`, и блокове за сцена C (напр. ако имаш security token, получаваш advantage срещу sabotage).

## Сцена C — Съвет на наследниците
- **Setup:** вечерно събрание на мегдана. Показва се табло с натрупаните структури и morale.
- **Опции:**
  1. **Self-Reliance Manifest** – Requires `legacy_rank ≥ 3`. Дава `legacy_rank +1`, `tension +5`, записва `policy.self_reliance = true`.
  2. **Alliance with Plovdiv** – Requires `plovdiv_alliance` flag или Diplomacy DC 13. Успех → `resource.logistics = true` (можеш да преместиш ресурси в Quest 3); провал → morale -5, `plovdiv_skepticism = true`.
  3. **Call the Voinuks** – Requires `structures` включва `training_yard`. Разход: премахни `training_yard` (вместо това `voinuk_support = true`). Дава buff в DLC-04 и advantage срещу heavy infantry в Quest 3.
  4. **Seek Monastic Aid** – ако библиотеката е активна и `dlc1.shared_power`. Ritual DC 12; успех → unlock `ward_overcharge` (еднократно използване в сцена B/C на Quest 3).

## Outcomes
- **State Summary:**
```json
{
  "content_sets": {
    "next-guardians": {
      "state": {
        "structures": ["tower", "ward"],
        "town_morale": 62,
        "legacy_rank": 3,
        "alliances": {
          "plovdiv": true,
          "voinuks": false
        }
      }
    }
  }
}
```
- Ако `structures.length >= 3` → Quest 3 започва с бонус `defense_tokens = structures.length`.
- Ако morale < 40 → добави `crisis_card = "mutiny"` за началото на Quest 3.
