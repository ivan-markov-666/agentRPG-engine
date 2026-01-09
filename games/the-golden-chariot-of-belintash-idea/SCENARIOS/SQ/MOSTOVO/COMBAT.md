# МОСТОВО/ГОРНОСЛАВ · SIDE QUESTS — БОЙ (#18–20)

> **Traceability**: SIDE-QUESTS.md §Мостово/Горнослав бой #18–20 · SCENARIO-WRITING-PLAN §7.2 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-MOS-CBT-18 — "Вълчата заплаха"

> **Свързани документи**: SIDE-QUESTS.md §18, LOCATIONS.md §Горнослав полета, BESTIARY.md §Вълк, GAME-CAPABILITIES.md §Tactics

Кметът на Мостово държи жезъла си като байрактар на панаир: „Вълците разкъсаха три стада. Ако това беше парламент, щяхме да напишем доклад. Сега — ти пишеш история.“

> **[ИЗБОР] План за битка**  
> **А)** Създаваш обсада с факли и викове. *(Leadership DC 12; успех → villagers assist, +2 dice on first round)*  
> **Б)** Следиш алфата през гората и го изолираш. *(Survival DC 13; успех → алфата започва с -10 HP)*  
> **В)** Използваш примамка с магическа миризма (ако имаш Калина или potion). *(Alchemy DC 11; успех → wolves stunned 1 round)*

> **Encounter:** 5 вълка (HP 25) + алфа (HP 35, Howl = fear). Ако Шаро присъства → `initiative +5`. Победа → loot „wolf pelts" ×2.

> **STATE UPDATE**  
> - `quest_flags.mostovo.combat.wolves = completed`  
> - Reward: `inventory.coins += 15`, `inventory.materials.wolf_hide += 1`, `reputation.villagers +10`

---

## SQ-MOS-CBT-19 — "Мечката хора"

> **Свързани документи**: SIDE-QUESTS.md §19, LOCATIONS.md §Планинските пасища, BESTIARY.md §Мечка, MAGIC-SPELLS.md §Curse removal

Селяните твърдят, че мечката има очи като на човек в петък вечер. Баба Руска прошепва: „Проклятие е. Ако я убиеш, ще спаси телата. Ако я спасиш, ще спаси душите.“

> **[ИЗБОР] Подход**  
> **А)** Чиста сила — копие и огън. *(Strength DC 14; успех → +10 dmg първи рунд)*  
> **Б)** Магически ритуал за разваляне. *(Spirit DC 15; успех → мечката се превръща в човек, combat skip; провал → мечката Berserk)*  
> **В)** Клопка с падане на скала. *(Engineering DC 13; успех → мечката restrained 2 rounds)*

> **Encounter:** Мечка HP 80, claw dmg 20, enrages при <30 HP. Ако успееш с ритуала → получаваш NPC ally „Прокълнатият ловец" за Act I сценa.  
> **STATE UPDATE**: `quest_flags.mostovo.combat.bear = {slain|cured}`; Rewards → (slain) `bear_hide`, `coins +20`; (cured) `karma +2`, `ally.unlocked = hunter`.

---

## SQ-MOS-CBT-20 — "Разбойникът в гората"

> **Свързани документи**: SIDE-QUESTS.md §20, LOCATIONS.md §Пътят към Врата, GAME-CAPABILITIES.md §Duel, COMPANIONS.md §Стоян/Калина hooks

Пътници се оплакват от разбойник, който се държи като Бай Ганьо на мост — събира такса за дишане. Носи броня от смесени трофеи и знае пътеките като чиновник коридорите.

> **[ИЗБОР] Тактика**  
> **А)** Директен дуел. *(Sword/Combat DC 13; успех → morale +5; провал → wound -10 HP)*  
> **Б)** Засада с приятели от Мостово. *(Leadership DC 12; успех → разбойник pinned, tension -5)*  
> **В)** Преговори да се присъедини към теб. *(Persuasion DC 14; успех → `companion_hook.bandit = true`; провал → той те напада с advantage)*

> **Encounter:** Human Raider HP 45, crossbow + sword. Ако го победиш, loot „raider kit" + 10 coins. Ако го вербуваш → unlock side quest „Изповедта на разбойника".

> **STATE UPDATE**  
> - `quest_flags.mostovo.combat.bandit = completed`  
> - Reward: `reputation.villagers +10` (ако го изгониш/убиеш), или `intrigue +5` и `companion_affinity +5` (ако го вербуваш)

---

> **Set Bonus:** Завършването на бойните куестове присвоява `state.mostovo.defense_rating +15`, което намалява шанса за рандом нападения по маршрута Мостово ↔ Станимака и отключва event „Кметският пир след победата“ (лимитирано време за morale buff +10).
