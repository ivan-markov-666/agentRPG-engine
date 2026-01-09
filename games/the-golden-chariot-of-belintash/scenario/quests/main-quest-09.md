# Караджовият процеп — Act IV / Main Quest

## Metadata
| Параметър | Стойност |
|-----------|----------|
| **Тип** | Main Quest |
| **Акт** | IV — „Пътят през Караджов камък“ |
| **Локации** | [[wonders-bridges]], [[wonders-bridges-cave]], [[zabyrdo]], [[karadjov-pass]], [[cross-forest]], [[cross-forest-vigil]], [[cross-forest-hermit-oak]] |
| **Предпоставки** | Завършен [[main-quest-08]], `quest_flags.coin_five_trial_ready = true` |
| **Точки** | 30 (Act IV сцени 71–85) |

## Summary
Колоната напуска Чудните мостове и навлиза в Караджовия процеп — тесен choke point, скален олтар, тунел на смирението и панорама към Кръстова гора. Тук героят трябва да спечели шестата монета, да се пречисти и да се подготви за срещата с отшелника и поклонниците на Кръстовата поляна.

## Story Beats
1. **Караджовият процеп:** избор между пълзене, въжета или магия за преминаване без нараняване.  
2. **Скалният олтар:** ритуал, който подсказва следващите стъпки и настройва визиите.  
3. **Изпитанието на смирението:** тунел, където герой или companion сваля броня/его.  
4. **Панорамата на Родопите:** вдъхновява карта, реч или визия.  
5. **Шестата монета:** магически вихър и избор на метод за придобиване.  
6. **Магическият капан:** завихрена мъгла и въртящи се плочи след монетата.  
7. **Пътят към Кръстова гора:** управление на колоната и morale checks.  
8. **Срещата с отшелника:** доверие, разкрития за Братството, предупреждението за колесницата.  
9. **Четирите кръста и бдението:** избор на стихия, издържане на нощното бдение.  
10. **Седмата монета:** получаване на Crossheart и подготовка за финалния поход.

## Steps
1. **Навигирай Караджовия процеп в [[karadjov-pass]]** — избери метод и управлявай tension/injuries.  
2. **Активирай скалния олтар** — слушай ехото, рецитирай клетвата или проверявай капани за подсказки.  
3. **Премини тунела на смирението** — избери дали ти или companion ще покажете смирение.  
4. **Използвай панорамата** — карта, реч или визия, за да подготвиш групата.  
5. **Вземи шестата монета** — използвай магия, въжета или песента на забърденци.  
6. **Обезвреди магическия капан** — огън, вода или companion ключ.  
7. **Поведи колоната през [[zabyrdo]] към [[cross-forest]]** — поддържай духа чрез истории, молитви или разузнаване и събери дарения за бдението.  
8. **Спечели доверието на отшелника в [[cross-forest-hermit-oak]]** — сподели видения, донеси провизии или използвай companion дипломация.  
9. **Участвай в четирите кръста и бдението в [[cross-forest-vigil]]** — избери стихия, издържи нощното бдение и запази devotions.  
10. **Приеми предупреждението и получи седмата монета** — подсигури hint за Act V и вземи Crossheart от отшелника.

## Rewards
- XP: 980 XP (travel + духовни изпитания + две монети).  
- Gold: 150 сребърни (дарове от Забърдо + благодарности на поклонници).  
- Loot: `item.quest.coin_six`, `item.quest.coin_seven`, `item.map.karadjov_paths`, `item.charm.crossforest_devotion`.  
- Social: `reputation.zabardo +5`, `reputation.pilgrims +10`, `reputation.hermit +8`.  
- State: `quest_flags.coin_six_collected = true`, `quest_flags.coin_seven_collected = true`, `state.flag.humility_passed = true/false`, `quest_flags.seventh_coin_hint = true`, `state.routes.unlock += ["wonders_to_crossforest"]`.

## Hooks
- Unlocks side quests: „Песента на Караджовия войвода“, „Дългът към отшелника“, „Бдението на дванадесетте“.  
- Companion-specific: Калина може да води ритуала при олтара; Шаро помага в смирението/тунела; друг companion може да понесе монетите.  
- Journal entries: „Караджовият процеп“, „Скалният олтар“, „Шестата монета“, „Четирите кръста“, „Нощното бдение“, „Седмата монета“, „Предупреждението на отшелника“.

