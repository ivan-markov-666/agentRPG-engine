# ФИЛИПОПОЛ · SIDE QUESTS — БОЙ (#46–48)

> **Traceability**: SIDE-QUESTS.md §Филипопол бой #46–48 · SCENARIO-WRITING-PLAN §7.5 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-PHI-CBT-46 — "Гилдията иска услуга"

> **Свързани документи**: SIDE-QUESTS.md §46, LOCATIONS.md §Подземията, NPCS.md §Сянката, GAME-CAPABILITIES.md §Assassin contracts

Сянката — лице, което може да бъде само заглавие — изисква услуга: „Една цел, един нощен ход. Или отказ, но после ще говори стоманата.“

> **[ИЗБОР] Позиция**  
> **А)** Приемаш мисията да елиминираш корумпиран съдия. *(Stealth DC 14; успех → one-shot attack advantage; провал → аларма, fight vs 3 guards)*  
> **Б)** Изиграваш гилдията — предупреждаваш жертвата и устройваш капан. *(Deception DC 13; успех → гилд убийци в засада, получаваш `intel.shadow_routes`; провал → двойно предателство, +tension)*  
> **В)** Отказваш, но предлагаш duel of champions. *(Honor DC 12; успех → `state.guild_neutrality = true`; провал → гилдията те обявява за враг → random assassin events)*

> **Encounter:** Ако стане бой – 2 Assassins (HP 55, poison blades) + 1 Shadow Adept (HP 65, smoke bomb). Победа → `information.moneta5_hint`, `intrigue +10`.

> **STATE UPDATE**: `quest_flags.philippopol.combat.guild_service = outcome (loyalty, betrayal, refusal)`.

---

## SQ-PHI-CBT-47 — "Атентатът"

> **Свързани документи**: SIDE-QUESTS.md §47, LOCATIONS.md §Болярски квартал, NPCS.md §Болярин Петър, SECURITY.md §City watch

Болярин Петър сваля пръстен и го подава: „Заговорници готвят атентат. Или ги спри, или се присъедини и виж последствията.“

> **[ИЗБОР] Страна**  
> **А)** Защитаваш болярина. *(Investigation DC 13 да откриеш бомби; успех → разоръжаваш три мехурни устройства → combat срещу конспиратори (HP 50 each))*  
> **Б)** Присъединяваш се към заговорниците, защото боляринът пречи на народа. *(Morality shift; Stealth DC 12; успех → sabotage succeeds, reputation.nobility -20, но `intrigue +15`; провал → двойна игра)*  
> **В)** Разкриваш заговора публично, превръщайки го в съдебен фарс. *(Performance DC 14; успех → crowd helps, tension -10; провал → хаос)*

> **STATE UPDATE**: `quest_flags.philippopol.combat.assassination = {thwarted, complicit, exposed}`; Rewards съответно: `reputation.royal +30`, `network.rebels +1`, или `karma +1` + `intrigue +5`.

---

## SQ-PHI-CBT-48 — "Арената"

> **Свързани документи**: SIDE-QUESTS.md §48, LOCATIONS.md §Подземна арена, GAME-CAPABILITIES.md §Arena ladder, AUDIO-SCRIPTS.md §Crowd chants

Подземна арена под Тракийския квартал предлага боеве с правила по-гъвкави от търговски договор. Организаторът ти намига: „Ще забавляваш ли тълпата или ще станеш закуска?“

> **[ИЗБОР] Формат**  
> **А)** Duel ladder (1v1 три поредни врага). *(Combat DC 13, 14, 15)*  
> **Б)** Survival wave срещу чудовища (вълци, гладиатори, мини-голем). *(Requires `team ≥ 3`; Tactical DC 14)*  
> **В)** Showsmanship – боеве с „иновации“ (ловки и магии). *(Performance + Combat DC 13; успех → crowd favor, +50% gold)*

> **Encounter Examples:** 1) Gladiator HP 70, shield bash; 2) Minotaur construct HP 90; 3) Trio rogues HP 40 each. Между рундовете може short rest (1 ability refresh). Победа → `coins +60`, `title: Champion of the Underground`, `reputation.underground +15`.

> **STATE UPDATE**: `quest_flags.philippopol.combat.arena = {champion, defeated}`; при победа `unlock event "Royal Games invite"`.

---

> **Set Bonus:** Всички бойни куестове завършени → `state.philippopol.underworld_balance = true`, намалява вероятността от враждебни засади в града и отключва сцена „Нощта на Черния пазар" (foreshadow за main quest infiltrations).
