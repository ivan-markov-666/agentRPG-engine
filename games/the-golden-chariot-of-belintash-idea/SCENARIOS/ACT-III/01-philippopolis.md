# АКТ III · СЦЕНИ 1–10 — "ФИЛИПОПОЛ ПРИЗОВАВА"

---

## Сцена 1 — "Пътят към Филипопол"

> **Traceability**: MAIN-QUEST-OUTLINE §300–305 · SCENARIO-WRITING-PLAN §6.4 · ред #231  
> **Свързани документи**: TRAVEL-SYSTEM.md §stanimaka_to_philippopolis, WORLD-BIBLE.md §Тракийска низина, LOCATIONS.md §Филипопол

Плоската земя след планините изглежда като огромна софра: ниви, лозя, биволи, които мляскат на воля. В далечината се мержелеят трите хълма на Филипопол.

> **[ИЗБОР] Как поддържаш темпото?**  
> **А)** Бърз марш с куриерите. *(time_to_arrival -1h, stamina -10)*  
> **Б)** Пътуваш с пратениците на степта и учиш песните им. *(Lore +5, morale +5)*  
> **В)** Спираш край всяка чешма и обновяваш дневника. *(Unlock travel sketch, tension -5)*

> **TRAVEL HOOKS**  
> - `travel.route = "stanimaka_philippopolis_final"`  
> - `world_state.weather.type = "windy"` → стрелби с лък получават -5, но scent checks +5.

---

## Сцена 2 — "Градските порти"

> **Traceability**: MAIN-QUEST-OUTLINE §305–309 · SCENARIO-WRITING-PLAN §6.4 · ред #232  
> **Свързани документи**: LOCATIONS.md §Филипопол порти, GAME-CAPABILITIES.md §Gate checks

Стражите при портите носят червени плащове и железни каски, полирани като огледала. Отвън чакат търговци, монаси, музиканти.

> **[ИЗБОР] Как се представяш?**  
> **А)** Истината: носител на амулет и писмо към съвета. *(trust +10, но внимание +)*  
> **Б)** Полуправда: търговец на билки. *(Negotiation 40, при успех — няма такса)*  
> **В)** Подкуп с монета. *(inventory -1 valuable, `state.flag.phil_port_bribe = true` → може да помогне по-късно)*

> **OPTIONAL CHECK**: ако имаш „Letter of Passage“ от Караджов, портите се отварят незабавно, но стражите искат да те съпроводят.

---

## Сцена 3 — "Кварталите"

> **Traceability**: MAIN-QUEST-OUTLINE §309–317 · SCENARIO-WRITING-PLAN §6.4 · ред #233  
> **Свързани документи**: LOCATIONS.md §Филипопол квартали, WORLD-BIBLE.md §Социална структура

Филипопол е шепа светове в един: тракийският квартал с руини, гръцкият с мраморни перила, българският с печки и гъдулки.

> **[ИЗБОР] Къде се насочваш първо?**  
> **А)** Тракийският квартал (руини, lore clues).  
> **Б)** Гръцкият квартал (богати контакти, economy hooks).  
> **В)** Българският квартал (занаятчии, morale).  
> *(Всяка опция unlock-ва съответна side quest линия и NPC контакти.)*

> **Companion реакции**: Калина предпочита българския квартал (билки), Шаро обича тракийските руини заради нови миризми.

---

## Сцена 4 — "Гостилница \"Три корони\""

> **Traceability**: MAIN-QUEST-OUTLINE §317–320 · SCENARIO-WRITING-PLAN §6.4 · ред #234  
> **Свързани документи**: LOCATIONS.md §Филипопол гостилници, CHARACTERS.md §Ханджията Ликург

"Три корони" е лукс: килими от Смирна, кристални чаши, аромати на канела и печено агне. Тук се говори по шест езика едновременно.

> **[ИЗБОР] Къде се настаняваш?**  
> **А)** Частна стая (скъпо, privacy flag +).  
> **Б)** Общата зала (слухове, `state.rumor_pool += 1`).  
> **В)** Терасата с изглед към хълмовете (unlock визионерска сцена нощем).

> **NPC HOOKS**:  
> - **Ликург** — знае кой плаща на стражите.  
> - **Сянката в ъгъла** — вероятно човек на Братството.  
> - **Млад благородник Алексий** — предлага услуга.

---

## Сцена 5 — "Подземните сигнали"

> **Traceability**: MAIN-QUEST-OUTLINE §320–333 · SCENARIO-WRITING-PLAN §6.4 · ред #235  
> **Свързани документи**: LORE-CARDS.md §Philippopolis tunnels, TRAVEL-SYSTEM.md §Underground routes

През нощта получаваш вест, че под града има тунели с лампи, които мигат сами. Стражите искат да провериш.

> **[ИЗБОР] Как реагираш?**  
> **А)** Влизаш лично с companion. *(Unlock Act III подземен луп)*  
> **Б)** Пращаш специални куриери. *(Logistics +5, signal updates)*  
> **В)** Свързваш се с посланиците на Белинташ за съвместна мисия. *(Lore +5, tension -5)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iii_city_entry"`  
> - `travel.route = "philippopolis_tunnel_network"`  
> - Companion flags: Калина „City awe“, Шаро scent "market_spices".

---

> **Следва:** Акт III · Сцени 6–10 "Тракийските тунели и библиотеката на Филипопол".

## Сцена 6 — "Младият благородник Алексий"

> **Traceability**: MAIN-QUEST-OUTLINE §318–323 · SCENARIO-WRITING-PLAN §6.4 · ред #236  
> **Свързани документи**: CHARACTERS.md §Алексий, LOCATIONS.md §Гостилници, COMPANIONS.md §Калина

На терасата на „Три корони“ те очаква Алексий — млад благородник с колан от сребърни токи и поглед, който измерва хълмовете като шахматист.

> **[ИЗБОР] Как го приветстваш?**  
> **А)** Споделяш шеги за пътешествието. *(morale +5, trust +5)*  
> **Б)** Показваш амулета насаме. *(requires `amulet_state.revealed_to_alexios = false`, set true; intrigue +10)*  
> **В)** Мълчаливо изучаваш реакциите му. *(Insight 45 — при успех получаваш `intel.alexios_family`)*

> **NPC HOOK**: Алексий е обсебен от легендите за Белинташ и намеква, че знае „човек с ключове към библиотеката“.

---

## Сцена 7 — "Услугата на Алексий"

> **Traceability**: MAIN-QUEST-OUTLINE §322–324 · SCENARIO-WRITING-PLAN §6.4 · ред #237  
> **Свързани документи**: GAME-CAPABILITIES.md §Stealth/Heist, STATE-MACHINE.md §Reputation

Алексий иска копие на документ, който се пази в дома на съперник банкер. Нощта е влажна, балконите са пълни с висящ босилек.

> **[ИЗБОР] Как приемаш задачата?**  
> **А)** Съгласяваш се да проникнеш сам. *(Stealth 50, при успех `state.flag.alexios_debt = paid`)*  
> **Б)** Предлагаш дипломатическа размяна вместо кражба. *(Negotiation 55, при успех reputation civic +5)*  
> **В)** Отказваш и предупреждаваш за рисковете. *(trust -5, но tension -5; unlock side quest „Честта на Алексий“)*

> **STATE HOOKS**  
> - Успешна кражба → `inventory.documents += "Ledger of Chrysanthe"`  
> - Разобличаване → `city_alert_level +1`, NPC патрули в квартала.

---

## Сцена 8 — "Градската библиотека"

> **Traceability**: MAIN-QUEST-OUTLINE §324 · SCENARIO-WRITING-PLAN §6.4 · ред #238  
> **Свързани документи**: LOCATIONS.md §Philippopolis Library, WORLD-BIBLE.md §Знание и архиви

Библиотеката е бивш храм с колони от розов мрамор. Лампи от рибено масло хвърлят златни ореоли върху свитъците.

> **[ИЗБОР] Как осигуряваш достъп?**  
> **А)** Показваш писмото на Алексий. *(Unlock special research desk)*  
> **Б)** Плащаш такса на библиотекаря. *(currency -5 сребърни, `state.rumor_pool += 1`)*  
> **В)** Проникваш през сервизния вход. *(Stealth 45, при провал → minor chase)*

> **RESEARCH CHECK**: Lore 50 → откриваш карта с подземни тунели (`intel.phil_tunnels_map = true`).  
> **HUD UPDATE**: journal → нов раздел „Белинташ и Филипопол — връзки“.

