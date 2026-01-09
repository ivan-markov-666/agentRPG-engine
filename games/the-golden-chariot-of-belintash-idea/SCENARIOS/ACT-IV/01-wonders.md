# АКТ IV · СЦЕНИ 71–75 — "ЧУДНИТЕ МОСТОВЕ"

---

## Сцена 71 — "Караджовият процеп"

> **Traceability**: MAIN-QUEST-OUTLINE §421–422 · SCENARIO-WRITING-PLAN §6.5 · ред #301  
> **Свързани документи**: WORLD-BIBLE.md §Караджов камък, TRAVEL-SYSTEM.md §Mountain choke point

Пътеката се свива до процеп — скала до скала, сякаш самата планина те мери.

> **[ИЗБОР] Как преминаваш?**  
> **А)** Сваляш снаряжението и пълзиш. *(Encumbrance -5, morale +5)*  
> **Б)** Използваш въжетата, за да си помогнеш. *(Requires `state.flag.extra_ropes`; Athletics 50)*  
> **В)** Активираш магически щит за защита. *(Spell slot -1, fatigue +5)*

> **STATE HOOKS**  
> - `travel.hazard = "karadjov_choke"`  
> - Ако провал → `injury_level +=1` и `tension +5`.

---

## Сцена 72 — "Скалният олтар"

> **Traceability**: MAIN-QUEST-OUTLINE §423 · SCENARIO-WRITING-PLAN §6.5 · ред #302  
> **Свързани документи**: LORE-CARDS.md §Karadjov altar, MAGIC-SPELLS.md §Stone rites

На върха има плоча с издълбани следи от копита. Тишината е като глътка студена вода.

> **[ИЗБОР] Какво правиш на олтара?**  
> **А)** Оставяш монетите за миг и слушаш ехото. *(Lore 55 → `vision.karadjov_echo`)*  
> **Б)** Рецитираш прочетените в библиотеката думи. *(Requires `state.flag.bridge_oath`; morale +5)*  
> **В)** Правиш практична проверка за капани. *(Investigation 50 → trap info, tension -5)*

> **STATE NOTE**: Успешна Lore проверка дава подсказка за позициите на следващата монета.

---

## Сцена 73 — "Изпитанието на смирението"

> **Traceability**: MAIN-QUEST-OUTLINE §424–425 · SCENARIO-WRITING-PLAN §6.5 · ред #303  
> **Свързани документи**: GAME-CAPABILITIES.md §Psych checks, COMPANIONS.md §Reactions

Тесен тунел изисква да свалиш броня, оръжия, гордост.

> **[ИЗБОР] Как се смиряваш?**  
> **А)** Оставяш амулета за кратко и пълзиш напред. *(Willpower 55 → `tension -10`, но `amulet_state.strain +5`)*  
> **Б)** Пратиш companion да мине пръв. *(Companion affinity -5/+5 според успех)*  
> **В)** Медитираш, докато чакаш реда си. *(Morale +5, но travel time +1h)*

> **STATE UPDATE**: `state.flag.humility_passed = true` ако поне един избор успее.

---

## Сцена 74 — "Отвъдната страна"

> **Traceability**: MAIN-QUEST-OUTLINE §426 · SCENARIO-WRITING-PLAN §6.5 · ред #304  
> **Свързани документи**: WORLD-BIBLE.md §Rhodope vistas, MAPS.md §Panorama

След процепа те чака гледка към цялата Родопа, небето като разстлан син плат.

> **[ИЗБОР] Как използваш вдъхновението?**  
> **А)** Чертаеш карта. *(Lore +5, unlock `intel.panorama_paths`)*  
> **Б)** Надъхваш групата. *(Leadership 50 → morale +10)*  
> **В)** Мълчиш и разговаряш с вятъра. *(Insight 45 → `vision.whisper`)*

> **Companion реакции**: Калина пее, Шаро се опитва да хване облаците.

---

## Сцена 75 — "Шестата монета"