## Encounters
- **Karadjov choke** — Athletics/Spell check 50, failure → injury.  
- **Altar rite** — Lore 55 или Investigation 50.  
- **Humility tunnel** — Willpower 55 или Companion check.  
- **Wind panorama** — Leadership/Insight 45 за morale бонуси.  
- **Coin vortex** — Spell/Athletics 55, избор на стихия или песни.  
- **Magic trap** — Spell/Engineering 50; провал → injury.  
- **Hermit trust** — Lore/Social 55.  
- **Four crosses** — Element-specific tests (Fire/Water/Earth/Air 45–55).  
- **Pilgrim vigil** — Willpower 45, fatigue ако провал.  
- **Coin seven acceptance** — Lore/Intrigue 55 или Companion diplomacy за избор на обет.

## Notes
- Отразявай натрупаните флагове: `state.flag.shadow_pact`, `buff.samodiva_aegis`, `quest_flags.coin_four/five`.  
- Успехът в тунела и олтара намалява бъдещите DC в Кръстова гора.  
- Отшелникът задава предупреждението за колесницата; запиши `state.flag.warning_heeded`.  
- При провал в магическия капан отбележи загубените провизии и injuries.

- `[[wonders-bridges-cave]]` се посещава повторно за финалните напътствия на духа на змея.  
- `[[zabyrdo]]` предоставя провизии и песни за процепа; ако не се отбиете, morale намалява.

## Conditions
- Изисква активни `quest_flags.coin_four_collected`, `quest_flags.coin_five_location = "wondrous_bridges"` и `state.routes.unlock` да съдържа `philippopolis_to_wonders`.  
- Препоръчва се companion с провизии (`inventory.supplies >= 5`) за пътуването към Караджовия процеп.  
- Ако `reputation.pilgrims < 0`, достъпът до бдението е затруднен (допълнителен Social check 55).

## Outcome
- Героят притежава шестата и седмата монета и е приел предупреждението за колесницата.  
- `state.main_quest.current = "act_iv_final_ascent"` и `state.main_quest.next = "act_v_threshold"`.  
- `quest_flags.seventh_coin_hint = true`, `quest_flags.coin_seven_collected = true`, `state.flag.humility_passed = true/false`, `state.flag.warning_heeded = true/false`.  
- Companion отношения: +5 към участниците в тунела/бдението, -5 ако ги игнорираш.

## Outcome Hooks
- [[cross-forest]] — devotions отключват достъп до тайния маршрут `crossforest_to_belintash`.  
- [[cross-forest-hermit-oak]] — предупреждението за колесницата активира side quest „Песента на кръста“.  
- [[wonders-bridges]] — старите пътеки се затварят; без монетите няма връщане назад (Act V setup).  
- [[zabyrdo]] — селото очаква сигнали след финалния поход и може да осигури подкрепления в Act V.

## Fail State
- Ако героят се провали в Караджовия процеп (injury_level ≥3), колоната трябва да се върне към [[zabyrdo]] и quest остава блокиран до лечение (retry cost 1 ден).  
- Провал в бдението (`state.flag.crossforest_devotion = false`) → `quest_flags.coin_seven_collected = false`, Companion morale -10 и необходимо допълнително бдение (repeat scene).  
- Ако отшелникът не се убеди (`state.flag.hermit_trust = false`), предупреждението не се получава и Act V започва с tension +10 и липса на `quest_flags.seventh_coin_hint`.
## Aftermath
- Обнови journal с „Монета #6 — Ветровият герб“, „Четирите кръста“, „Нощното бдение“ и „Монета #7 — Crossheart“.  
- Добави exploration entries за процепа, олтара, тунела, панорамата, монета #6, капана, четирите кръста, бдението и предупреждението на отшелника.  
- Player state: `current_area_id = "cross-forest-vigil"` → готовност за `crossforest_to_belintash`; активен main-quest-09 до финалната инструкция.  
- Unlock `travel.route = "wonders_to_crossforest"` и `travel.route = "crossforest_to_belintash"` (след бдението).