---

## Сцена 9 — "Елена сред свитъците"

> **Traceability**: MAIN-QUEST-OUTLINE §326–328 · SCENARIO-WRITING-PLAN §6.4 · ред #239  
> **Свързани документи**: CHARACTERS.md §Елена, COMPANIONS.md §Potential Ally, LORE-CARDS.md §Белинташ легенди

Елена носи мастилени петна по пръстите, аромат на розмарин и гласа, който кара буквите да оживяват.

> **[ИЗБОР] Как печелиш доверието ѝ?**  
> **А)** Споделяш песен от Тракия, научена по пътя. *(Requires scene 1 опция Б; affinity +10)*  
> **Б)** Показваш част от амулета. *(Lore 55 → unlock `state.flag.elena_ally = true`)*  
> **В)** Даваш информация за Алексий. *(Intrigue trade → получаваш `intel.council_faction` но trust_alexios -5)*

> **Companion реакции**: Калина ревнува (-5 affinity) ако разчиташ на чар; Шаро остава при входа (scent "ink_dust").

---

## Сцена 10 — "Историята за Белинташ"

> **Traceability**: MAIN-QUEST-OUTLINE §328–333 · SCENARIO-WRITING-PLAN §6.4 · ред #240  
> **Свързани документи**: WORLD-BIBLE.md §Белинташ, LORE-CARDS.md §Тракийски колесници, MAIN-QUEST-OUTLINE §333

Елена разгръща пергамент със символи на колесница, четири конски глави и звезден пояс.

> **[ИЗБОР] Как реагираш на разкритието?**  
> **А)** Записваш всяка дума. *(Unlock journal sketch, Lore +5)*  
> **Б)** Питаш за практични стъпки. *(Gain `quest_hook.tunnels_entry`)*  
> **В)** Оспорваш легендата. *(Willpower 40 — при успех tension -5, но lore_gain -5)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iii_library_arc"`  
> - `quest_flags.coin_four_hint = true`  
> - Ако `state.flag.elena_ally = true`, добавя Companion passive „Scholar Insight“ (Lore checks -5 DC).

---

## Сцена 11 — "Подземията на Филипопол"

> **Traceability**: MAIN-QUEST-OUTLINE §330 · SCENARIO-WRITING-PLAN §6.4 · ред #241  
> **Свързани документи**: LORE-CARDS.md §Philippopolis tunnels, TRAVEL-SYSTEM.md §Underground routes, MAPS.md §Тунели

Сенките влизат първи — факли, които никога не догарят, символи на Сабазий по стените. Мирише на студена вода и желязо.

> **[ИЗБОР] Как се подготвяш за слизането?**  
> **А)** Освещаваш входа с билки на Калина. *(Requires Калина, grant `buff.focus +5`)*  
> **Б)** Пускаш Шаро напред за разузнаване. *(Animal Handling 45 → `intel.tunnel_scent`)*  
> **В)** Викаш градски стражи за подкрепа. *(gain `ally.city_guard`, но stealth -10)*

> **STATE HOOKS**  
> - `travel.route = "philippopolis_catacombs"`  
> - `world_state.light_level = "dim"` → всички боеве -5 точност, освен ако носиш светилник.

---

## Сцена 12 — "Експедицията"

> **Traceability**: MAIN-QUEST-OUTLINE §331–333 · SCENARIO-WRITING-PLAN §6.4 · ред #242  
> **Свързани документи**: GAME-CAPABILITIES.md §Group exploration, COMPANIONS.md §Шаро/Калина

Хълмовете над теб бавно се сменят с подземни зали: мозайки на тракийски колесници, разпилени костилки от грозде — знак, че някой е идвал скоро.

> **[ИЗБОР] Как водиш групата?**  
> **А)** Строга формация — ти отпред. *(Leadership 40 → morale +5)*  
> **Б)** Оставяш компаньон да води. *(ако Шаро → trap sense +10, ако Калина → lore hint)*  
> **В)** Работиш със стражите. *(Requires `ally.city_guard`; unlock `support.fire_line` но tension +5)*

> **RANDOM EVENT** *(roll 1d4)*  
> 1–2: стари механизми изпускат пара → Stamina -5.  
> 3–4: откривате ниша с резервни факли → `inventory + torches`.

---

## Сцена 13 — "Древният олтар"

> **Traceability**: MAIN-QUEST-OUTLINE §334–336 · SCENARIO-WRITING-PLAN §6.4 · ред #243  
> **Свързани документи**: WORLD-BIBLE.md §Тракийски олтари, LORE-CARDS.md §Колесница на небето

Залата е кръгла, таванът — обсипан със звезди от ахат. В центъра има каменен диск с издълбан зодиак, а върху него — място за монета.

> **[ИЗБОР] Как изследваш олтара?**  
> **А)** Използваш амулета за резонанс. *(Amulet charge -1, но получаваш vision clue)*  
> **Б)** Анализираш символите. *(Lore 55 → `quest_hook.altar_rotation`)*  
> **В)** Оставяш Елена (ако е ally) да води. *(Unlock `scholar_channeling`, morale +5)*

> **HUD NOTE**: ако `quest_hook.altar_rotation = true`, дневникът се обновява с „звездно позициониране“ (миникарта).

---

## Сцена 14 — "Капанът"

> **Traceability**: MAIN-QUEST-OUTLINE §336–337 · SCENARIO-WRITING-PLAN §6.4 · ред #244  
> **Свързани документи**: GAME-CAPABILITIES.md §Trap resolution, STATE-MACHINE.md §Injury

Щом докоснеш диска, каменните глави на лъвове изхвърлят остър вятър. Подът започва да се върти като огромен тезгях.

> **[ИЗБОР] Как реагираш?**  
> **А)** Прилагаш научените в Станимака въжета. *(Requires `item.stan_rope`, Dexterity 45 → cancel trap)*  
> **Б)** Командваш групата да се хвърли по нишите. *(Leadership 50 → half damage)*  
> **В)** Активираш магия „Щит на Сабазий“ ако я имаш. *(Spell slot -1, trap nullified)*

> **FAIL CONSEQUENCE**: `injury_level += 1`, morale -5, companion affinity -5 ако ги подложиш на риск без предупреждение.

---

## Сцена 15 — "Стражът на олтара"

> **Traceability**: MAIN-QUEST-OUTLINE §338–340 · SCENARIO-WRITING-PLAN §6.4 · ред #245  
> **Свързани документи**: LORE-CARDS.md §Тракийски жреци, MAGIC-SPELLS.md §Дъхът на Сабазий

След капана се появява дух — жрец с бронзова маска, чиято коса е от жив пламък.

> **[ИЗБОР] Как отговаряш на изпитанието?**  
> **А)** Рецитираш легендата, научена от Елена. *(Lore 60 → `quest_flags.guardian_respected`)*  
> **Б)** Предлагаш кървав обет. *(Morality check: ако morale < 0 → corruption +1)*  
> **В)** Полагащ бой. *(Combat DC 55, при успех духът се разсейва, но coin_hint -5)*

> **STATE UPDATE**  
> - Успех → `quest_flags.coin_four_trial = completed`, `inventory.clue = "Starmap fragment"`  
> - Провал → `state.tension += 10`, guardian остава и ще се намеси по-късно.

---

## Сцена 16 — "Четвъртата монета"

> **Traceability**: MAIN-QUEST-OUTLINE §341–343 · SCENARIO-WRITING-PLAN §6.4 · ред #246  
> **Свързани документи**: LORE-CARDS.md §Coins of Belintash, INVENTORY.md §Key items, WORLD-BIBLE.md §Колесницата

След изпита каменният диск се разтваря и открива ниша с медна касета. Вътре лежи монета, която сияе като залез над Марица.

> **[ИЗБОР] Как я взимаш?**  
> **А)** Почтително, с молитва към Сабазий. *(morale +5, `quest_flags.guardian_respected` задължително)*  
> **Б)** Използваш амулета да стабилизираш енергията. *(Amulet charge -1, tension -5)*  
> **В)** Командваш спътник да я вземе. *(Companion affinity ± според героя; ако отказва → Leadership 45)*

> **STATE UPDATE**  
> - `inventory.quest_items += "Coin #4 — Star Gate"`  
> - `quest_flags.coin_four_collected = true`  
> - HUD: journal → нов раздел „Колесницата: четири ключа“.

---

## Сцена 17 — "Магьосникът Валентин"

