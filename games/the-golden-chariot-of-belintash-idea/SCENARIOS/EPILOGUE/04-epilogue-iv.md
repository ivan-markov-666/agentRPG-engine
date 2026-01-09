# ЕПИЛОГ IV · СЦЕНИ 136–140 — "СЛЕДИТЕ ОТ ЗЛАТОТО"

---

## Сцена 136 — "Амулетът се разгаря"

> **Traceability**: MAIN-QUEST-OUTLINE §581–582 · ENDINGS.md §Final Epilogue Part 2 · SCENARIO-WRITING-PLAN §6.7 · ред #366  
> **Свързани документи**: ARTIFACTS.md §Sun-eye talisman, AUDIO-SCRIPTS.md §Resonance hum

Амулетът в костеливата ръка започва да пулсира като сърдит самовар. Светлината му боядисва лицата на археолозите в зелено злато, а камерата на модерния свят се превръща в позлатено перо, което записва съдбата на героите.

> **[ИЗБОР] Как реагираш на пробуждането?**  
> **А)** Даваш амулета на най-чистосърдечния член на екипа. *(Requires `companion_affinity.modern_team ≥ 0`; morale +5)*  
> **Б)** Оставяш го върху скелета, почитайки обета. *(emotion +10, tension -5)*  
> **В)** Опитваш се да го анализираш с уредите. *(Tech check DC 14; success → `intel +10`, fail → `state.hazard.belintash_rocks = "cracking"`)*

> **STATE UPDATE**: `state.epilogue.amulet_status = {passed_on|left_with_hero|analyzed}`; Journal добавя ред „Амулетът отговори на светлината“.

---

## Сцена 137 — "Надписът под лампите"

> **Traceability**: MAIN-QUEST-OUTLINE §583–584 · ENDINGS.md §Final Epilogue Part 2 · SCENARIO-WRITING-PLAN §6.7 · ред #367  
> **Свързани документи**: LINGUISTICS.md §Thracian glyphs, DOCUMENTARY-SCRIPTS.md §Translation montage

На стената — думи, издраскани сякаш с последни сили. Светлината трепти, буквите оживяват. Гласът на разказвача се усмихва: „Ето това е подписът на човек, който е минал и през данъчни и през погребални комисии.“

> **[ИЗБОР] Кой превежда надписа?**  
> **А)** Същият наследник от сцена 126, повикан чрез видеовръзка. *(Requires `state.epilogue.heir` set; unlock `ending_id_hint = heir_truth`)*  
> **Б)** Екипът използва AI преводач. *(Tech +10, но intrigue +5)*  
> **В)** Оставяш думите непокътнати, само ги заснемаш. *(mystery +10, lore +5)*

> **STATE HOOK**: `world_state.epilogue_inscription = {heir|ai|sealed}` влияе на кредити и DLC куестове.

---

## Сцена 138 — "Съдбата на тайната"

> **Traceability**: MAIN-QUEST-OUTLINE §585–586 · ENDINGS.md §Variant outcomes · SCENARIO-WRITING-PLAN §6.7 · ред #368  
> **Свързани документи**: ENDINGS.md §Summary table, WORLD-BIBLE.md §Legacy chapter

Тук Aleko би подхвърлил, че българинът може да скрие дори Парижка изложба в торба, стига да има причина. Съветът на археолозите решава пред камерата на бъдещето: разкриват ли или запазват ли легендата?

> **[ИЗБОР] Какво се прави със знанието?**  
> **А)** Публична пресконференция. *(intrigue +10, unlock `ending_id = "secret_exposed"`)*  
> **Б)** Тайно досие, изпратено само до наследниците. *(compassion +5, unlock `ending_id = "legacy_kept"`)*  
> **В)** Симулирана катастрофа — тунелът се запечатва. *(tension +10, unlock `ending_id = "silence_enforced"`)*

> **STATE UPDATE**: `world_state.epilogue_outcome = ending_id`; `news_feed.add(ending_id)` → влияе на кредити и NG+ hooks.

---

## Сцена 139 — "Гласът зад кадър"

> **Traceability**: ENDINGS.md §Final Words · SCENARIO-WRITING-PLAN §6.7 · ред #369  
> **Свързани документи**: AUDIO-SCRIPTS.md §Narrator finale, LORE-CARDS.md §Belintash myth

Гласът на разказвача — малко ироничен, малко уморен, сякаш пътуващият Бай Ганьо е получил докторска степен и вече говори на конференция в Белинташ. Той обобщава приключението, обръща се към играча и към поколенията.

> **[ИЗБОР] Какъв тон избира гласът?**  
> **А)** Патриотична хипербола за пазителите. *(morale +10)*  
> **Б)** Носталгичен хумор, сравняващ иманярите с чиновници. *(emotion +5, tension -5)*  
> **В)** Предупреждение, че всяка тайна иска своята цена. *(Foreshadow +10, unlock `quest_hook.future_cost`)*

> **STATE HOOK**: `journal.append("narrator_tone")`; `state.epilogue.narration = {heroic|humorous|ominous}` влияе на NG+ intro.

---

## Сцена 140 — "Кадърът, който остава"

> **Traceability**: MAIN-QUEST-OUTLINE §587 · ENDINGS.md §Final shot · SCENARIO-WRITING-PLAN §6.7 · ред #370  
> **Свързани документи**: AUDIO-SCRIPTS.md §Credits reprise, VIDEO-SCRIPTS.md §Closing shot

Камерата се отдалечава. Белинташ е като звезда, току-що намазана с родопско масло. Песента от сцена 127 се връзва с шума на дронове. Надписът „Белинташ помни“ пулсира и се разтваря в облаци.

> **[ИЗБОР] Как завършва визията?**  
> **А)** Картата на Родопите се превръща в пламък, който угасва. *(mystery +10)*  
> **Б)** Появява се списък с наследници и нови пазители. *(unlock `quest_hook.next_generation` ако не беше отключен)*  
> **В)** Струя светлина сочи друго място — hook за DLC. *(travel +5, unlock `dlc_hook.balkan_trail`)*

> **STATE UPDATE**  
> - `state.main_quest.current = "epilogue_iv"`  
> - Journal: „Епилог IV — Следите от златото“  
> - `credits.config.ending = {mystery_roll|heir_scroll|dlc_light}`

---

> **Post-credit:** Ако `state.hazard.belintash_rocks = "collapse_imminent"`, последен кадър показва пукнатина и глас: „Историята тепърва започва.“
