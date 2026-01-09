# DLC-NG-01 · "Инициации и наследства"

> **Quest type:** Narrative / Training arcs
> **State hooks:** `content_sets.next-guardians.state.legacy_rank`, `state.flags.quest_hook_next_generation`

## Сцена A — Съветът в Забърдо
- **Set-up:** кръглата зала на старото училище, покрита с картата на Родопите и бележки от DLC-01.
- **Диалог:** Митра (матриарх), Ана Комнина (ако е жива от DLC-01) и Гочо майстора спорят дали наследниците са готови. Играчът трябва да изслуша минимум 2 аргумента преди заключение.
- **Избори за наследник:**

| Наследник | Skill Gate | State ефект | Кръстосано влияние |
|-----------|------------|-------------|---------------------|
| Елена | Insight DC 11, трябва да разкрие тайна за руническите колони | `legacy_rank += 1`, `town_morale += 5`, `heir_alignment = "idealistic"` ако по-късно избереш Open Circle | В DLC-03 получава бонус при ritual diplomacy |
| Стоян II | Leadership DC 12 за убеждаване на воинушките | `production_bonus = +10`, но `diplomacy_modifier = -5` | DLC-04 започва с „Warding spears“ |
| Близнаците (Зорница/Стефан) | Performance или Deception DC 13 за да укротиш слуховете | отключва двоен alignment: `heir_alignment = "wind"` (Зорница) или `= "earth"` (Стефан) | В DLC-03 избираш кой близнак преговаря |

- **State hook:**
```json
{
  "content_sets": {
    "next-guardians": {
      "state": {
        "legacy_rank": "+=1",
        "town_morale": "+=5",
        "council_choice": "<elena|stoyan|twins>"
      }
    }
  }
}
```

## Сцена B — Инициационни изпити
- **Loop:** за всеки от трите стълба (Ум, Тяло, Дух) избери комбинация наследник + ментор (Ана/Теодосий/Калоян или новите NPC).
- **Skill & Consequence:**

| Изпит | Примерна сцена | Check | Success | Failure |
|-------|----------------|-------|---------|---------|
| Mind | решаване на рунически лабиринт в катакомбите | Lore DC 12 (+2 ако Елена води) | `legacy_rank += 1`, запис `structures.push("training:mind")` | `town_morale -5`, добави task „Рехабилитация“ за Quest 2 |
| Body | спускане по стръмния улей с парашутните платна | Athletics DC 13 (advantage при Стоян II) | unlock `perk.guardian_sprinters`, morale +5 | добави `injury_token` → трябва лазарет в Quest 2 |
| Spirit | колективно медитационно бдение | Willpower DC 11 (bonus ако близнаците са водещи) | `heir_alignment` се измества към `idealistic` или `pragmatic` според избора | tension +5, NPC обида → unlock social penance сцена |

- **Микро-наратив:** всеки успех отпечатва нова фреска в залата; провал добавя графит „Не сме готови“ (намалява morale визуално).

## Сцена C — Новият обет
- **Ритуал:** на поляната над клисурата, осветена от лампиона на Белинташ. Изисква се избран NPC от основната кампания да благослови (може да викнеш Архивист Калиста за бонус към lore).
- **Опции:**
  1. **Open Circle** – Requires Speechcraft DC 11. `town_morale +10`, `heir_alignment = "idealistic"`, запис `dlc_hook.alliance_openness = true`, tension +5 при DLC-03 византийците.
  2. **Selective** – Requires Insight DC 12 за да подбереш най-лоялните. `legacy_rank += 1`, `town_morale -5`, unlock `secret_training = true`.
  3. **Secret Keeper** – Requires Willpower DC 12 от лидера. Успех → `artifact.heirloom_lockbox = true`, `heir_alignment = "pragmatic"`. Провал → companion loyalty test, възможно отцепване (рано отключва Quest 2 side objective „Санитарни кордони“).

- **State Log:** добави `journal_entries.push("dlc2.next_guardians_initiated")` и `quest_hook.ng_build_phase = true`.

## Outcomes
- Минимален успех: `legacy_rank >= 2`, `town_morale >= 45`, иначе Quest 2 стартира с криза.
- Записвай `dlc_state.next_guardians.recruits = ["name1", ...]`, за да могат telemetry и NG+ да знаят кои ученици са активни.