> **Traceability**: MAIN-QUEST-OUTLINE §343–345 · SCENARIO-WRITING-PLAN §6.4 · ред #247  
> **Свързани документи**: MAGIC-SPELLS.md §Elemental Paths, CHARACTERS.md §Валентин

Когато се връщаш на повърхността, те чака старец с очи на вълк и плащ, подплатен с анасонова миризма. Това е Валентин, легендарният маг.

> **[ИЗБОР] Как го убеждаваш да помогне?**  
> **А)** Показваш монетата като доказателство за съдбата. *(trust +10)*  
> **Б)** Обещаваш да защитиш града от латинците. *(Reputation civic +5)*  
> **В)** Чертаеш руна от амулета. *(Arcana 50 → unlock `state.flag.valentin_curiosity`)*

> **NPC HOOK**: ако `state.flag.elena_ally = true`, тя гарантира за теб → автоматичен успех.

---

## Сцена 18 — "Урок по магия"

> **Traceability**: MAIN-QUEST-OUTLINE §346–348 · SCENARIO-WRITING-PLAN §6.4 · ред #248  
> **Свързани документи**: MAGIC-SPELLS.md §Fire/Water, COMPANIONS.md §Калина реакции

В мазето на Валентин има два басейна: един с пламъци, един с тъмна вода. Магът настоява да избереш стихия.

> **[ИЗБОР] Коя стихия прегръщаш?**  
> **А)** Огън — „Дъхът на Сабазий“. *(Unlock spell `spell.fire_breath`, но `stats.stamina -10`)*  
> **Б)** Вода — „Гласът на Марен“. *(Unlock spell `spell.water_shield`, morale +5)*  
> **В)** Отказваш да се обвържеш. *(Willpower 45 → tension -5, но няма нови заклинания)*

> **TRAINING CHECK**: Arcana 55 → намалява разхода за избраната магия с 1.

---

## Сцена 19 — "Цената на магията"

> **Traceability**: MAIN-QUEST-OUTLINE §348–349 · SCENARIO-WRITING-PLAN §6.4 · ред #249  
> **Свързани документи**: STATE-MACHINE.md §Exhaustion, MAGIC-SPELLS.md §Backlash

След урока коленете ти треперят. Валентин изисква жертва: или време, или къс от личен спомен.

> **[ИЗБОР] Как плащаш цената?**  
> **А)** Обещаваш да му донесеш артефакт от бъдеща мисия. *(Adds `quest_debt.valentin = open`)*  
> **Б)** Споделяш най-личния си спомен. *(morale -5, но `spell proficiency +10`)*  
> **В)** Предлагаш част от своята енергия. *(Health -10, tension -10)*

> **Companion реакции**: Калина протестира срещу вариант Б (-5 affinity), Шаро става неспокоен при вариант В.

---

## Сцена 20 — "Царският двор"

> **Traceability**: MAIN-QUEST-OUTLINE §350–353 · SCENARIO-WRITING-PLAN §6.4 · ред #250  
> **Свързани документи**: LOCATIONS.md §Philippopolis Citadel, CHARACTERS.md §Болярин Петър, POLITICS.md §Царски съвет

С поканата на Валентин влизаш в цитаделата. Полирани плочи, знамена на Асеневци, болярите шепнат като река в каменно корито.

> **[ИЗБОР] Как се позиционираш?**  
> **А)** Представяш монетата и искаш официална подкрепа. *(state.reputation.court +10, но intrigue +10)*  
> **Б)** Мълчиш и наблюдаваш Петър, който те изучава. *(Insight 50 → `intel.bolyarin_pact`)*  
> **В)** Държиш реч за защитата на града. *(Oratory 55, при успех morale на града +5; при провал tension +10)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iii_court_intrigue"`  
> - Unlock side quest „Сделката на болярина“ ако `intel.bolyarin_pact = true`.

---

## Сцена 21 — "Боляринът Петър"

> **Traceability**: MAIN-QUEST-OUTLINE §353–356 · SCENARIO-WRITING-PLAN §6.4 · ред #251  
> **Свързани документи**: CHARACTERS.md §Болярин Петър, POLITICS.md §Дворцови фракции

Петър е като резбован стълб: неподвижен, но усещаш напрежението в жилите му. Той говори за търговските дългове към латинците и предлага „взаимно прикритие“.

> **[ИЗБОР] Как водиш разговора?**  
> **А)** Приемаш да обмените информация. *(intrigue +5, `state.flag.peter_alliance = tentative`)*  
> **Б)** Настояваш, че служиш само на царя. *(reputation court +5, но Петър -10 trust)*  
> **В)** Шегуваш се и го оставяш да говори. *(Comedy 45 → tension -5, unlock `intel.peter_motive`)*

> **STATE HOOK**: ако `state.flag.phil_port_bribe = true`, Петър намеква, че знае за това → tension +5.

---

## Сцена 22 — "Тайната на болярина"

> **Traceability**: MAIN-QUEST-OUTLINE §356–358 · SCENARIO-WRITING-PLAN §6.4 · ред #252  
> **Свързани документи**: LORE-CARDS.md §Колесница и царски двор, SIDE-QUESTS.md §Philippopolis intrigue

Петър показва свитък с печатите на трима други боляри. Те искат монетите за себе си, уж за царя.

> **[ИЗБОР] Как реагираш?**  
> **А)** Снимаш печатите с въглен в дневника. *(Unlock `evidence.peter_conspiracy`)*  
> **Б)** Предлагаш да скриеш монетата временно. *(trust +10, но `state.flag.coin_hidden = true`)*  
> **В)** Угрожаваш, че ще съобщиш на царя. *(Intimidation 50 → ако успех tension -5; провал → guard ambush later)*

> **Companion реакции**: Калина не одобрява укриването (-5 affinity); Шаро реагира на миризмата на восък (scent log „royal_wax“).

---

## Сцена 23 — "Опасният избор"

> **Traceability**: MAIN-QUEST-OUTLINE §358–360 · SCENARIO-WRITING-PLAN §6.4 · ред #253  
> **Свързани документи**: STATE-MACHINE.md §Reputation, GAME-CAPABILITIES.md §Branch consequences

Дворцовият съвет се събира. Трябва да решиш дали да подкрепиш Петър открито, да останеш неутрален или да го разобличиш.

> **[ИЗБОР] Какъв курс избираш?**  
> **А)** Подкрепяш Петър. *(reputation court faction „боляри“ +10, но „цар“ -5)*  
> **Б)** Оставаш неутрален. *(tension -5, но няма бонуси)*  
> **В)** Издаваш заговорниците. *(requires `evidence.peter_conspiracy`; резултат → `state.flag.peter_enemy = true`)*  

> **HUD NOTE**: изборът настройва `state.political_alignment` (bolyar / crown / neutral) и отключва различни сцени в Act III финала.

---

## Сцена 24 — "Атентатът"

> **Traceability**: MAIN-QUEST-OUTLINE §360–363 · SCENARIO-WRITING-PLAN §6.4 · ред #254  
> **Свързани документи**: GAME-CAPABILITIES.md §Night encounter, SECURITY.md §Assassins

През нощта, докато ограждаш монетата с талисмани, прозорецът се пръска от кука. Двама сенки с маски на соколи се втурват вътре.

> **[ИЗБОР] Как се защитаваш?**  
> **А)** Активираш новата магия. *(използвай избраната стихия; при успех assassin morale -10)*  
> **Б)** Командваш companion да задържи входа. *(Requires companion; success → `assassin_escape = false`)*  
> **В)** Бягаш към коридорите и задействаш аларма. *(Stealth 45 → ако успех guard support +5; провал → injury)*

> **STATE HOOK**  
> - Провал → `injury_level +=1`, `state.tension += 5`  
> - Успех → `intel.assassin_token` (указва гилдията).

---

## Сцена 25 — "Разследването"

> **Traceability**: MAIN-QUEST-OUTLINE §363–365 · SCENARIO-WRITING-PLAN §6.4 · ред #255  
> **Свързани документи**: SIDE-QUESTS.md §Philippopolis mystery, LOCATIONS.md §Гилдия на сенките

На сутринта стражите искат обяснения, а ти проследяваш символа от токата до скритите врати на гилдията.

> **[ИЗБОР] Как продължаваш?**  
> **А)** Сътрудничиш с градската стража. *(city_guard trust +10, но гилдията се укрива)*  
> **Б)** Отиваш сам през покривите. *(Parkour 50 → unlock `entry.shadow_guild`)*  
> **В)** Молиш Валентин да разкрие знаците. *(Spellcraft 45 → `intel.shadow_passphrase`)*  

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iii_shadow_inquiry"`  
> - Unlock side quest „Гилдията на сенките“ и подготовка за сцени 26–30.