> **Traceability**: MAIN-QUEST-OUTLINE §427–428 · SCENARIO-WRITING-PLAN §6.5 · ред #305  
> **Свързани документи**: LORE-CARDS.md §Coin six, INVENTORY.md §Quest items

В малка ниша на върха блести монета, пазена от магически вихър.

> **[ИЗБОР] Как я придобиваш?**  
> **А)** Използваш новата магия (огън или вода). *(Requires `spell.fire_breath` или `spell.water_shield`; auto-success)*  
> **Б)** Комбинираш въжетата и смелостта. *(Athletics 55, при успех +moneta)*  
> **В)** Призоваваш духа на Караджовия войвода чрез песента на забърденци. *(Requires `folk_song_belintash`; Lore 60)*

> **STATE UPDATE**  
> - `inventory.quest_items += "Coin #6 — Wind Crest"`  
> - `quest_flags.coin_six_collected = true`  
> - Journal: „Act IV — Монета #6“.

---

## Сцена 76 — "Магическият капан"

> **Traceability**: MAIN-QUEST-OUTLINE §428–429 · SCENARIO-WRITING-PLAN §6.5 · ред #306  
> **Свързани документи**: MAGIC-SPELLS.md §Counter wards, GAME-CAPABILITIES.md §Trap dispel

Скоро след монетата коридорът се изпълва с синкава мъгла. Каменни плочи се въртят — магически капан.

> **[ИЗБОР] Как го неутрализираш?**  
> **А)** Използваш огненото заклинание да прегори руните. *(Requires `spell.fire_breath`; fatigue +5)*  
> **Б)** Призоваваш водния щит да охлади механизмите. *(Requires `spell.water_shield`; morale +5)*  
> **В)** Оставяш companion да активира древния ключ. *(Companion skill check 55; при успех `companion_confidence +5`)*  

> **FAIL CONSEQUENCE**: `injury_level +=1`, `inventory.supplies -5`.

---

## Сцена 77 — "Пътят към Кръстова гора"

> **Traceability**: MAIN-QUEST-OUTLINE §430 · SCENARIO-WRITING-PLAN §6.5 · ред #307  
> **Свързани документи**: TRAVEL-SYSTEM.md §Bridge_to_cross_route, WORLD-BIBLE.md §Кръстова гора

Пътеката се спуска в сенчеста долина, където кръстове от бук и явор бележат всеки завой.

> **[ИЗБОР] Как поддържаш духа на групата?**  
> **А)** Разказваш историята на Караджовия войвода. *(Lore +5, morale +5)*  
> **Б)** Организираш редовни молитви/мантри. *(Willpower 45 → tension -5)*  
> **В)** Пращаш забърденските скаути да проверят напред. *(Requires `ally.zabardo_scouts`; travel speed +1)*

> **STATE HOOK**: `travel.route = "wonders_to_crossforest"`; ако option B → `state.flag.crossforest_devotion = true`.

---

## Сцена 78 — "Срещата с отшелника"

> **Traceability**: MAIN-QUEST-OUTLINE §432–434 · SCENARIO-WRITING-PLAN §6.5 · ред #308  
> **Свързани документи**: CHARACTERS.md §Отшелникът, LORE-CARDS.md §Cross Forest hermit

Отшелникът живее в кух дъб, лицето му е като кора. Говори бавно, сякаш всяка дума е дар.

> **[ИЗБОР] Как печелиш доверието му?**  
> **А)** Споделяш виденията от монетите. *(Lore 55 → `state.flag.hermit_trust = true`)*  
> **Б)** Предлагаш му помощ и провизии. *(inventory -3 supplies, но `compassion +5`)*  
> **В)** Оставяш companion да говори. *(Companion diplomacy 50 → unlock уникален диалог)*

> **STATE UPDATE**: ако доверие ≥ true → той споменава, че седмата монета пази „дъхът на сабазийския кръст“.

---

## Сцена 79 — "Разказът за Братството"

> **Traceability**: MAIN-QUEST-OUTLINE §435–437 · SCENARIO-WRITING-PLAN §6.5 · ред #309  
> **Свързани документи**: WORLD-BIBLE.md §Brotherhood lore, LORE-CARDS.md §Sabbazius order

