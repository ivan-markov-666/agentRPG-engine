# ЕПИЛОГ III · СЦЕНИ 131–135 — "ГЛАСЪТ НА АРХЕОЛОЗИТЕ"

---

## Сцена 131 — "Броячът на жертвите"

> **Traceability**: MAIN-QUEST-OUTLINE §561–563 · SCENARIO-WRITING-PLAN §6.7 · ред #361  
> **Свързани документи**: AUDIO-SCRIPTS.md §Counter motif, LORE-CARDS.md §Fallen treasure hunters

Бавно броене — всяка цифра се изпише като светулка върху нощта на Белинташ. Седем лъча са угаснали, осмият трепти и чака своя свидетел. Гласът звучи като ехото на Алеков герой: ирония и тъга, сякаш подмята на съдбата, че и най-верните пазители се превръщат в легенди.

> **[ИЗБОР] Как визуализираш брояча?**  
> **А)** Серия каменни кръстове, които се осветяват поред. *(emotion +10, изисква Willpower тест DC 12, иначе tension +5)*  
> **Б)** Геометрични знаци върху карта на Родопите. *(lore +5)*  
> **В)** Надписи върху истинския дневник на героя. *(unlock `journal.append("counter_entry")`)*

> **STATE HOOK**: `state.epilogue.counter_style = {crosses|map|journal}` влияе на сцените с археолозите.

---

## Сцена 132 — "Скок във времето"

> **Traceability**: MAIN-QUEST-OUTLINE §563–565 · SCENARIO-WRITING-PLAN §6.7 · ред #362  
> **Свързани документи**: DOCUMENTARY-SCRIPTS.md §Modern montage, WORLD-BIBLE.md §Timeline 2020s

С жест на камерата, достойна за Бай Ганьо в Париж, времето прескача от черно-белите легенди към дрона над Родопите. Асфалтени пътища, мобилни антени, палатки с логото на Европейския съюз — модерният свят отваря лазерната си рулетка върху старите скали.

> **[ИЗБОР] Какъв е преходът към 2020-те?**  
> **А)** Сателитна карта, приближаваща до платото. *(intel +5, requires Tech ≥ 40)*  
> **Б)** Архивна лента, която изгаря и разкрива цветен кадър. *(style +5, tension -5)*  
> **В)** POV кадър от смартфона на стажант. *(immersion +5, morale +5)*

> **STATE UPDATE**: `world_state.timeline = "2020s_modern_day"`; Journal дописва бележка „Археолозите пристигат“.

---

## Сцена 133 — "Археолозите на Белинташ"

> **Traceability**: MAIN-QUEST-OUTLINE §565–570 · SCENARIO-WRITING-PLAN §6.7 · ред #363  
> **Свързани документи**: CHARACTERS.md §Modern expedition, EQUIPMENT.md §Survey gear

Палатки като шарени гъби, генератори, георадар. Трима водачи спорят като литератори във вагон-ресторант: единият вярва само на данни, вторият — на легенди, третият — на сигурността.

> **[ИЗБОР] Кой оглавява експедицията?**  
> **А)** д-р Лилия Маринова — археолог-фолклорист. *(Requires `state.epilogue.heir = "granddaughter"` или Lore ≥ 50; morale +5)*  
> **Б)** проф. Антон Костов — жаден за слава историк. *(tension +5, intrigue +5)*  
> **В)** капитан Горан Велев — военен логистик, командирован за сигурността. *(security +10, но empathy -5)*

> **SKILL CHECK**: Leadership DC 13 за убеждаване на екипа да приеме избора ти; провал → `tension +5` и `companion_affinity.modern_team -3`.

> **STATE UPDATE**: `state.epilogue.expedition_lead = {lilia|kostov|velev}`; `quest_flags.modern_excavation = true`.

---

## Сцена 134 — "Отворът под скалите"

> **Traceability**: MAIN-QUEST-OUTLINE §571–575 · SCENARIO-WRITING-PLAN §6.7 · ред #364  
> **Свързани документи**: TRAVEL-SYSTEM.md §Subterranean routes, HAZARDS.md §Cave stability

След седмица разчистване камъните издават глух въздишка. Появява се процеп — същият тунел, през който героят пропълзя, а сега е осветен от LED фенери. Мирише на влага, метал и неизпълнени клетви.

> **[ИЗБОР] Как влиза екипът?**  
> **А)** С роботизиран ровър. *(tech +10, tension -5; Requires `inventory.tools.drone = true`)*  
> **Б)** По стария обред — връзване с червен конец и молитва. *(willpower +5, unlock `state.epilogue.ritual_protection = true`)*  
> **В)** Военен клин влиза първи, останалите чакат. *(security +10, но intrigue -5)*

> **SKILL CHECK**: Engineering DC 12 за стабилизиране на свода; провал → `state.hazard.belintash_rocks = "unstable"` (повишава риск в сцена 135).

> **STATE HOOK**: `quest_flags.belintash_tunnel_opened = true`; регистрирай `exploration_log.add("modern_entry")`.

---

## Сцена 135 — "Осмата жертва"

> **Traceability**: MAIN-QUEST-OUTLINE §576–587 · SCENARIO-WRITING-PLAN §6.7 · ред #365  
> **Свързани документи**: LORE-CARDS.md §Golden chariot, ENDINGS.md §Epilogue variants, AUDIO-SCRIPTS.md §Final chord

Последната камера блести от отражението на LED лампи. Колесницата стои недокосната, а в нея — скелетът на героя. Амулетът още прегръща пръстите; върху стената е издраскано името, което писахме през цялата игра.

> **[ИЗБОР] Как реагира екипът?**  
> **А)** Коленичат в мълчание, разбират, че пророчеството е изпълнено. *(emotion +10, unlock `ending_id = "legacy_kept"`)*  
> **Б)** Заснемат всичко и го излъчват на живо. *(intrigue +10, tension +10, `ending_id = "secret_exposed"`)*  
> **В)** Опитват да свалят амулета, но активират капан. *(hazard +10, `state.hazard.belintash_rocks = "collapse_imminent"` → hook за DLC)

> **STATE UPDATE**  
> - `state.main_quest.current = "epilogue_iii"`  
> - Journal: „Епилог III — Археолозите и осмата жертва“  
> - `world_state.epilogue_outcome = ending_id`

---

> **Завършек:** Надпис „Белинташ помни“ избледнява върху кадър на колесницата, докато песента от сцена 127 се смесва с шума на модерни камери. DLC hook: `quest_hook.next_generation` или `state.hazard.belintash_rocks` определят post-credit сцената.