---

## Сцена 26 — "Гилдията на сенките"

> **Traceability**: MAIN-QUEST-OUTLINE §365 · SCENARIO-WRITING-PLAN §6.4 · ред #256  
> **Свързани документи**: LOCATIONS.md §Shadow Guild, SIDE-QUESTS.md §Philippopolis stealth

Входът е зад мелницата, три тухли надолу, две вляво. Мирише на восък, желязо и страх. Надпис: *„Тук влиза само този, който знае кога луната кима.“*

> **[ИЗБОР] Как се представяш?**  
> **А)** Показваш токена от атентата. *(unlock audience, `state.flag.shadow_token_shown = true`)*  
> **Б)** Използваш паролата от Валентин. *(Spellcraft 45; при успех tension -5)*  
> **В)** Проникваш тайно. *(Stealth 55 — при провал guard combat)*

> **STATE HOOK**: ако си показал токена → `state.reputation.shadow = cautious`.

---

## Сцена 27 — "Главата на гилдията"

> **Traceability**: MAIN-QUEST-OUTLINE §366 · SCENARIO-WRITING-PLAN §6.4 · ред #257  
> **Свързани документи**: CHARACTERS.md §Госпожа Арета, GAME-CAPABILITIES.md §Negotiation

Арета носи воал от черен креп, очите ѝ са остри като щраусови пера. Тя предлага неутралитет, ако ѝ върнеш услуга.

> **[ИЗБОР] Как водиш преговорите?**  
> **А)** Обещаваш да им доставиш информация за болярите. *(intrigue +10, но court trust -5)*  
> **Б)** Предлагаш собствена защита срещу латинци. *(requires `spell.water_shield` или `spell.fire_breath`, gain `state.flag.shadow_protected`)*  
> **В)** Отказваш и настояваш за примирие. *(Willpower 50 → tension +/− в зависимост от успех)*

> **NPC HOOK**: ако `state.flag.peter_alliance = tentative`, Арета споменава, че Петър също ги плаща.

---

## Сцена 28 — "Услугата"

> **Traceability**: MAIN-QUEST-OUTLINE §367–368 · SCENARIO-WRITING-PLAN §6.4 · ред #258  
> **Свързани документи**: GAME-CAPABILITIES.md §Heist mini, SIDE-QUESTS.md §Philippopolis intrigue

Арета иска малък, но деликатен обект: пергамент със сметка на Петър, заключен в сребърен сандък.

> **[ИЗБОР] Как изпълняваш задачата?**  
> **А)** Нощно проникване през покрива. *(Stealth 55, при успех `evidence.peter_finances`)*  
> **Б)** Социален инженеринг — преструваш се на писар. *(Deception 50, inventory -1 fine clothes)*  
> **В)** Караш companion да отвлече вниманието. *(Requires companion; при успех trust_companion +5)*

> **FAIL CONSEQUENCE**: `city_alert_level +1`, tension +5, Арета намалява наградата.

---

## Сцена 29 — "Новината за петата монета"

> **Traceability**: MAIN-QUEST-OUTLINE §369–370 · SCENARIO-WRITING-PLAN §6.4 · ред #259  
> **Свързани документи**: WORLD-BIBLE.md §Чудни мостове, LORE-CARDS.md §Dragon legend

За награда гилдията разкрива карта с издълбани мостове и бележка: „Монетата на змея лежи там, където костите пеят на вятъра“.

> **[ИЗБОР] Как реагираш?**  
> **А)** Благодариш и обещаваш почтеност. *(shadow trust +10, morale +5)*  
> **Б)** Питаш за подробности. *(Lore 45 → `intel.dragon_trials`)*  
> **В)** Подозираш капан. *(Insight 50 — при успех tension -5, но shadow trust -5)*

> **STATE UPDATE**  
> - `quest_flags.coin_five_location = "wondrous_bridges"`  
> - `travel.route_next = "philippopolis_to_zabardo"`  
> - HUD: карта → добавя маркер „Чудни мостове“.

---

## Сцена 30 — "Подготовка за заминаване"

> **Traceability**: MAIN-QUEST-OUTLINE §371–378 · SCENARIO-WRITING-PLAN §6.4 · ред #260  
> **Свързани документи**: TRAVEL-SYSTEM.md §City exit, COMPANIONS.md §Калина/Шаро, INVENTORY.md §Supplies

Филипопол се буди под мъгла. Събираш провизии, сменяш подкови, подсилваш амулета с восъка на Арета.

> **[ИЗБОР] Кого взимаш с теб?**  
> **А)** Само най-необходимите — бърз поход. *(Encumbrance -1, morale -5)*  
> **Б)** Целия кортеж + стражи. *(travel speed -1, но security +5)*  
> **В)** Тайната комбинация: ти, companion и куриерите. *(unlock `travel.party_stealthy = true`)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iii_departure"`  
> - `travel.route = "philippopolis_zabardo_pass"`  
> - Companion flags: Калина „anticipation“, Шаро scent "guild_wax".

---

## Сцена 31 — "Срещата със самодивата"

> **Traceability**: MAIN-QUEST-OUTLINE §372 · SCENARIO-WRITING-PLAN §6.4 · ред #261  
> **Свързани документи**: WORLD-BIBLE.md §Самодиви, LORE-CARDS.md §Самодивски песни

На разсъмване край реката женска фигура стъпва по водата. Косите ѝ са като струни, които свирят от сами. Тя се представя като Ясена от Равните треви.

> **[ИЗБОР] Как я приветстваш?**  
> **А)** Правиш дълбок поклон и цитираш легенда. *(Lore 50 → trust +10)*  
> **Б)** Протягаш амулета да покаже светлини. *(Amulet charge -1, но unlock vision)*  
> **В)** Разчиташ на хумор и я каниш на чаша медовина. *(Comedy 45 → при успех morale +5, иначе tension +5)*

> **STATE HOOK**: ако companion Калина присъства, Ясена изисква обещание за уважение към природата (`state.flag.nature_vow = true`).

---

## Сцена 32 — "Изпитанието на самодивата"

> **Traceability**: MAIN-QUEST-OUTLINE §373–374 · SCENARIO-WRITING-PLAN §6.4 · ред #262  
> **Свързани документи**: GAME-CAPABILITIES.md §Performance checks, MAGIC-SPELLS.md §Song wards

Ясена поставя изпитание: танц върху росата, песен без думи, или отгатване на загадка.

> **[ИЗБОР] Какъв изпит поемаш?**  
> **А)** Танц — *(Agility 50 → при успех `buff.evasion +5`)*  
> **Б)** Песен — *(Performance 55; ако companion = Калина → +10)*  
> **В)** Загадка — *(Insight 50; провал → tension +5, Ясена изчезва)*

> **FAIL CONSEQUENCE**: самодивата се отдалечава; необходимо е `nature_vow` за повторен опит.

---

## Сцена 33 — "Благословията"

> **Traceability**: MAIN-QUEST-OUTLINE §375–376 · SCENARIO-WRITING-PLAN §6.4 · ред #263  
> **Свързани документи**: MAGIC-SPELLS.md §Forest blessings, COMPANIONS.md §Шаро реакции

При успех Ясена дарява капка от своята росица, която свети като лунен нож.

