# ФИЛИПОПОЛ · SIDE QUESTS — МИСТЕРИЯ (#49–52)

> **Traceability**: SIDE-QUESTS.md §Филипопол мистерия #49–52 · SCENARIO-WRITING-PLAN §7.5 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-PHI-MYST-49 — "Тайната на подземията"

> **Свързани документи**: SIDE-QUESTS.md §49, LOCATIONS.md §Римските подземия, MAIN-QUEST-OUTLINE.md §Act IV, LORE-CARDS.md §MonetaKey04

Елена разгръща карта, по-сложна от трамвайна мрежа. „Под Трихълмието има олтар, който пее само когато градът заспи. Ако го намерим, ще открием четвъртата монета.“

> **[ИЗБОР] Влизане**  
> **А)** През изоставен кладенец. *(Athletics DC 13; успех → shortcut; провал → падаш 5 HP)*  
> **Б)** Чрез гилдията на сенките. *(Requires `state.guild_neutrality`; Stealth DC 12)*  
> **В)** През канализацията. *(Endurance DC 12; успех → избягваш стражи; провал → disease risk)*

> **[ИЗБОР] Олтарът**  
> **А)** Подравняваш звездни чинии с огледала. *(Engineering DC 14; успех → `item.moneta_key_4`; провал → алерт, spawn guardians)*  
> **Б)** Изпяваш тракийския химн (ако имаш `lore_token.samodiva`). *(Performance DC 13; успех → vision; провал → ехо буди пазачи)*  
> **В)** Принасяш relic от Белинташ. *(Sacrifice item; Spirit DC 14; успех → permanent buff „Tracian Insight"; провал → relic destroyed без награда)*

> **STATE UPDATE**  
> - `quest_flags.philippopol.mystery.catacombs = completed`  
> - Reward: `item.moneta_key_4`, `map.hidden_altar`, `vision.act_v_hook`.

---

## SQ-PHI-MYST-50 — "Търговската война"

> **Свързани документи**: SIDE-QUESTS.md §50, LOCATIONS.md §Пазар/Гилдии, ECONOMY.md §Trade influence, NPCS.md §Венециански търговец/Гръцки консорциум

Двама търговски клана спорят кой да държи пристанището на Марица. „Помогни ни да спечелим честна (или не толкова) победа“, усмихва се венецианецът.

> **[ИЗБОР] Стратегия**  
> **А)** Финансов саботаж — подменяш складови записи. *(Forgery/Intrigue DC 13; успех → една гилдия губи; провал → разкриват те)*  
> **Б)** Дипломация — убеждаваш сената да раздели правата. *(Persuasion DC 14; успех → `reputation.merchants +15`; провал → хаос)*  
> **В)** Разкриваш и двете страни като контрабандисти. *(Investigation DC 12; успех → `karma +1`, `reputation.royal +10`; провал → те те вписват като обвиняем)*

> **STATE UPDATE**  
> - `quest_flags.philippopol.mystery.trade_war = {venetian, greek, exposed}`  
> - Reward: `coins +30` (ако помагаш), или `alliance.trade_union`, или `intrigue +10`.

---

## SQ-PHI-MYST-51 — "Пророчицата"

> **Свързани документи**: SIDE-QUESTS.md §51, LOCATIONS.md §Беден квартал, COMPANIONS.md §Seer, AUDIO-SCRIPTS.md §Whispers, LORE-CARDS.md §Prophecy threads

Шепот се носи за жена, която вижда бъдещето зад завесата на бедността. Тя говори в стихове и smell на тамян. „Видях колесница в кръв и смях на три езика.“

> **[ИЗБОР] Достъп**  
> **А)** Занесеш дарове за квартала. *(Charisma DC 11; успех → допускат те; провал → крадат ти кесията)*  
> **Б)** Влизаш сам през нощта. *(Stealth DC 12; успех → интимна визия; провал → тълпата мисли, че си крадец)*  
> **В)** Довеждаш Елена/философа за научна интерпретация. *(Requires `companion`; Lore DC 12; успех → `prophecy_decoded`; провал → пророчицата се затваря)*

> **STATE UPDATE**  
> - `quest_flags.philippopol.mystery.prophet = vision_type`  
> - Reward: `prophecy_token (future act hint)`, `morale +5`, `intrigue +5` ако го споделиш със сената.

---

## SQ-PHI-MYST-52 — "Изчезналите деца"

> **Свързани документи**: SIDE-QUESTS.md §52, LOCATIONS.md §Подземни квартали, ENEMIES.md §Синовете на Змея, WORLD-BIBLE.md §Cult operations

Родители плачат пред кулата на стражата. „Децата ни влизат в сънища, после... няма ги.“ Следи водят към Синовете на Змея; слухове за подземни ритуали.

> **[ИЗБОР] Разследване**  
> **А)** Маскираш се като просяк и следиш култови вербовчици. *(Disguise DC 13; успех → тайник; провал → култът заподозира)*  
> **Б)** Викаш помощ от гилдията на сенките. *(Requires `state.guild_neutrality`; Stealth DC 12)*  
> **В)** Разпитваш духовете на отвлечените чрез ритуал. *(Spirit DC 14; успех → `location = catacomb chamber`; провал → haunt, health -5)*

> **Encounter:** 2 Cult Adepts HP 50, 1 Snakebound Priest HP 80. Ако спасиш деца → `karma +2`, `reputation.villagers +20`. Ако провал → tension +20.

> **STATE UPDATE**  
> - `quest_flags.philippopol.mystery.missing_children = resolved`  
> - Reward: `lore_token.cult_plan`, `relationship.city_watch +10`, `event.cult_retaliation unlocked` при провал.

---

> **Set Bonus:** Всички мистерийни куестове завършени → `state.philippopol.hidden_history = revealed`, намалява DC за main quest infiltration и отключва сцена „Съветът на три хълма“ (foreshadow за финалния акт).