Отшелникът разкрива истината: бил е част от Братството, но напуснал след спор за колесницата.

> **[ИЗБОР] Какво питаш първо?**  
> **А)** Къде е седмата монета. *(Quest info +10, tension +5)*  
> **Б)** Какво иска Братството в наши дни. *(Lore +5, unlock `intel.brotherhood_agenda`)*  
> **В)** Какво е предупреждението за колесницата. *(Gain `vision.warning`)*  

> **STATE HOOK**: изборите добавят записи към `journal.brotherhood`; при А се активира нова задача „Песента на кръста“.

---

## Сцена 80 — "Предупреждението"

> **Traceability**: MAIN-QUEST-OUTLINE §438–440 · SCENARIO-WRITING-PLAN §6.5 · ред #310  
> **Свързани документи**: MAIN-QUEST-OUTLINE.md §Warnings, GAME-CAPABILITIES.md §Foreshadow

Преди да си тръгнеш, отшелникът те спира: „Когато видиш колесницата, не докосвай метал с голи ръце.“

> **[ИЗБОР] Как реагираш?**  
> **А)** Приемаш предупреждението без условия. *(tension -5, `state.flag.warning_heeded = true`)*  
> **Б)** Питаш за цена или услуга. *(Intrigue 45 → unlock `quest_debt.hermit`)*  
> **В)** Скептично оспорваш. *(Willpower 50 → ако провал, `morale -5`; ако успех, hermit уважение +5)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iv_crossroads"`  
> - `quest_flags.seventh_coin_hint = true`  
> - Journal: „Act IV — Кръстова гора (подготовка)“.

---

> **Следва:** Акт IV · Сцени 81–85 "Пътят към Кръстова гора и седмата монета".

## Сцена 81 — "Кръстовата поляна"

> **Traceability**: MAIN-QUEST-OUTLINE §441 · SCENARIO-WRITING-PLAN §6.5 · ред #311  
> **Свързани документи**: WORLD-BIBLE.md §Кръстова поляна, TRAVEL-SYSTEM.md §Crossforest nodes

Поляна от 12 дървени кръста посреща каравана от поклонници. Вятърът разнася мирис на смола и восък.

> **[ИЗБОР] Как се вписваш сред поклонниците?**  
> **А)** Ставаш редом и се молиш. *(morale +5, `state.flag.crossforest_devotion = true`)*  
> **Б)** Помагаш на ранените. *(inventory -2 herbal kits → `compassion +5`)*  
> **В)** Следиш отдалеч. *(Insight 45 → `intel.crossforest_layout`)*

> **STATE HOOK**: избор А отключва специална опция в сцена 83.

## Сцена 82 — "Четирите кръста"

> **Traceability**: MAIN-QUEST-OUTLINE §442 · SCENARIO-WRITING-PLAN §6.5 · ред #312  
> **Свързани документи**: GAME-CAPABILITIES.md §Multi-test challenge, COMPANIONS.md §Morale shifts

Отшелникът те води до четири каменни кръста, всеки с символ — огън, вода, въздух, земя.

> **[ИЗБОР] Кой кръст целуваш първо?**  
> **А)** Огъня. *(Requires `spell.fire_breath`; morale +10)*  
> **Б)** Водата. *(Requires `spell.water_shield`; tension -5)*  
> **В)** Земята. *(Endurance 50 → `buff.steadfast`)*  
> **Г)** Въздуха. *(Lore 50 → `vision.chants`)*  

> **STATE UPDATE**: избр. символ определя бонуси за сцените 83–85.

## Сцена 83 — "Нощното бдение"

> **Traceability**: MAIN-QUEST-OUTLINE §443 · SCENARIO-WRITING-PLAN §6.5 · ред #313  
> **Свързани документи**: CAMPING.md §Vigil rules, MAGIC-SPELLS.md §Dream visions

Отшелникът изисква нощно бдение: без сън, само песен и шепот.