> **[ИЗБОР] Къде насочваш благословията?**  
> **А)** Върху себе си – *(gain `buff.samodiva_aegis`, morale +5)*  
> **Б)** Върху companion – *(companion affinity +10, unlock unique реакция)*  
> **В)** Върху монетите – *(quest_flags.coins_glimmer = true`, tension -5, но shadow trust -5 защото стават по-видими)*

> **HUD UPDATE**: нов indicator „Samodiva Grace“ активен до края на Act III.

---

## Сцена 34 — "Последните приготовления"

> **Traceability**: MAIN-QUEST-OUTLINE §377 · SCENARIO-WRITING-PLAN §6.4 · ред #264  
> **Свързани документи**: TRAVEL-SYSTEM.md §Supply nodes, INVENTORY.md §Crafting

Връщаш се в града за последни покупки: пушени меса, восък, нови подкови, тайна карта от Арета.

> **[ИЗБОР] Какво приоритизираш?**  
> **А)** Лек багаж и допълнителни въжета. *(Encumbrance -1, `state.flag.extra_ropes = true`)*  
> **Б)** Медицини и билки. *(inventory + herbal kits, companion affinity +5)*  
> **В)** Луксозни подаръци за евентуални съюзници по пътя. *(currency -10 сребърни, но reputation +5)*

> **STATE NOTE**: ако `state.flag.coin_hidden = true`, петърски агенти следят пазара → Stealth 45 за да избегнеш засичане.

---

## Сцена 35 — "Отпътуване към Чудните мостове"

> **Traceability**: MAIN-QUEST-OUTLINE §378–379 · SCENARIO-WRITING-PLAN §6.4 · ред #265  
> **Свързани документи**: TRAVEL-SYSTEM.md §Philippopolis → Zabardo, WORLD-BIBLE.md §Родопи

Колоната тръгва на запад. Прахът по булевардите се вдига като спомен за всички срещи. Хълмовете зад теб блестят в последната светлина.

> **[ИЗБОР] Как маркираш заминаването?**  
> **А)** Официално – изпращаш гълъб до царя. *(court reputation +5, но intrigue +5)*  
> **Б)** Тайно – напускаш през странична порта. *(travel.party_stealthy +, tension -5)*  
> **В)** Ставаш на площада и обещаваш завръщане. *(Morale +10, но `state.flag.public_hero = true` → повече random encounters)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iii_journey_to_bridges"`  
> - `travel.route = "zabardo_mountain_pass"`  
> - Journal: нов раздел „Act IV Preview — Чудните мостове“.

---

## Сцена 36 — "Пътят към Забърдо"

> **Traceability**: MAIN-QUEST-OUTLINE §380 · SCENARIO-WRITING-PLAN §6.4 · ред #266  
> **Свързани документи**: TRAVEL-SYSTEM.md §Mountain routes, WORLD-BIBLE.md §Забърдо

Пътеката вие като змия над урви. Боровете са като колоните на изсъхнал храм.

> **[ИЗБОР] Как управляваш каравана?**  
> **А)** Подреждаш хората по двойки. *(Leadership 40 → morale +5)*  
> **Б)** Оставяш куриерите да скаутнат напред. *(Logistics +5, travel speed +1)*  
> **В)** Спираш често за скици. *(Lore +5, но time_to_destination +1h)*

> **STATE HOOK**: `travel.hazard = "rockfall"` ако `state.flag.extra_ropes = false`.

---

## Сцена 37 — "Село Забърдо"

> **Traceability**: MAIN-QUEST-OUTLINE §381–383 · SCENARIO-WRITING-PLAN §6.4 · ред #267  
> **Свързани документи**: LOCATIONS.md §Забърдо, SIDE-QUESTS.md §Zabardo

Забърдо е като пазен секрет: дървени къщи вградени в скалата, хора с очи като планински орли.

> **[ИЗБОР] Кой те посреща?**  
> **А)** Старецът Ангел — пази легендата за змея. *(Lore +5)*  
> **Б)** Младата занаятчийка Дана — предлага оборудване. *(inventory upgrade)*  
> **В)** Командирът на стражата — иска да чуе новините от Филипопол. *(reputation +5)*

> **Companion реакции**: Калина се вдъхновява (+5 morale), Шаро открива нови миризми (scent „pine_smoke“).

---

## Сцена 38 — "Разказът за змея"

> **Traceability**: MAIN-QUEST-OUTLINE §384 · SCENARIO-WRITING-PLAN §6.4 · ред #268  
> **Свързани документи**: WORLD-BIBLE.md §Змейски легенди, LORE-CARDS.md §Dragon bones

Старецът Ангел те води до огнището и разказва за магарето с прахан, пастирите и заспалия змей.

> **[ИЗБОР] Как реагираш?**  
> **А)** Питаш за точни координати. *(Lore 45 → `intel.dragon_lair_entry`)*  
> **Б)** Споделяш своята история. *(trust +10, unlock `legend_exchange`)*  
> **В)** Опитваш да купиш артефакти. *(currency -5 сребърни, получаваш `item.dragon_coal` ако успееш)*

> **STATE UPDATE**: Journal → „Dragon Legend – Версия Забърдо“.

---

## Сцена 39 — "Първият поглед към Чудните мостове"

> **Traceability**: MAIN-QUEST-OUTLINE §385 · SCENARIO-WRITING-PLAN §6.4 · ред #269  
> **Свързани документи**: WORLD-BIBLE.md §Чудни мостове, MAPS.md §Rhodope

Над залеза виждаш как скалите се съединяват като две ръце, които държат небето.

> **[ИЗБОР] Как се подготвяш за гледката?**  
> **А)** Медитираш и оставяш амулета да вибрира. *(Willpower 40 → tension -5)*  
> **Б)** Правиш лагер и чертаеш карта. *(travel speed -1, но `intel.bridge_paths`)*  
> **В)** Изпращаш послание до Филипопол. *(reputation +5, но `state.flag.public_hero = true` → bandit alert +5)*

> **HUD NOTE**: карта → добавя „Bridge Approach“ мини-локация.

---

## Сцена 40 — "Последната нощ преди мостовете"

> **Traceability**: MAIN-QUEST-OUTLINE §386–388 · SCENARIO-WRITING-PLAN §6.4 · ред #270  
> **Свързани документи**: CAMPING.md §Rhodope camps, MAGIC-SPELLS.md §Dream visions

Нощта преди Чудните мостове е пълна с шумове. Вятърът пее, реката говори.

> **[ИЗБОР] Какво правиш преди сън?**  
> **А)** Провеждаш ритуал с монетите. *(Amulet check 55 → `vision.bridge_spirits`)*  
> **Б)** Тренираш companions. *(Companion affinity +5, но fatigue +5)*  
> **В)** Пишеш писмо за бъдещите поколения. *(Lore +5, unlock „Legacy Entry #1“ в журнала)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iii_bridge_eve"`  
> - `travel.camp = "bridge_base_camp"`  
> - Ако `buff.samodiva_aegis = true`, получаваш подсказка за „костите, които пеят“.

---

## Сцена 41 — "Входът в Чудните мостове"

> **Traceability**: MAIN-QUEST-OUTLINE §389 · SCENARIO-WRITING-PLAN §6.4 · ред #271  
> **Свързани документи**: LOCATIONS.md §Чудни мостове, MAPS.md §Bridge entrances

Влизаш под първата арка — скалите изглеждат като гърба на вкаменен змей. Водата под теб свири на флейта.

> **[ИЗБОР] Как преминаваш първата арка?**  
> **А)** С церемониален марш. *(morale +5, но stealth -5)*  
> **Б)** Бос и мълчаливо. *(Lore 50 → unlock `state.flag.bridge_respect = true`)*  
> **В)** Използваш магията, за да светнеш пътя. *(Spell slot -1, hazard -5)*

> **STATE NOTE**: ако `state.flag.bridge_respect = true`, по-късно капаните имат -5 DC.

---

## Сцена 42 — "Пещерата под моста"

> **Traceability**: MAIN-QUEST-OUTLINE §390 · SCENARIO-WRITING-PLAN §6.4 · ред #272  
> **Свързани документи**: WORLD-BIBLE.md §Пещери Родопи, GAME-CAPABILITIES.md §Cave hazards

Шумът на реката се усилва. В пещерата има отлагания като зъби. Въздухът е студен и мирише на сяра.

> **[ИЗБОР] Как изследваш пещерата?**  
> **А)** Рисуваш карта с въглен. *(Lore +5, `intel.cave_layout`)*  
> **Б)** Използваш Шаро за scent tracking. *(Animal Handling 45 → `hazard_warning`)*  
> **В)** Пращаш куриерите да поставят маркировки. *(travel support +5, но time +1h)*

> **RANDOM EVENT**: 1–2 → свод пада (Dexterity 50 or injury). 3–4 → намираш кристал `item.echo_quartz`.

---

## Сцена 43 — "Изпитанието на храбростта"

> **Traceability**: MAIN-QUEST-OUTLINE §391–392 · SCENARIO-WRITING-PLAN §6.4 · ред #273  
> **Свързани документи**: GAME-CAPABILITIES.md §Fear checks, MAGIC-SPELLS.md §Courage wards

Тунелът се стеснява до процеп. Оттам духат ледени кошмари — шепоти на загинали пастири.

> **[ИЗБОР] Как се справяш?**  
> **А)** Влизаш първи и вдъхновяваш останалите. *(Willpower 55 → morale +10)*  
> **Б)** Активираш благословията на самодивата (ако имаш). *(auto-success, buff duration -1)*  
> **В)** Използваш магия, за да разпръснеш кошмарите. *(Spell slot -1, tension -5)*

