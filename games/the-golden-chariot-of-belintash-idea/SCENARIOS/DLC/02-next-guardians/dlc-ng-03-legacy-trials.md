# DLC-NG-03 · "Заветните изпитания"

> **Quest type:** Defense scenario / Moral dilemma
> **State hooks:** `content_sets.next-guardians.state.legacy_rank`, `content_sets.next-guardians.state.heir_alignment`, `content_sets.next-guardians.state.structures`

## Сцена A — Нощта преди атаката
- **Atmosphere:** лагерните огньове до стените на Забърдо, на фона на мъглата от долината. NPC-тата обсъждат слухове за обсадата.
- **Morale Gate:** ако `town_morale < 40`, появява се събитие „Whispers of retreat“ – Leadership DC 12 (advantage ако имаш `policy.self_reliance`). Провал → `mutiny_token = true`, което в сцена B добавя допълнителна вълна.
- **Command choice:** избери кой наследник води защитата. Всеки дава бонус:
  - **Елена** → +2 към Lore checks при активиране на ward-ове.
  - **Стоян II** → +2 към Athletics/Engineering за маневриране на балисти.
  - **Близнаците** → позволяват split command: `wind` дава бонус срещу infiltration, `earth` срещу siege.
- **State log:** `state.content_sets.next-guardians.state.trial_commander = "<hero>"`.

## Сцена B — Обсадата
- **Structure-driven waves:** по подразбиране 3 вълни; ако имаш `mutiny_token`, добавя се четвърта „Internal unrest“.

| Wave | Description | Recommended Resource | Checks | Rewards / Penalties |
|------|-------------|----------------------|--------|----------------------|
| Scouts | бързи разузнавачи с катапулти | Tower или Training Yard | Perception DC 12 / Ranged tactics | Успех → `legacy_rank += 1`; провал → `structures` губят `tower` tag (Damage) |
| Siege | тежки тарани и магьосници | Ward + Militia drills | Ritual DC 13 + Engineering DC 12 | Успех → `defense_tokens +=1`; провал → `town_morale -10`, tension +5 |
| Infiltration | шпиони минават през тунелите | Library / Security tokens | Insight DC 12, Stealth opposed | Успех → `dlc_note.spy_master_uncovered = true`; провал → unlock crisis „Saboteur“ |
| Internal unrest (if mutiny) | част от учениците искат евакуация | Heir alignment dependent | Speechcraft DC 12 (idealistic) или Intimidation DC 13 (pragmatic) | Успех → премахва `mutiny_token`; провал → `legacy_rank -1`, morale -10 |

- **Structure expenditure:** за всеки wave можеш да избереш да „изгориш“ структура за автоматичен успех (напр. пожертва Library → Infiltration auto success, но я махаш от state).
- **State updates:** след всяка вълна добавяй `state.content_sets.next-guardians.state.trial_log.push({ wave, result, consumables })`.

## Сцена C — Финалното решение
- **Alliance offers:** проверяват `alliances` и `heir_alignment`.
  1. **Stand Alone** – Requires `legacy_rank ≥ 3` и минимум 2 wave успеха. Награда: `buff.keepers_resolve = true`, `trials_result = "victory"`.
  2. **Accept Alliance** – достъпно ако `plovdiv_alliance` или `voinuk_support` са true. Diplomacy DC 12 (Plovdiv) или Athletics DC 11 (Voinuks). Успех → `trials_result = "alliance"`, запис `cross_dlc_boon = "<faction>"`. Провал → morale -5, но можеш да опиташ друга опция.
  3. **Secret Relocation** – ако morale < 35 или `structures` ≤1, можеш да евакуираш. Stealth DC 12 + Logistics (ако налично). Успех → `trials_result = "evacuated"`, unlock `dlc_hook.stealth_cells` за DLC-04. Провал → `legacy_rank -1`, tension +5.
  4. **Invoke Ward Overcharge** – само ако имаш `ward_overcharge`. Ritual DC 14; успех → третира се като Stand Alone victory, но консумира ward и оставя `town_morale -5` (изтощение).

## Outcomes
- Финалните стойности се записват:
```json
{
  "content_sets": {
    "next-guardians": {
      "state": {
        "legacy_rank_final": "<value>",
        "structures": ["tower", "ward"],
        "heir_alignment": "wind",
        "trials_result": "victory",
        "cross_dlc_boon": "plovdiv"
      }
    }
  },
  "dlc_state": {
    "next_guardians": {
      "morale": 68,
      "defense_tokens": 3
    }
  }
}
```
- Добави `journal_entries.push("dlc2.legacy_trials_complete")` и telemetry note `dlc2_wave_successes`.
- Hook към други DLC:
  - `trials_result = "victory"` → DLC-03 започва с `diplomacy_reputation +10`.
  - `trials_result = "alliance"` → DLC-03 получава shortcut към Plovdiv court, DLC-04 получава allied reinforcements.
  - `trials_result = "evacuated"` → DLC-04 отключва stealth opener, но morale бонусите се губят.
