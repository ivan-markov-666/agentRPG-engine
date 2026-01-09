# АКТ V · СЦЕНИ 101–105 — "ТУНЕЛЪТ ПОД БЕЛИНТАШ"

---

## Сцена 101 — "Влизането в тунела"

> **Traceability**: MAIN-QUEST-OUTLINE §471–473 · SCENARIO-WRITING-PLAN §6.6 · ред #331  
> **Свързани документи**: WORLD-BIBLE.md §Belintash tunnel, TRAVEL-SYSTEM.md §ActV entry

Тунелът диша — стени от гладка скала, изрязани от ръка, която познава звездите.

> **[ИЗБОР] Как се ориентираш?**  
> **А)** Опираш амулета в стената и следваш вибрациите. *(Amulet strain +5, но `intel.tunnel_map`)*  
> **Б)** Чертаеш карта според капките вода. *(Lore +5, но travel speed -1)*  
> **В)** Пускаш светулки/магически сфери напред. *(Spell slot -1, morale +5)*

> **STATE HOOKS**  
> - `travel.route = "belintash_tunnel_entry"`  
> - `world_state.light_level = "low"`.

---

## Сцена 102 — "Стражите на стените"

> **Traceability**: MAIN-QUEST-OUTLINE §474–476 · SCENARIO-WRITING-PLAN §6.6 · ред #332  
> **Свързани документи**: LORE-CARDS.md §Tunnel guardians, GAME-CAPABILITIES.md §Fear encounters

По стените има изсечени лица, които заживяват, щом ги докосне светлина.

> **[ИЗБОР] Как минаваш покрай тях?**  
> **А)** Говориш им като на старци. *(Lore 60 → tension -5)*  
> **Б)** Използваш огнена магия, за да ги държиш на разстояние. *(fatigue +5, но hazard -5)*  
> **В)** Минаваш с превръзка на очите. *(Willpower 55 → morale +5, ако успех)*

> **FAIL CONSEQUENCE**: `state.flag.fear_mark = true` → следващи сцени +5 DC.

---

## Сцена 103 — "Историята върху стените"

> **Traceability**: MAIN-QUEST-OUTLINE §477–482 · SCENARIO-WRITING-PLAN §6.6 · ред #333  
> **Свързани документи**: WORLD-BIBLE.md §Belintash carvings, LORE-CARDS.md §Chariot origin

Релефите показват Александър, колесницата, жреците.

> **[ИЗБОР] Какво изучаваш?**  
> **А)** Произхода на колесницата — получаваш `vision.chariot_origin`.  
> **Б)** Клетвата на жреците — `state.flag.oath_understood = true`.  
> **В)** Детайлите за магическите канали — `intel.power_nodes`.

> **STATE UPDATE**: journal добавя раздел „Belintash murals“.

---

## Сцена 104 — "Клетвата"

> **Traceability**: MAIN-QUEST-OUTLINE §483–486 · SCENARIO-WRITING-PLAN §6.6 · ред #334  
> **Свързани документи**: MAGIC-SPELLS.md §Oath magic, GAME-CAPABILITIES.md §Moral choice

Пред олтар с прах трябва да решиш дали да докоснеш праха.

> **[ИЗБОР] Какво правиш?**  
> **А)** Докосваш праха и повтаряш клетвата. *(morale +10, tension -5)*  
> **Б)** Събираш прах за изследване. *(inventory + "Sacred Ash", но `state.flag.oath_understood = false`)*  
> **В)** Просто наблюдаваш и оставяш всичко непокътнато. *(intrigue +5, но morale -5)*

> **STATE HOOK**: избор А дава бонус в сцена 105.

---

## Сцена 105 — "Камерата на оръжията"

> **Traceability**: MAIN-QUEST-OUTLINE §487–488 · SCENARIO-WRITING-PLAN §6.6 · ред #335  
> **Свързани документи**: INVENTORY.md §Ancient relics, GAME-CAPABILITIES.md §Temptation

Камерата е пълна със стари доспехи. Всичко изглежда примамливо, но ръждясало.

> **[ИЗБОР] Протягаш ли ръка?**  
> **А)** Не пипаш нищо. *(tension -5, `state.flag.temptation_resisted = true`)*  
> **Б)** Вземаш малък талисман. *(Unlock `item.relic_token`, но `state.flag.temptation_resisted = false`)*  
> **В)** Активираш магия, за да провериш проклятие. *(Spell slot -1, lore +5)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_v_deeper"`  
> - Journal: „Act V — Камерите започват“.

---

## Сцена 106 — "Камерата на съкровищата"