> **FAIL**: `stats.morale -10`, `injury_level +=1`, companion affinity -5.

---

## Сцена 44 — "Разговорът с духа на змея"

> **Traceability**: MAIN-QUEST-OUTLINE §393–394 · SCENARIO-WRITING-PLAN §6.4 · ред #274  
> **Свързани документи**: LORE-CARDS.md §Dragon spirit, MAGIC-SPELLS.md §Dialogue rites

Духът се появява като блясък над костите. Гласът му е едновременно гръм и шепот.

> **[ИЗБОР] Как говориш с духа?**  
> **А)** С мъдрост — разказваш защо търсиш монетите. *(Lore 55 → `guardian_trust +10`)*  
> **Б)** С обещание за защита на Родопите. *(Reputation nature +10)*  
> **В)** С предизвикателство за дуел. *(Combat preparatory → ако успех guardian_respect +5, но tension +5)*

> **STATE UPDATE**: при доверие spirit дава `hint.coin_five_trial`.

---

## Сцена 45 — "Изпитанието на змея"

> **Traceability**: MAIN-QUEST-OUTLINE §395 · SCENARIO-WRITING-PLAN §6.4 · ред #275  
> **Свързани документи**: GAME-CAPABILITIES.md §Boss encounter, INVENTORY.md §Dragon relics

Духът създава арена от светлина. Появява се образ на змея — изпитание за сърце и ум.

> **[ИЗБОР] Какъв път избираш?**  
> **А)** Бой с копие от светлина. *(Combat DC 60 → `quest_flags.dragon_trial_combat = true`)*  
> **Б)** Решаване на загадка: подреждане на каменни дискове. *(Puzzle DC 55 → `dragon_trial_puzzle = true`)*  
> **В)** Жертвоприношение — оставяш ценен предмет. *(inventory -1 rare item, но auto-success)*

> **STATE UPDATE**  
> - Успех → `quest_flags.coin_five_trial_ready = true`, morale +10  
> - Провал → `state.tension += 10`, guardian назначава повторен изпит (Act III сцени 46–50).

---

## Сцена 46 — "Влизане в пещерата на змея"

> **Traceability**: MAIN-QUEST-OUTLINE §396 · SCENARIO-WRITING-PLAN §6.4 · ред #276  
> **Свързани документи**: MAPS.md §Dragon cave, GAME-CAPABILITIES.md §Dungeon entry

Зеят тъмен вход, обрасъл с мъх като стар мустак. Вътре мирише на желязо и хвойна.

> **[ИЗБОР] Как организираш влизането?**  
> **А)** Шаро напред, ти след него. *(Animal Handling 45 → hazard_warning)*  
> **Б)** Калина поставя билкови лампи. *(Lore +5, `light_level = dim` вместо dark)*  
> **В)** Градските стражи (ако присъстват) правят първия кордон. *(security +10, но stealth -10)*

> **STATE HOOK**: `travel.route = "dragon_cave_corridor"`; ако `state.flag.bridge_respect = false`, tension +5.

---

## Сцена 47 — "Капаните на костите"

> **Traceability**: MAIN-QUEST-OUTLINE §397 · SCENARIO-WRITING-PLAN §6.4 · ред #277  
> **Свързани документи**: GAME-CAPABILITIES.md §Trap gauntlet, INVENTORY.md §Rope usage

Кости са подредени по пода като клавиши. При всяка стъпка звукът се усилва.

> **[ИЗБОР] Как напредваш?**  
> **А)** Стъпваш по нотите, които Ясена подсказа. *(Requires `buff.samodiva_aegis`; auto-success)*  
> **Б)** Използваш допълнителните въжета. *(Requires `state.flag.extra_ropes = true`; Athletics 45)*  
> **В)** Детонираш малък заряд, за да обезвредиш капана. *(inventory -1 explosive, tension +5)*

> **FAIL CONSEQUENCE**: `injury_level +=1`, `morale -5`, trap повторение изисква time +1h.

---

## Сцена 48 — "Залата с костите"

> **Traceability**: MAIN-QUEST-OUTLINE §398 · SCENARIO-WRITING-PLAN §6.4 · ред #278  
> **Свързани документи**: WORLD-BIBLE.md §Dragon relics, LORE-CARDS.md §Bone choir

Залата е осветена от биолуминесцентни гъби. Костите на змея образуват кръг, а в центъра има каменна плоча.

> **[ИЗБОР] Какво правиш първо?**  
> **А)** Анализираш символите. *(Lore 55 → `intel.bone_runes`)*  
> **Б)** Питаш духа (ако е благосклонен). *(Requires `guardian_trust ≥ 10`; получаваш `hint.bone_sequence`)*  
> **В)** Поставяш охрана около изхода. *(security +5, но няма lore gain)*

> **HUD NOTE**: дневникът получава раздел „Bone Choir Notes“.

---

## Сцена 49 — "Петата монета"

> **Traceability**: MAIN-QUEST-OUTLINE §399 · SCENARIO-WRITING-PLAN §6.4 · ред #279  
> **Свързани документи**: LORE-CARDS.md §Coin five, INVENTORY.md §Quest items

В нишата на черепа блести монета с изображение на змей, който се храни със звездна светлина.

> **[ИЗБОР] Как я взимаш?**  
> **А)** С ритуал — поставяш другите монети около черепа. *(Requires `quest_flags.coins_glimmer = true`; tension -5)*  
> **Б)** Бързо грабваш и се отдръпваш. *(Dexterity 50; при успех бърз изход, иначе капан)*  
> **В)** Позволяваш на духа да я предаде. *(Requires `guardian_trust ≥ 10`; morale +10)*

> **STATE UPDATE**  
> - `inventory.quest_items += "Coin #5 — Dragon Breath"`  
> - `quest_flags.coin_five_collected = true`  
> - Journal: „Монета #5 получена“.

---

## Сцена 50 — "Пробуждане на пещерата"

> **Traceability**: MAIN-QUEST-OUTLINE §400 · SCENARIO-WRITING-PLAN §6.4 · ред #280  
> **Свързани документи**: TRAVEL-SYSTEM.md §Escape routes, GAME-CAPABILITIES.md §Timed escape

След като монетата напусне нишата, пещерата започва да се тресе. Трябва да решиш как да излезеш.

> **[ИЗБОР] Какво правиш?**  
> **А)** Следваш картата от Арета. *(Requires `intel.bridge_paths`; escape +5)*  
> **Б)** Връщаш се по стъпките си. *(time +1h, но безопасно)*  
> **В)** Викаш спътниците и се гмурвате в подземната река. *(Swim 50 → бърз изход, но injury risk)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iii_dragon_escape"`  
> - Unlock side quest „Echo Quartz Delivery“ ако намери `item.echo_quartz`  
> - Настройва сцени 51–55 (завръщане в Забърдо и нови заплахи).

---

## Сцена 51 — "Бягството през тесните тунели"

> **Traceability**: MAIN-QUEST-OUTLINE §401 · SCENARIO-WRITING-PLAN §6.4 · ред #281  
> **Свързани документи**: TRAVEL-SYSTEM.md §Escape modes, GAME-CAPABILITIES.md §Timed skill challenge

Стените се свличат. Въздухът става прашен като брашно. Трябва да избереш посока за бягство.

> **[ИЗБОР] Как водиш излизането?**  
> **А)** Следваш маркировките на Арета. *(Requires `intel.bridge_paths`; escape +10)*  
> **Б)** Използваш самодивската благословия да освети пътя. *(buff.samodiva_aegis → auto-success, но изразходва ефекта)*  
> **В)** Командваш стражите да се подредят и да носят ранените. *(Leadership 55 → morale +5)*

> **FAIL CONSEQUENCE**: ако чек провали → `injury_level +=1`, `time +1h`.

---

## Сцена 52 — "Завръщане в Забърдо"

> **Traceability**: MAIN-QUEST-OUTLINE §402 · SCENARIO-WRITING-PLAN §6.4 · ред #282  
> **Свързани документи**: LOCATIONS.md §Забърдо, SIDE-QUESTS.md §Zabardo aftermath

Селото те посреща с огньове и страх — видели са как небето светна над мостовете.

> **[ИЗБОР] Как ги успокояваш?**  
> **А)** Показваш монетата. *(morale village +10, но intrigue +5)*  
> **Б)** Разказваш за духа на змея и новия пакт. *(Lore 45 → unlock `state.flag.zabardo_pact`)*  
> **В)** Предлагаш помощ за укрепления. *(Logistics 50 → `zabardo_defense +5`)*

