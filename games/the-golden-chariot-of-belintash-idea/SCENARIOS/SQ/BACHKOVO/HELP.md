# БАЧКОВСКИ МАНАСТИР · SIDE QUESTS — ПОМОЩ (#36–39)

> **Traceability**: SIDE-QUESTS.md §Бачково помощ #36–39 · SCENARIO-WRITING-PLAN §7.4 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-BACH-HELP-36 — "Ръкописите на библиотеката"

> **Свързани документи**: SIDE-QUESTS.md §36, LOCATIONS.md §Бачковски манастир, LORE-CARDS.md §Manuscripts, SECURITY.md §Library wards

Брат Библиотекарът шепне така, сякаш буквите могат да избягат: „Три ръкописа липсват. Ако игуменът разбере, ще ме превърне в красива хроника – без автор.“

> **[ИЗБОР] Разследване**  
> **А)** Проверяваш каталога и следите от восък. *(Investigation DC 13; успех → `clue = novice_cell`; провал → мастило по дрехите, appearance -2)*  
> **Б)** Използваш амулет, за да чуеш шепота на пергамента. *(Spirit DC 14; успех → „Ръката, която ме взе, трепереше“ → подозрение към болен монах)*  
> **В)** Разпитваш поклонници на портата. *(Persuasion DC 12; успех → виждат странен търговец; провал → стражата се дразни, reputation.church -5)*

> **STATE UPDATE**  
> - `quest_flags.bachkovo.help.manuscripts = culprit_id`  
> - Reward: `library.access_level = restricted`, `lore_token.scriptorium`, `reputation.church +10`.

---

## SQ-BACH-HELP-37 — "Поклонникът в нужда"

> **Свързани документи**: SIDE-QUESTS.md §37, LOCATIONS.md §Клувията, TRAVEL-SYSTEM.md §Mountain trail, COMPANIONS.md §Pilgrims

Болен поклонник лежи в двора като герой от житие, който чака редакция. „Отведи ме до Клувията, за да видя светлината, преди да ме види тя.“

> **[ИЗБОР] Подход**  
> **А)** Носиш го на носилка и група монаси. *(Athletics DC 11; успех → `state.pilgrim = safe`; провал → забавяне, tension +5)*  
> **Б)** Използваш билки/потион за временно укрепване. *(Medicine DC 12; успех → `buff.pilgrim_endurance`; провал → side effect, health -5)*  
> **В)** Молиш се на чудотворната икона за знак. *(Spirit DC 13; успех → `miracle_event = true` → morale +10; провал → съмнение, tension +5)*

> **STATE UPDATE**  
> - `quest_flags.bachkovo.help.pilgrim = completed`  
> - Reward: `blessing.light_of_kluviata`, `reputation.church +10`, `karma +1`.

---

## SQ-BACH-HELP-38 — "Камбаната на манастира"

> **Свързани документи**: SIDE-QUESTS.md §38, LOCATIONS.md §Манастирска кула, ENGINEERING.md §Bell repair, NPCS.md §Игумен

Камбаната стои на земята като обиден депутат. Игуменът сочи нагоре: „Фрактура в ярема. Трябва ковач и смел човек на скелето.“

> **[ИЗБОР] Ремонт**  
> **А)** Викaш Димитър ковача. *(Requires `ally.dimitur = true`; Craft DC 12; успех → нов бронзов обръч; провал → искри, tension +5)*  
> **Б)** Импровизираш дървен клин и въжета. *(Engineering DC 13; успех → `bell_stability = restored`; провал → падащ болт, health -10)*  
> **В)** Използваш магия за звуков резонанс, за да намериш пукнатината. *(Arcana DC 11; успех → прецизен ремонт; провал → камбаната издава фалшив тон, morale монаси -5)*

> **STATE UPDATE**  
> - `quest_flags.bachkovo.help.bell = repaired`  
> - Reward: `reputation.church +15`, `blessing.call_to_arms` (еднократен morale buff), `item.bell_fragment`.

---

## SQ-BACH-HELP-39 — "Изповедта на монаха"

> **Свързани документи**: SIDE-QUESTS.md §39, NPCS.md §Брат Никита, MORALITY.md §Confession paths, ECONOMY.md §Monastic treasury

Млад монах те търси в криптата. „Взех златен потир, за да помогна на семейство в нужда. Сега се страхувам повече от тишината, отколкото от наказанието.“

> **[ИЗБОР] Решение**  
> **А)** Издаваш го на игумена. *(Honor +5; Reputation.church +5; `state.monk_punished = true`; морално тежест +tension)*  
> **Б)** Помагаш му да върне потира тихомълком и да изкупи греха с лишения. *(Stealth DC 11; успех → `karma +1`; провал → страж хваща двамата)*  
> **В)** Използваш собствени средства, за да компенсираш липсата и да спасиш семейството. *(Donate ≥10 coins; Spirit DC 12 → `blessing.compassion`; провал → слухове за подкуп)*

> **STATE UPDATE**  
> - `quest_flags.bachkovo.help.confession = outcome (punished, redeemed, covered)`  
> - Reward: варира — (punish) `reputation.church +10`; (redeem) `karma +2`; (cover) `lore_token.monk_network +1`.

---

> **Set Bonus:** Завършването на всички помощни куестове задава `state.bachkovo.cloister_trust = true`, намалява цената на манастирските услуги с 10% и отключва сцена „Хорът на полунощната литургия“ (еднократен buff: `willpower +5`, `morale +10`).