> **Traceability**: MAIN-QUEST-OUTLINE §489–492 · SCENARIO-WRITING-PLAN §6.6 · ред #336  
> **Свързани документи**: LORE-CARDS.md §Treasure hall, GAME-CAPABILITIES.md §Temptation checks

Стаята е покрита със злато. Всичко блещука, но прахът е дебел.

> **[ИЗБОР] Как реагираш?**  
> **А)** Не пипаш нищо. *(tension -5, `state.flag.temptation_resisted = true`)*  
> **Б)** Вземаш малък талисман. *(inventory + \"Ancient Token\", tension +5)*  
> **В)** Разпореждаш се companion да провери. *(Companion affinity ±, risk injury)*

> **STATE HOOK**: изб. Б може да качи `state.flag.alchemical_curse = true`.

---

## Сцена 107 — "Тестът на алчността"

> **Traceability**: MAIN-QUEST-OUTLINE §493–498 · SCENARIO-WRITING-PLAN §6.6 · ред #337  
> **Свързани документи**: MAGIC-SPELLS.md §Greed ward, GAME-CAPABILITIES.md §Moral trials

В центъра има маса с златни чаши. Глас шепне: „Вземи една и ще оцелееш“.

> **[ИЗБОР] Какво правиш?**  
> **А)** Разрушавaш чашите. *(Requires `spell.fire_breath`; anger spirits, tension +5)*  
> **Б)** Пиеш от една. *(Luck check 50 → ако успех morale +10, ако провал injury)*  
> **В)** Оставяш амулета да светне и отказваш. *(Willpower 60 → `state.flag.greedy_spirit = pacified`)*  

> **STATE UPDATE**: провал → `state.flag.greedy_spirit = hostile`.

---

## Сцена 108 — "Подземното езеро"

> **Traceability**: MAIN-QUEST-OUTLINE §499–504 · SCENARIO-WRITING-PLAN §6.6 · ред #338  
> **Свързани документи**: TRAVEL-SYSTEM.md §Underground lake, GAME-CAPABILITIES.md §Swim test

Езерото е тъмно, водата леденa. Прехвърляш монетите в торбата и стягаш ремъците.

> **[ИЗБОР] Как го преминаваш?**  
> **А)** Плуваш сам със светлина. *(Swim 60, при успех morale +5)*  
> **Б)** Използваш изсушени греди да направиш сал. *(Requires `inventory.supplies ≥ 5`)*  
> **В)** Призоваваш водния щит да те носи. *(spell.water_shield; fatigue +5)*

> **STATE HOOK**: провал → `injury_level +=1`, `state.flag.wet_supplies = true`.

---

## Сцена 109 — "Гласовете на жертвите"

> **Traceability**: MAIN-QUEST-OUTLINE §505–508 · SCENARIO-WRITING-PLAN §6.6 · ред #339  
> **Свързани документи**: LORE-CARDS.md §Victim spirits, MAGIC-SPELLS.md §Calming chant

След езерото тунелът е покрит със скелети. Техните духове прошепват избори.

> **[ИЗБОР] Как се справяш?**  
> **А)** Пееш успокоителна песен. *(Requires `folk_song_belintash`; tension -10)*  
> **Б)** Предлагаш им парче от свещената пепел (ако имаш). *(inventory - Sacred Ash, morale +5)*  
> **В)** Игнорираш и вървиш напред. *(Willpower 60 → ако успех, без ефект; провал → fear mark)*

> **STATE UPDATE**: избор А/Б → `state.flag.spirits_pacified = true`.

---

## Сцена 110 — "Другият бряг"

> **Traceability**: MAIN-QUEST-OUTLINE §509–512 · SCENARIO-WRITING-PLAN §6.6 · ред #340  
> **Свързани документи**: TRAVEL-SYSTEM.md §Tunnel exit, WORLD-BIBLE.md §Sanctum threshold

Излизаш от водната секция на суха площадка. Пред теб има врата от камък със седем отвора.

> **[ИЗБОР] Как завършваш този етап?**  
> **А)** Поставяш монетите и се приготвяш за камерата на колесницата. *(state.main_quest.current = \"act_v_chariot\")*  
> **Б)** Пишеш бележки за companion-ите и ги оставяш тук. *(serves as autosave; tension -5)*  
> **В)** Оставяш религиозен символ, за да пази входа. *(Lore +5, `state.flag.tunnel_mark = true`)*  

> **STATE UPDATE**  
> - `journal.section = \"Act V — Езеро\"`  
> - `travel.route = \"belintash_gate\"`.

---

> **Следва:** Акт V · Сцени 111–115 \"Камерите на колесницата\".