> **[ИЗБОР] Как издържаш?**  
> **А)** Разчиташ на devotions от сцена 81. *(auto-success, morale +5)*  
> **Б)** Пишеш в дневника всеки час. *(Lore +5, но fatigue +5)*  
> **В)** Разменяш смени с companion. *(Requires companion; affinity +5, но tension +5)*

> **FAIL**: `state.flag.crossforest_devotion = false`, `vision.karadjov_hint` изчезва.

## Сцена 84 — "Седмата монета"

> **Traceability**: MAIN-QUEST-OUTLINE §444–446 · SCENARIO-WRITING-PLAN §6.5 · ред #314  
> **Свързани документи**: LORE-CARDS.md §Coin seven, INVENTORY.md §Quest items

Отшелникът отваря дървена кутия. Монетата е изтъкана от злато и кости.

> **[ИЗБОР] Как я приемаш?**  
> **А)** На колене, с клетва. *(tension -5, `state.flag.warning_heeded = true`)*  
> **Б)** С обет за мълчание. *(intrigue +5, но morale -5)*  
> **В)** Оставяш companion да я вземе. *(Companion affinity +10, но `companion_burden +5`)*

> **STATE UPDATE**  
> - `inventory.quest_items += "Coin #7 — Crossheart"`  
> - `quest_flags.coin_seven_collected = true`  
> - Journal: „Act IV — Монета #7“.

## Сцена 85 — "Последният път към Белинташ"

> **Traceability**: MAIN-QUEST-OUTLINE §447–448 · SCENARIO-WRITING-PLAN §6.5 · ред #315  
> **Свързани документи**: TRAVEL-SYSTEM.md §Crossforest_to_belintash, WORLD-BIBLE.md §Belintash approach

След монетата отшелникът посочва източния ръб: „Последната пътека е видима само на изгрев“.

> **[ИЗБОР] Как се подготвяш за финалния поход?**  
> **А)** Пускаш нови куриери към Филипопол. *(Logistics +5, но time +1 ден)*  
> **Б)** Оставяш ненужен товар при отшелника. *(Encumbrance -5, но `quest_debt.hermit = true`)*  
> **В)** Провеждаш тайно обучение с companion. *(Companion skill +10, fatigue +5)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_iv_final_ascent"`  
> - `travel.route = "crossforest_to_belintash"`  
> - Journals отбелязват „Act V предстои“.

---

## Сцена 86 — "Изкачването към Кръстовата гора"

> **Traceability**: MAIN-QUEST-OUTLINE §448 · SCENARIO-WRITING-PLAN §6.5 · ред #316  
> **Свързани документи**: TRAVEL-SYSTEM.md §Crossforest ascent, WORLD-BIBLE.md §Crossforest lore

Пътеката се издига над облаците. Клоните се преплитат, образувайки кръстове по небето.

> **[ИЗБОР] Как организираш изкачването?**  
> **А)** Маршируваш със стегнат ритъм. *(Leadership 55 → morale +5)*  
> **Б)** Спираш за молитви на всеки кръст. *(Willpower 50 → tension -5, но time +1h)*  
> **В)** Използваш гилдията на сенките за разузнаване. *(Requires shadow alliance; travel speed +1, intrigue +5)*

> **STATE HOOK**: `travel.route = "crossforest_spiral"`; избор Б наслоява `state.flag.crossforest_devotion = true`.

---

## Сцена 87 — "Обредът на поклонниците"

> **Traceability**: MAIN-QUEST-OUTLINE §449 · SCENARIO-WRITING-PLAN §6.5 · ред #317  
> **Свързани документи**: LORE-CARDS.md §Crossforest ritual, COMPANIONS.md §Morale events

Поклонниците обикалят поляната три пъти. Ти трябва да решиш дали да се включиш или да наблюдаваш.

> **[ИЗБОР] Участваш ли в обреда?**  
> **А)** Да, с пълно смирение. *(morale +10, `state.flag.pilgrim_respect = true`)*  
> **Б)** Да, но водиш групата с песен. *(Requires `folk_song_belintash`; group morale +10)*  
> **В)** Не, стоиш настрана и анализираш. *(Insight 50 → `intel.ritual_paths`)*  