> **Companion реакции**: Калина дава билки на селяните (+5 affinity), Шаро става герой за децата.

---

## Сцена 53 — "Вестите за Филипопол"

> **Traceability**: MAIN-QUEST-OUTLINE §403 · SCENARIO-WRITING-PLAN §6.4 · ред #283  
> **Свързани документи**: COMMUNICATION.md §Couriers, POLITICS.md §Philippopolis reactions

Куриер пристига с писмо: Филипопол празнува, но и се тревожи — латинците са видели светлините.

> **[ИЗБОР] Как реагираш?**  
> **А)** Изпращаш подробен доклад. *(reputation court +10, tension +5)*  
> **Б)** Задържаш информацията. *(intrigue +5, но trust -5)*  
> **В)** Предаваш частична версия и молиш за подкрепление. *(Logistics +5, но време +1 ден)*

> **STATE UPDATE**: `state.flag.philippopolis_alert = true` ако изб. А/В.

---

## Сцена 54 — "Празникът на Забърдо"

> **Traceability**: MAIN-QUEST-OUTLINE §404 · SCENARIO-WRITING-PLAN §6.4 · ред #284  
> **Свързани документи**: WORLD-BIBLE.md §Rhodope festivals, COMPANIONS.md §Morale events

Селото решава да празнува оцеляването. Медовина, гайди и кости, превърнати в музикални инструменти.

> **[ИЗБОР] Как участваш?**  
> **А)** Танцуваш с местните. *(morale +10, tension -5)*  
> **Б)** Пееш стара песен за Белинташ. *(Lore +5, unlock `folk_song_belintash`)*  
> **В)** Стоиш настрана и наблюдаваш. *(Insight 45 → `intel.village_whispers`)*

> **Companion реакции**: Калина се радва на танца, Шаро получава венец.

---

## Сцена 55 — "Решение за следващия поход"

> **Traceability**: MAIN-QUEST-OUTLINE §405 · SCENARIO-WRITING-PLAN §6.4 · ред #285  
> **Свързани документи**: MAIN-QUEST-OUTLINE.md §Act IV intro, TRAVEL-SYSTEM.md §Routing

На сутринта трябва да решиш: връщаш ли се във Филипопол или тръгваш директно към Чудните мостове.

> **[ИЗБОР] Какво решаваш?**  
> **А)** Връщане във Филипопол за отчет. *(travel.route = "zabardo_philippopolis"; court alignment +5)*  
> **Б)** Прав курс към мостовете. *(travel.route = "zabardo_wonder_bridges"; quest momentum +5)*  
> **В)** Пращаш куриери напред, а ти оставаш още ден. *(time +1, tension -5, `intel.local_threats`)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iv_preparation"`  
> - Journals обновени с „Чудните мостове – Пролог“  
> - Unlock side quest „Забърдо – Песента на костите“ ако изб. Б или В.

---

## Сцена 56 — "Разклонението на съдбата"

> **Traceability**: MAIN-QUEST-OUTLINE §406 · SCENARIO-WRITING-PLAN §6.4 · ред #286  
> **Свързани документи**: TRAVEL-SYSTEM.md §Branch routes, GAME-CAPABILITIES.md §State branching

Колоната стои пред кръстопът: надолу към Филипопол или нагоре към Чудните мостове. Хората чакат твоя знак.

> **[ИЗБОР] Потвърждаваш ли взетото решение?**  
> **А)** „Назад към града — да докладваме.“ *(Sets `branch.act3_path = "philippopolis_return"`)*  
> **Б)** „Напред към мостовете — времето ни притиска.“ *(Sets `branch.act3_path = "bridges_direct"`)*  
> **В)** „Разделяме се временно.“ *(Requires companion ≥2; `state.flag.split_party = true`)*

> **STATE HOOK**: `journal.branch_note = true` → UI показва два паралелни блока задачи.

---

## Сцена 57 — "Аудиенция при двора" *(активна ако `branch.act3_path = "philippopolis_return"`)* 

> **Traceability**: MAIN-QUEST-OUTLINE §407 · SCENARIO-WRITING-PLAN §6.4 · ред #287  
> **Свързани документи**: LOCATIONS.md §Philippopolis Citadel, POLITICS.md §Court factions

Кралските зали миришат на тамян и олио. Болярите шумолят, а болярин Петър те фиксира.

> **[ИЗБОР] Как представяш монетата?**  
> **А)** Тържествено, с реч. *(Oratory 55 → court morale +10)*  
> **Б)** Насаме със съвета. *(intrigue +5, tension -5)*  
> **В)** През Валентин — магьосникът говори вместо теб. *(Requires `state.flag.valentin_curiosity`; reputation arcane +10)*

> **STATE UPDATE**: `state.flag.court_report = submitted` → отключва сцени 61–65 (Политически обмен) по-късно.

---

## Сцена 58 — "Тишината на съзаклятниците" *(активна ако `branch.act3_path = "philippopolis_return"`)* 

> **Traceability**: MAIN-QUEST-OUTLINE §408 · SCENARIO-WRITING-PLAN §6.4 · ред #288  
> **Свързани документи**: SIDE-QUESTS.md §Philippopolis intrigue, GAME-CAPABILITIES.md §Reputation shifts

След аудиенцията те намира Арета (или друг агент). Филипопол говори за теб — едни те боготворят, други се страхуват.

> **[ИЗБОР] Как управляваш слуховете?**  
> **А)** Използваш ги — тласкаш народа към подкрепа. *(reputation people +10, но bolyars -5)*  
> **Б)** Утихомиряваш — пращаш куриери да коригират разказа. *(Logistics 45 → tension -5)*  
> **В)** Насочваш слуховете към латинците. *(Intrigue 55 → unlock `state.flag.latin_distraction`)*

> **STATE HOOK**: `political_alignment` се измества според избора.

---

## Сцена 59 — "Тайният марш към мостовете" *(активна ако `branch.act3_path = "bridges_direct"`)* 

> **Traceability**: MAIN-QUEST-OUTLINE §409 · SCENARIO-WRITING-PLAN §6.4 · ред #289  
> **Свързани документи**: TRAVEL-SYSTEM.md §Mountain stealth, WORLD-BIBLE.md §Rhodope routes

Пътеката през Борика е пълна с мъгла. Куриерите шепнат кодови думи.

> **[ИЗБОР] Как опазваш тайния марш?**  
> **А)** Нощни преходи. *(stealth +10, но fatigue +5)*  
> **Б)** Двойни постове. *(security +5, travel speed -1)*  
> **В)** Магически светлини като звездни сигнали. *(Spell slot -1, morale +5)*

> **STATE UPDATE**: `travel.route = "secret_bridge_passage"`; ако `state.flag.split_party = true`, companion клонът получава собствена записка.

---

## Сцена 60 — "Караула на Чудните мостове"

> **Traceability**: MAIN-QUEST-OUTLINE §410 · SCENARIO-WRITING-PLAN §6.4 · ред #290  
> **Свързани документи**: LOCATIONS.md §Bridge sentries, GAME-CAPABILITIES.md §Faction negotiation

Независимо кой път избра, нощта завършва под арките. Там те чака караул от родопски пазачи и пратеник от Филипопол.

> **[ИЗБОР] Как балансираш двете страни?**  
> **А)** Даваш монета #5 на пазачите да я видят, но не я оставяш. *(trust mountain +10, intrigue +5)*  
> **Б)** Предаваш писмена клетва на пратеника. *(court trust +10, но mountain trust -5)*  
> **В)** Организираш общ обет край огъня. *(Lore 50 → `state.flag.bridge_alliance = true`)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iv_entry"`  
> - `quest_flags.bridge_alliance` влияе на Act IV escort bonuses  
> - Journal: „Act IV — Чудните мостове (Старт)“.

---

## Сцена 61 — "Съветът на трите фракции" *(ако си във Филипопол)*

> **Traceability**: MAIN-QUEST-OUTLINE §411 · SCENARIO-WRITING-PLAN §6.4 · ред #291  
> **Свързани документи**: POLITICS.md §Council factions, SIDE-QUESTS.md §Philippopolis diplomacy

В залата присъстват болярин Петър, Арета и магът Валентин. Всеки държи перо над свитък.

> **[ИЗБОР] Коя фракция печелиш?**  
> **А)** Болярите — обещаваш им достъп до мостовете. *(politics.bolyars +10, но shadow trust -5)*  
> **Б)** Гилдията — гарантираш неутралитет. *(shadow trust +10, court -5)*  
> **В)** Маговете — споделяш визията от монетите. *(arcane alignment +10, tension -5)*