## Сцена 111 — "Камерата на колесницата"

> **Traceability**: MAIN-QUEST-OUTLINE §511–514 · SCENARIO-WRITING-PLAN §6.6 · ред #341  
> **Свързани документи**: WORLD-BIBLE.md §Chariot description, LORE-CARDS.md §Sanctum chamber

Вратата се отваря и виждаш колесницата — златни дъги, резби с конски глави, камъни, които свети като изгрев.

> **[ИЗБОР] Как пристъпваш?**  
> **А)** На колене, докосвайки пода. *(morale +10, `state.flag.chariot_respect = true`)*  
> **Б)** Обхождаш внимателно и чертаеш план. *(Lore +5, intel.chariot_layout)*  
> **В)** Поставяш амулета върху орнамент. *(Amulet strain +5, но получаваш `vision.chariot_breath`)*  

> **STATE HOOK**: избор А намаля DC за сцените 112–114.

## Сцена 112 — "Гласът на амулета"

> **Traceability**: MAIN-QUEST-OUTLINE §515–518 · SCENARIO-WRITING-PLAN §6.6 · ред #342  
> **Свързани документи**: MAGIC-SPELLS.md §Amulet resonance, COMPANIONS.md §Remote reactions

Амулетът започва да гори. Чуваш глас: „Защо търсиш колесницата?“

> **[ИЗБОР] Какво отговаряш?**  
> **А)** „За да пазя истината.“ *(Willpower 60 → morale +10, tension -5)*  
> **Б)** „За да защитя народа от латинците.“ *(Leadership 55 → unlock `state.flag.kingmission = true`)*  
> **В)** „За да разбера тайните и науката.“ *(Lore 60 → `intel.chariot_engine = true`)*  

> **STATE UPDATE**: изборът определя бонуси в Act V финалните сцени.

## Сцена 113 — "Изборът на истината"

> **Traceability**: MAIN-QUEST-OUTLINE §519–524 · SCENARIO-WRITING-PLAN §6.6 · ред #343  
> **Свързани документи**: GAME-CAPABILITIES.md §Major decision, LORE-CARDS.md §Chariot moral

Колесницата предлага видение: ако я изнесеш, ще донесе сила, но и гибел.

> **[ИЗБОР] Какво решаваш?**  
> **А)** Обещаваш да я оставиш запечатана. *(state.flag.keep_chariot = true, tension -10)*  
> **Б)** Обмисляш да я използваш за царя. *(requires `state.flag.kingmission = true`; intrigue +10)*  
> **В)** Търсиш трети път — да я документираш, но не пипаш. *(Lore +10, unlock `journal.chariot_blueprint`)*  

> **FAIL** (ако избереш B без подготовка) → `state.flag.chariot_curse = true`.

## Сцена 114 — "Ритуалът на запечатването"

> **Traceability**: MAIN-QUEST-OUTLINE §525–528 · SCENARIO-WRITING-PLAN §6.6 · ред #344  
> **Свързани документи**: MAGIC-SPELLS.md §Seal ritual, TRAVEL-SYSTEM.md §Collapse timer

Трябва да поставиш монетите в слотовете и да изречеш формули.

> **[ИЗБОР] Как изпълняваш ритуала?**  
> **А)** Следваш точно схемата на отшелника. *(auto-success ако `journal.final_map = true`)*  
> **Б)** Импровизираш и включваш companions чрез обет. *(Companion affinity +10, но risk failure)*  
> **В)** Разчиташ на магията на амулета. *(Spell slot -1, fatigue +10)*  

> **STATE UPDATE**: успех → `state.flag.seal_complete = true`; провал → `state.flag.collapse_timer = fast`.

## Сцена 115 — "Срутването"

> **Traceability**: MAIN-QUEST-OUTLINE §529–532 · SCENARIO-WRITING-PLAN §6.6 · ред #345  
> **Свързани документи**: GAME-CAPABILITIES.md §Escape timer, TRAVEL-SYSTEM.md §Collapse routes

Плочите започват да се трошат. Трябва да избереш как напускаш камерата.

> **[ИЗБОР] Кой път избираш?**  
> **А)** Официалния изход, макар и срутващ се. *(Athletics 60 → ако успех, morale +5)*  
> **Б)** Тайния тунел, открит чрез `intel.tunnel_map`. *(auto-success ако имаш info, иначе danger)*  
> **В)** Оставаш за миг, за да запишеш всичко. *(Lore +10, но collapse timer -5 сек)*  

> **STATE UPDATE**  
> - `state.main_quest.current = "act_v_escape"`  
> - `travel.route = "belintash_collapse"`  
> - Journal: „Act V — Срутването започна“.