> **FAIL** (ако се подиграеш) → `state.flag.pilgrim_respect = false`, tension +10.

---

## Сцена 88 — "Гласът на отшелника"

> **Traceability**: MAIN-QUEST-OUTLINE §450–451 · SCENARIO-WRITING-PLAN §6.5 · ред #318  
> **Свързани документи**: CHARACTERS.md §Hermit, LORE-CARDS.md §Brotherhood warning

Отшелникът посочва смълчани дървета и казва: „Оттук нататък само истината върви с теб“.

> **[ИЗБОР] Как реагираш?**  
> **А)** Споделяш най-големия си страх. *(tension -10, `vision.confession`)*  
> **Б)** Питаш за тайните пътеки. *(Lore 55 → `intel.crossforest_secret`)*  
> **В)** Молиш го за благословия за companions. *(Companion affinity +10, но `quest_debt.hermit = true`)*

> **STATE UPDATE**: избор А дава бонус срещу бъдещи страх trials.

---

## Сцена 89 — "Последните указания"

> **Traceability**: MAIN-QUEST-OUTLINE §452–453 · SCENARIO-WRITING-PLAN §6.5 · ред #319  
> **Свързани документи**: MAIN-QUEST-OUTLINE.md §Final instructions, GAME-CAPABILITIES.md §Preparation

Отшелникът рисува схема на земята — седем линии за седемте монети.

> **[ИЗБОР] Какво искаш да знаеш?**  
> **А)** Къде да поставиш монетите. *(Quest info +10, tension -5)*  
> **Б)** Как да разпознаеш Братството. *(Lore +5, unlock `intel.brotherhood_signs`)*  
> **В)** Какво се случва, ако се провалиш. *(Vision warning → morale -5, но foreshadow unlocked)*

> **STATE HOOK**: `journal.final_map = true`.

---

## Сцена 90 — "Кръстосаните кръстове"

> **Traceability**: MAIN-QUEST-OUTLINE §454–455 · SCENARIO-WRITING-PLAN §6.5 · ред #320  
> **Свързани документи**: WORLD-BIBLE.md §Crossforest final gate, TRAVEL-SYSTEM.md §Belintash entry

Пътеката завършва на място, където три кръста се преплитат. Нощта е тиха, светулки очертават символи.

> **[ИЗБОР] Как завършваш Act IV?**  
> **А)** Полагаш монетите в кръг и мълчиш. *(morale +10, `state.main_quest.current = "act_v_threshold"`)*  
> **Б)** Събираш companion-ите около огъня за последни инструкции. *(Companion affinity +10)*  
> **В)** Изпращаш тайно послание до Филипопол. *(intrigue +10, но tension +5)*

> **STATE UPDATE**  
> - `travel.route = "crossforest_to_belintash_night"`  
> - `quest_flags.act_v_ready = true`  
> - Journal: „Act V — Белинташ (готов)“.

---

## Сцена 91 — "Последният път към Белинташ"

> **Traceability**: MAIN-QUEST-OUTLINE §456–457 · SCENARIO-WRITING-PLAN §6.5 · ред #321  
> **Свързани документи**: TRAVEL-SYSTEM.md §Belintash ascent, WORLD-BIBLE.md §Belintash plateau

Пътеката се изкачва по голи скали. Звездите изглеждат близо като искри от наковалня.

> **[ИЗБОР] Как водиш групата?**  
> **А)** Строг клин, ти отпред. *(Leadership 55 → morale +5)*  
> **Б)** Мълчаливо, само със знаци. *(Stealth +10, intrigue +5)*  
> **В)** Носиш огнен фенер, за да вдъхновиш. *(Requires `spell.fire_breath` или факел; morale +10, но tension +5)*

> **STATE HOOK**: `travel.route = "belintash_final_path"`.

---

## Сцена 92 — "Платото Белинташ"

> **Traceability**: MAIN-QUEST-OUTLINE §458–459 · SCENARIO-WRITING-PLAN §6.5 · ред #322  
> **Свързани документи**: WORLD-BIBLE.md §Belintash description, MAPS.md §Plateau