> **STATE HOOK**: `state.council_balance` записва списък по приоритет.

---

## Сцена 62 — "Писмото към царя"

> **Traceability**: MAIN-QUEST-OUTLINE §412 · SCENARIO-WRITING-PLAN §6.4 · ред #292  
> **Свързани документи**: COMMUNICATION.md §Royal channels, GAME-CAPABILITIES.md §Diplomatic checks

Трябва да изпратиш писмо до цар Иван Асен II. Мастилото мирише на смола.

> **[ИЗБОР] Какъв тон избираш?**  
> **А)** Военен — настояваш за подкрепления. *(reputation military +10)*  
> **Б)** Мистичен — описваш духовните знаци. *(Lore +5, arcane trust +5)*  
> **В)** Практичен — искаш снабдяване. *(Logistics +5, но intrigue +5)*

> **STATE UPDATE**: `state.flag.royal_letter_sent = true`; резултатът влияе на Act IV снабдяването.

---

## Сцена 63 — "Посланието към Забърдо" *(ако си на път/в Забърдо)*

> **Traceability**: MAIN-QUEST-OUTLINE §413 · SCENARIO-WRITING-PLAN §6.4 · ред #293  
> **Свързани документи**: SIDE-QUESTS.md §Zabardo support, TRAVEL-SYSTEM.md §Messenger system

Докато вървите към мостовете, пратеник от Забърдо ти носи легенда: змеят понякога пее нощем.

> **[ИЗБОР] Как отговаряш?**  
> **А)** Пращаш благодарствен дар. *(currency -5, но `zabardo_loyalty +10`)*  
> **Б)** Молиш ги да пазят тайна. *(intrigue +5, tension -5)*  
> **В)** Каниш ги да пратят свои хора към мостовете. *(unlock `ally.zabardo_scouts`)*

> **STATE HOOK**: ако се активира В, Act IV получава опция „Zabardo scouts“.

---

## Сцена 64 — "Последните конфликти в двора"

> **Traceability**: MAIN-QUEST-OUTLINE §414 · SCENARIO-WRITING-PLAN §6.4 · ред #294  
> **Свързани документи**: POLITICS.md §Intrigue, GAME-CAPABILITIES.md §Debate

Болярин Петър и Арета се карат. Пратениците от латинците също дебнат.

> **[ИЗБОР] Как посредничиш?**  
> **А)** Обвиняваш латинците. *(intrigue 55 → tension -5, но латинците стават враг)*  
> **Б)** Примиряваш ги с обещание за споделена слава. *(Leadership 60 → morale +5)*  
> **В)** Оставяш ги да се сблъскат, за да видиш кой печели. *(Insight 45 → `intel.court_hierarchy`)* 

> **STATE UPDATE**: `state.flag.court_conflict_outcome` = bolyar/shadow/balanced.

---

## Сцена 65 — "Отпътуване за Чудните мостове"

> **Traceability**: MAIN-QUEST-OUTLINE §415 · SCENARIO-WRITING-PLAN §6.4 · ред #295  
> **Свързани документи**: TRAVEL-SYSTEM.md §Philippopolis to Bridges, WORLD-BIBLE.md §Rhodope lore

След всички аудиенции и събрани писма, отново тръгваш. Този път с официални печати и придружители.

> **[ИЗБОР] Кого взимаш като ескорт?**  
> **А)** Болярски отряд. *(security +10, но stealth -10)*  
> **Б)** Гилдията на сенките — тайна защита. *(stealth +10, intrigue +5)*  
> **В)** Магичен конвой на Валентин. *(Spell slots +1, но fatigue +5)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iv_entry"`  
> - `travel.route = "philippopolis_to_bridges_official"`  
> - Companion flags обновени според избраната охрана.

---

## Сцена 66 — "Лагерът на мостовете"

> **Traceability**: MAIN-QUEST-OUTLINE §416 · SCENARIO-WRITING-PLAN §6.4 · ред #296  
> **Свързани документи**: WORLD-BIBLE.md §Чудни мостове, TRAVEL-SYSTEM.md §Bridge camp

Преди изгрева стигаш лагера на пазачите. Огньове, сушено месо, знаци по скалата.

> **[ИЗБОР] Как се запознаваш с капитан Боримир?**  
> **А)** С формален поклон и печатите от двора. *(court alignment +5)*  
> **Б)** С разказ за духа на змея. *(Lore +5, mountain trust +5)*  
> **В)** Чрез демонстрация на магия. *(Spell slot -1, awe +10, но tension +5)*

> **STATE HOOK**: `state.flag.bridge_captain_attitude` = formal/lore/magic.

---

## Сцена 67 — "Обетът на арките"

> **Traceability**: MAIN-QUEST-OUTLINE §417 · SCENARIO-WRITING-PLAN §6.4 · ред #297  
> **Свързани документи**: LORE-CARDS.md §Bridge oath, GAME-CAPABILITIES.md §Ceremony

Пазачите настояват за обет: никой да не отсича живо дърво около мостовете.

> **[ИЗБОР] Как полагаш обета?**  
> **А)** Поставяш монетите на каменен олтар. *(Requires ≥5 coins; tension -5)*  
> **Б)** Позволяваш на кап. Боримир да постави знак върху дланта ти. *(morale +5, pain check)*  
> **В)** Пишеш клетва в дневника и я подпечатваш. *(intrigue +5, но mountain trust -5)*

> **STATE UPDATE**: `state.flag.bridge_oath = true` → Act IV penalty ако нарушен.

---

## Сцена 68 — "Преговорите за провизии"

> **Traceability**: MAIN-QUEST-OUTLINE §418 · SCENARIO-WRITING-PLAN §6.4 · ред #298  
> **Свързани документи**: TRAVEL-SYSTEM.md §Supplies, INVENTORY.md §Logistics

Пазачите имат ограничени запаси. Трябва да решите как се разпределя храна и въжета.

> **[ИЗБОР] Какъв подход избираш?**  
> **А)** Плащаш щедро. *(currency -10 сребърни, encumbrance -5)*  
> **Б)** Разчиташ на обмен — даваш информация за латинците. *(intel.share = true, tension -5)*  
> **В)** Отказваш да вземеш повече и оставяш за селяните. *(morale villagers +10, но твоят лагер остава с -5 ресурси)*

> **STATE HOOK**: `inventory.supplies` adjust; при вариант Б `state.flag.bridge_gossip = true`.

---

## Сцена 69 — "Вестта от долината"

> **Traceability**: MAIN-QUEST-OUTLINE §419 · SCENARIO-WRITING-PLAN §6.4 · ред #299  
> **Свързани документи**: SIDE-QUESTS.md §Rhodope rumors, COMMUNICATION.md §Messengers

Пратеник от долината носи тревожна вест: латински отряд е забелязан край старите минни пътеки.

> **[ИЗБОР] Как реагираш?**  
> **А)** Пращаш стражи да ги следят. *(security +5, но escort -2)*  
> **Б)** Използваш гилдията на сенките за контрашпионаж. *(Requires shadow alliance; intrigue +10)*  
> **В)** Игнорираш — фокус върху мостовете. *(quest momentum +5, но tension +5)*

> **STATE UPDATE**: `state.flag.latin_scouts` = tracked/ignored → влияе в Act IV.

---

## Сцена 70 — "Нощта преди Act IV"

> **Traceability**: MAIN-QUEST-OUTLINE §420 · SCENARIO-WRITING-PLAN §6.4 · ред #300  
> **Свързани документи**: CAMPING.md §Mountain rituals, MAGIC-SPELLS.md §Vision rites

Звездите над мостовете са като искри от ковашки огън. Трябва да завършиш Act III с избрано видение.

> **[ИЗБОР] Какво правиш?**  
> **А)** Медитираш с амулета и виждаш проблясък на Караджов камък. *(Lore +5, unlock `vision.karadjov_hint`)*  
> **Б)** Пишеш писмо до близък човек. *(morale +10, tension -5)*  
> **В)** Тренираш companions за утрешния преход. *(Companion affinity +5, fatigue +5)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iv_ready"`  
> - HUD: „Act III завършен – Act IV започва“  
> - Ако изб. А → миникарта показва нова точка „Karadjov ridge“.

---

> **Следва:** Акт IV · Сцени 1–5 "Караджов камък и новите изпитания на Родопите".