---

## Сцена 116 — "Опитът за бягство"

> **Traceability**: MAIN-QUEST-OUTLINE §533–535 · SCENARIO-WRITING-PLAN §6.6 · ред #346  
> **Свързани документи**: TRAVEL-SYSTEM.md §Collapse routes, GAME-CAPABILITIES.md §Skill challenge

Каменни блокове падат като гръмотевици. Коридорът се свива.

> **[ИЗБОР] Как бягаш?**  
> **А)** Сплашваш сривовете с огнено заклинание. *(spell.fire_breath; fatigue +5, но hazard -10)*  
> **Б)** Използваш въжета, за да се спуснеш по шахта. *(Requires `inventory.ropes`; Athletics 60)*  
> **В)** Призоваваш companion действия отгоре (ако са останали). *(Companion affinity +10; при провал injury)*

> **STATE HOOK**: fail → `injury_level +=1`, `state.flag.collapse_timer -=10`.

---

## Сцена 117 — "Писмото, което никой не прочете"

> **Traceability**: MAIN-QUEST-OUTLINE §536–537 · SCENARIO-WRITING-PLAN §6.6 · ред #347  
> **Свързани документи**: LORE-CARDS.md §Hero epistle, COMMUNICATION.md §Legacy notes

Докато бягаш, виждаш ниша. Трябва да решиш дали да оставиш послание.

> **[ИЗБОР] Оставяш ли писмо?**  
> **А)** Да, кратък отчаян ред. *(morale +5, `journal.hidden_letter = true`)*  
> **Б)** Подробен отчет за пътя. *(Lore +10, time -1)*  
> **В)** Не — всяка секунда е важна. *(quest momentum +5, но tension +5)*  

> **STATE UPDATE**: писмото влияе на Епилога (Ванга/археолозите).

---

## Сцена 118 — "Последният шанс"

> **Traceability**: MAIN-QUEST-OUTLINE §538–539 · SCENARIO-WRITING-PLAN §6.6 · ред #348  
> **Свързани документи**: GAME-CAPABILITIES.md §Luck check, MAGIC-SPELLS.md §Sacrifice

Таванът се пропуква. Имаш миг за решително действие.

> **[ИЗБОР] Какво жертваш?**  
> **А)** Хвърляш монета, за да задействаш механизъм. *(Lose 1 coin temporarily; reduces collapse)*  
> **Б)** Жертваш амулетната светлина. *(Amulet strain +10, но collapse timer +10)*  
> **В)** Приемаш удар, за да спасиш дневника. *(injury_level +1, но `journal.intact = true`)*

> **STATE HOOK**: избор определя финалния ресурс в сцена 120.

---

## Сцена 119 — "Светлината в тъмното"

> **Traceability**: MAIN-QUEST-OUTLINE §540 · SCENARIO-WRITING-PLAN §6.6 · ред #349  
> **Свързани документи**: MAGIC-SPELLS.md §Vision, WORLD-BIBLE.md §Belintash myths

Преди да излезеш (или да останеш), виждаш светлина от колесницата.

> **[ИЗБОР] Гледаш ли назад?**  
> **А)** Да — виждаш три сенки, които те благославят. *(morale +10, tension -5)*  
> **Б)** Не — фокус върху бягството. *(quest momentum +5)*  
> **В)** Поглеждаш, за да потвърдиш, че ритуалът работи. *(Lore +5, unlock `vision.final_seal`)*  

> **STATE UPDATE**: избор А/В → `state.flag.final_vision = true`.

---

## Сцена 120 — "Краят на Act V"

> **Traceability**: MAIN-QUEST-OUTLINE §541–542 · SCENARIO-WRITING-PLAN §6.6 · ред #350  
> **Свързани документи**: LORE-CARDS.md §Hero fate, GAME-CAPABILITIES.md §Ending setup

Тичаш към изхода. Чува се последният тътен.

> **[ИЗБОР] Какво става?**  
> **А)** Успяваш да излезеш, но падаш на входа. *(state.flag.hero_alive = uncertain)*  
> **Б)** Оставаш вътре — избираш да запазиш тайната. *(state.flag.hero_sacrifice = true)*  
> **В)** Оставяш дневника и монетите навън преди срутването. *(Sets up епилогите; `journal.intact = true`)*  

> **STATE UPDATE**  
> - `state.main_quest.current = "act_v_epilogue_setup"`  
> - Journal: „Act V — Съдбата на героя“  
> - Unlock epilogue variants.

---

> **Следва:** Акт V · Сцени 121–125 „Епилог I — гласът на Ванга и археолозите“.
