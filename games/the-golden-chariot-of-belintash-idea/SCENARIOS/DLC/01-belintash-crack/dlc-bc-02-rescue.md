# DLC-BC-02 · "Спаси архивистите"

> **Quest type:** Rescue / Multi-path traversal
> **State hooks:** `dlc.belintash.rescued_archivists`, `dlc.belintash.side_shafts`

## Сцена A — Карта на шахтите
- Ана Комнина разгъва карта с три блокирани звена (`north`, `east`, `deep`). За всяко получаваш кратко описание (газови мехури, рухнали стълби, призрачни пазители).
- Играчът избира реда; `collapse_stage` намалява с 1, ако посетиш място, където има завършени подпори от Quest 1 (например галерия).
- **State hook:** `state.content_sets["belintash-crack"].state.selected_route = [ ...order ]`.

## Сцена B — Странични тунели
- Всеки тунел има мини-сцена:
  - **Gas leak:** Engineering DC 11 или Ritual DC 12 → успехът позволява да спасиш 1 архивист и да получиш `item.filter_mask`. Провал → `collapse_stage += 1`, архиваст загива, tension +5.
  - **Hostile spirits:** Willpower DC 12 или използвай `spell.calcify` за да ги закрепиш. Успех → rescue + morale boost; провал → companion получава debuff.
  - **Collapsing ladder:** Athletics DC 10 или craft временно `brace_kit`. Успех → извеждаш NPC + допълнителен supply; провал → `state.notes` записва загубата.
- За всеки спасен NPC: `state.content_sets["belintash-crack"].state.rescued_archivists += 1`.
- Ако `support_nodes` включва „gallery“, можеш да отключиш тайна шахта → бонус архивист.

## Сцена C — Evac hub
- Hub-ът е импровизирана площадка с лифт и рунни въжета.
- Избор:
  1. **Изпрати ги веднага** → `rescued_archivists` се заключва, но губиш помощ в Quest 3.
  2. **Задръж ги за ритуала** → риск че hazard spike може да ги рани (`collapse_stage +1` при провал), но получаваш бонус „Archivist chorus“ (ритуалите -2 DC).
  3. **Раздели ги** → половината нагоре, половината остават; нуждае се от Leadership DC 11.
- Companion-ите (например Калоян) могат да останат като охрана; запис `state.content_sets["belintash-crack"].state.evac_strategy`.

## Outcomes
- Всички спасени (`>=3`) → unlock lore картата „Archivist testimony“.
- Провал при някоя шахта → `notes` добавя името на загубения NPC и hazard penalty.
- Ако `rescued_archivists >= 2` и ги задържиш → Quest 3 получава допълнително заклинание „Cohesion Chant“.
