# КАМЕНИЦА · SIDE QUESTS — БОЙ (#6–8)

> **Traceability**: SIDE-QUESTS.md §Каменица бой #6–8 · SCENARIO-WRITING-PLAN §7.2 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-KAM-CBT-06 — "Вълците на фермата"

> **Свързани документи**: SIDE-QUESTS.md §6, LOCATIONS.md §Каменица полета, BESTIARY.md §Вълк, GAME-CAPABILITIES.md §Combat formations

Фермер Добрин посреща с нож, забит в масата, и философията на селския стоик: „Вълците са като бирниците — идват нощем и взимат най-доброто.“ Селото е изнервено; нужни са действия.

> **[ИЗБОР] Подход към глутницата**  
> **А)** Засада при кошарата. *(Tactics DC 12, успех → `battle_advantage = true` дава +2 initiative; провал → вълците нападат изненадващо)*  
> **Б)** Примамка с мъртво теле и капани. *(Craft DC 11 → успех: първият вълк е обезвреден преди битката, loot +1 skin)*  
> **В)** Призоваваш селяните и ги обучаваш на копиен строй. *(Leadership DC 13 → успех: villagers assist, morale +5; провал → един селянин е ранен, karma -1)*

> **Бойни детайли**  
> - Encounter: 4 обикновени вълка + 1 алфа (HP 30, fear howl).  
> - Ако Шаро участва → `companion_ability.scent_warning = true` → първи удар advantage.  
> - Магия „Защита от уроки“ дава +5 AC срещу ухапвания.

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.combat.wolves = completed`  
> - Reward: `inventory.coins += 15`, `inventory.food.meat += 1`, `faction_reputation.villagers += 5`  
> - Ако алфата жив → unlock diplomacy hook „Магически вълк“ по-късно.

---

## SQ-KAM-CBT-07 — "Дивата свиня"

> **Свързани документи**: SIDE-QUESTS.md §7, LOCATIONS.md §Дъбовата падина, BESTIARY.md §Глиган, TRAVEL-SYSTEM.md §Forest clearings

Ловец Радой описва глигана като „тричленна комисия на четири крака“ — тежък, упорит и рушащ всичко. Нивите са разорани; жените крият децата по къщите.

> **[ИЗБОР] Тактика**  
> **А)** Директен лов с копие. *(Strength DC 13 за първия удар; успех → bleed effect върху глигана)*  
> **Б)** Изкопаваш ловен ров и го маскираш. *(Engineering DC 12; успех → глиганът пада, combat DC -5; провал → ровът се руши, hero prone)*  
> **В)** Използваш Калина/друг companion за отвличане и отровни стрели. *(Requires companion с ability „poison“; success → HP -15 преди бой)*

> **Бой**  
> - Глиган HP 50, charge attack 15 dmg + knockdown (STR save DC 12).  
> - Ако имаш „Стоянов пирон“ → можеш да закрепиш щит за +5 защита този рунд.  
> - При 25% HP глиганът бяга; избор: преследваш (travel check +10 risk) или оставяш (reward -3 coins).

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.combat.boar = completed`  
> - Reward: `inventory.coins += 10`, `inventory.materials.boar_hide = 1`, `inventory.food.meat += 2`  
> - Unlock craft рецепт „Глиганова броня“ (requires hide + tar_patch).

---

## SQ-KAM-CBT-08 — "Змията в кладенеца"

> **Свързани документи**: SIDE-QUESTS.md §8, LOCATIONS.md §Кладенец север, BESTIARY.md §Магическа змия, MAGIC-SPELLS.md §Purify Water

Селянка Гина плаче: „Детето ми жадува, а кладенецът съскà!“ В дълбочината се е намъкнала змия с очи като мъниста — може да е обикновена, може и магическа.

> **[ИЗБОР] Решение**  
> **А)** Слизаш с въже и я хващаш с голи ръце. *(Dexterity DC 12, успех → snake subdued; провал → отрова: health -10, нужна билка)*  
> **Б)** Използваш билка „вълчи лук“ за дим, за да я изгониш. *(Alchemy DC 10; успех → змията изпълзява и можеш да я проследиш до гнездото)*  
> **В)** Говориш със змията чрез амулета. *(Requires Spirit ≥ 35; диалог → опция за сделка: оставяш й жертвоприношение, тя пази кладенеца от други)*

> **Outcome вариации**  
> - Ако змията е убита → loot „snake fang“ (ingredient).  
> - Ако е умиротворена → `state.kamenitsa.guardian_snake = true`, селяните получават постоянно благословение `water_clean = true`.  
> - Провал → кладенецът остава замърсен, daily regen -2 за селото, karma -2.

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.combat.snake = completed`  
> - Reward: `inventory.coins += 5`, `faction_reputation.villagers += 3` (или +5 ако пазиш змията жива)  
> - Journal: „Змията от кладенеца и урокът за доверието.“

---

> **Set Bonus:** След изпълнение на всички бойни куестове `state.kamenitsa.defense_rating +10`, отключва се странична сцена „Селският панаир на благодарността“ и цените на оръжия в Каменица падат с 5%.