Белинташ се разкрива — улеи, щерни, дупки като космическа писменост. Вятърът свири през тях.

> **[ИЗБОР] Как маркираш пристигането?**  
> **А)** Запалваш малко жертвено огънче. *(Lore +5, `state.flag.belintash_respect = true`)*  
> **Б)** Поставяш стражи по периметъра. *(security +10, но morale -5)*  
> **В)** Оставяш офицер да изготви карта. *(intel.belintash_map = true, travel speed +1 по-късно)*

> **STATE UPDATE**: избор А намаля DC за сцените 93–95.

---

## Сцена 93 — "Срещата с Братството"

> **Traceability**: MAIN-QUEST-OUTLINE §460–461 · SCENARIO-WRITING-PLAN §6.5 · ред #323  
> **Свързани документи**: LORE-CARDS.md §Brotherhood, COMPANIONS.md §Reactions

Седем фигури в черни роби се появяват от мъглата, бавни като сенки.

> **[ИЗБОР] Как се представяш?**  
> **А)** Слагаш монетите в ред и се покланяш. *(Quest respect +10)*  
> **Б)** Говориш за духа на змея. *(Lore 55 → `guardian_trust +5`)*  
> **В)** Позоваваш се на отшелника. *(Requires `state.flag.hermit_trust`; tension -5)*

> **STATE HOOK**: `state.flag.brotherhood_mood` = humble/lore/hermit.

---

## Сцена 94 — "Финалното изпитание"

> **Traceability**: MAIN-QUEST-OUTLINE §462–463 · SCENARIO-WRITING-PLAN §6.5 · ред #324  
> **Свързани документи**: GAME-CAPABILITIES.md §Dialogue trials, LORE-CARDS.md §Brotherhood questions

Всеки монах задава въпрос — седем теми: смелост, смирение, истина, жертва, памет, вяра, милост.

> **[ИЗБОР] Как отговаряш?**  
> **А)** Честно за всичко. *(Willpower 60 → `state.flag.truthful = true`, morale +10)*  
> **Б)** Стратегически, пазейки тайни. *(Intrigue 55 → бронираш се, но tension +5)*  
> **В)** Позволяваш на companion да отговори на един от въпросите. *(Companion affinity +10, но risk провал)*

> **STATE UPDATE**: успех → `quest_flags.brotherhood_trial = passed`; провал → `state.tension += 10`.

---

## Сцена 95 — "Приемането"

> **Traceability**: MAIN-QUEST-OUTLINE §464–465 · SCENARIO-WRITING-PLAN §6.5 · ред #325  
> **Свързани документи**: WORLD-BIBLE.md §Brotherhood ceremony, INVENTORY.md §Quest items

Главният монах сваля качулката си — обикновен човек, забравено лице от миналото.

> **[ИЗБОР] Как завършваш церемонията?**  
> **А)** Приемаш целувката на кръста и обещанието. *(morale +15, `state.flag.brotherhood_member = true`)*  
> **Б)** Обявяваш, че ще запазиш тайните, но оставаш независим. *(intrigue +10, tension -5)*  
> **В)** Предлагаш монетите да останат тук. *(Quest twist → unlock `state.flag.coins_guarded`)*

> **STATE UPDATE**  
> - `state.main_quest.current = "act_v_threshold"`  
> - `quest_flags.brotherhood_acceptance = true`  
> - Journal: „Act V — Прагът“.

---

## Сцена 96 — "Подреждането на монетите"

> **Traceability**: MAIN-QUEST-OUTLINE §466 · SCENARIO-WRITING-PLAN §6.5 · ред #326  
> **Свързани документи**: LORE-CARDS.md §Seven coins ritual, INVENTORY.md §Quest items

Платото се превръща в олтар. Всеки монах посочва мястото на своята монета.

