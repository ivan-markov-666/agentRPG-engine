# DLC-03 · "Balkan Trail / Светлинният лъч"

> **Hook:** Активира се след видението "Светлинният лъч" в епилога и флаг `state.flags.final_vision = true` + активен `dlc_hook.balkan_trail`.
> 
> **Active content set:** `balkan-trail`

| # | Quest ID | Име | Кратко резюме | Основни state ефекти |
|---|----------|-----|----------------|-----------------------|
| 1 | `dlc-bt-01-map-of-light` | "Карта на Светлината" | Планираш маршрута, избираш convoy loadout и стартираш експедицията | Инициализира `expedition_stage`, `supply_tokens`, `artifact_clues` |
| 2 | `dlc-bt-02-guardians-pass` | "Пазители на прохода" | Тактически/дипломатически мисии по проходите; влияеш на alliance tracks | Обновява `alliance_track.*`, `convoy_morale`, unlock-ва faction bonuses |
| 3 | `dlc-bt-03-beam-over-salonika` | "Лъчът над Солун" | Финалният избор кой портал активираш и какъв е лъчът | Записва `trails_resolution`, експортира NG+ артефакти |

## Core Systems
- **Expedition Map:** region/hex traversal със supply drain и hazard clocks.
- **Convoy Management:** `convoy_morale`, `supply_tokens`, repair downtime, нишови NPC роли.
- **Diplomacy Tracks:** Byzantines / Latins / Voinuks (unlock портали, reinforcement, stealth).
- **Artifact Hunt:** `artifact_clues[]` и ритуални ключове за финалния лъч.

## Scene Outline
1. **Quest 1:** Стратегия и подготовка – избор на маршрут, логистика, първи clues.
2. **Quest 2:** Проходи и коалиции – multi-route мисия, преговори или саботажи.
3. **Quest 3:** Солунският лъч – кулминация, избор на фракция, последици върху DLC-04/NG+.

> TODO: попълни детайлните сцени, DC стойности и state hook JSON по куестовете.