> **[ИЗБОР] Как подреждаш монетите?**  
> **А)** Следваш картата на отшелника. *(auto-success, tension -5)*  
> **Б)** Разчиташ на интуиция. *(Insight 55 → ако успех morale +5, иначе +tension)*  
> **В)** Позволяваш на companion да помогне. *(Companion affinity +10, но риск от грешка — injury)*  

> **STATE UPDATE**: `state.flag.monetary_alignment = true` при успех.

---

## Сцена 97 — "Ритуалът на седемте въпроса"

> **Traceability**: MAIN-QUEST-OUTLINE §467 · SCENARIO-WRITING-PLAN §6.5 · ред #327  
> **Свързани документи**: GAME-CAPABILITIES.md §Dialogue trial, LORE-CARDS.md §Brotherhood vows

Монах ви задава по един въпрос, всеки завършва с „Защо?“.

> **[ИЗБОР] Коя тема поставяш напред?**  
> **А)** Смелостта. *(Willpower 60 → morale +10)*  
> **Б)** Смирението. *(Requires `state.flag.humility_passed`; tension -5)*  
> **В)** Истината. *(Set `state.flag.truthful = true`; unlock Act V boon)*

> **FAIL**: ако лъжеш → `state.tension +=10` и `quest_flags.brotherhood_trial = shaky`.

---

## Сцена 98 — "Отварянето на плочата"

> **Traceability**: MAIN-QUEST-OUTLINE §468 · SCENARIO-WRITING-PLAN §6.5 · ред #328  
> **Свързани документи**: WORLD-BIBLE.md §Belintash mechanism, MAGIC-SPELLS.md §Stone resonance

След въпросите монахът удря плоча; земята вибрира.

> **[ИЗБОР] Как подпомагаш отварянето?**  
> **А)** Синхронизираш амулета със монетите. *(Amulet strain +5, но gate speed +10)*  
> **Б)** Викаш духовете на змея и мостовете. *(Requires `vision.karadjov_hint`; lore +5)*  
> **В)** Държиш companion-ите фокусирани. *(Leadership 55 → companion fatigue -5)*

> **STATE HOOK**: `state.flag.gate_ready = true`.

---

## Сцена 99 — "Сбогуването с companion-ите"

> **Traceability**: MAIN-QUEST-OUTLINE §469 · SCENARIO-WRITING-PLAN §6.5 · ред #329  
> **Свързани документи**: COMPANIONS.md §Arcs, LORE-CARDS.md §Farewell rites

Братството настоява да слезеш сам. Companion-ите стоят край огъня.

> **[ИЗБОР] Как се сбогуваш?**  
> **А)** Обещаваш да се върнеш. *(morale +10, но tension +5)*  
> **Б)** Даваш им задачи (да пазят селата, мостовете). *(Logistics +10, companion morale -5)*  
> **В)** Оставяш им по една монета за миг, да усетят силата. *(risk theft, но affinity +10)*

> **STATE UPDATE**: `state.flag.companion_status` записва последното послание.

---

## Сцена 100 — "Влизането в тунела"

> **Traceability**: MAIN-QUEST-OUTLINE §470 · SCENARIO-WRITING-PLAN §6.5 · ред #330  
> **Свързани документи**: TRAVEL-SYSTEM.md §Belintash tunnel entry, WORLD-BIBLE.md §Belintash lore

Плочата се открехва. Стъпваш в тъмнина, осветена само от амулета и новите монети.

> **[ИЗБОР] Как се подготвяш за Act V?**  
> **А)** Пишеш последно писмо и го оставяш при отворената плоча. *(Lore +5, tension -5)*  
> **Б)** Настройваш амулета към „светлинен режим“. *(Amulet strain +5, но светлина +10)*  
> **В)** Медитираш и приемаш възможната смърт. *(Willpower 60 → morale +10, `state.flag.accepts_end = true`)*  

> **STATE UPDATE**  
> - `state.main_quest.current = "act_v_entry"`  
> - `travel.route = "belintash_tunnel"`  
> - Journal: „Act V — Тунелът започва“.

---

> **Следва:** Акт IV · Сцени 101–105 (Act V, първи стъпки под Белинташ – отделен файл).
