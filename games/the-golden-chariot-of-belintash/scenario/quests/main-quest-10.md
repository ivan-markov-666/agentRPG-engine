# Белинташ — Act V / Main Quest

## Metadata
| Параметър | Стойност |
|-----------|----------|
| **Тип** | Main Quest |
| **Акт** | V — „Тунелът под Белинташ“ |
| **Локации** | [[belintash-tunnel]], [[belintash-sanctum]], [[belintash-collapse]], [[cross-forest]], [[cross-forest-vigil]] |
| **Предпоставки** | Завършен [[main-quest-09]], `quest_flags.coin_seven_collected = true`, `travel.route = "crossforest_to_belintash"` |
| **Точки** | 20 (Act V сцени 101–120) |

## Summary
Героят и колоната се спускат в тунела под Белинташ, преминават през живите стени, клетви и изкушенията на древните камери, за да достигнат до светилището на колесницата. Там амулетът задава последния морален избор: да се запечата силата или да се използва. Независимо от решението, ритуалът задейства срутване и героят трябва да избере дали да излезе жив, да остане като пазител или да предаде дневника и монетите на бъдещите поколения.

## Story Beats
1. **Влизането в тунела:** живи стени, избор как да се ориентираш.  
2. **Стражите и клетвата:** релефи, прах, олтарът изпитва морала.  
3. **Камерите на изкушението:** оръжия, съкровища, тест на алчността.  
4. **Подземното езеро и духовете:** физически и духовни проверки преди вратата със седем отвора.  
5. **Камерата на колесницата:** среща с гласа на амулета и голямото решение.  
6. **Ритуалът на запечатването:** поставяне на монетите, участие на companions.  
7. **Срутването:** таймер, избор на маршрут, писмо, жертви.  
8. **Финалната визия и съдбата:** последен поглед към колесницата и решение как завършва Act V.

## Steps
1. **Влез в [[belintash-tunnel]] и премини живите стени** — избери ориентация (амулет, карти, светулки).  
2. **Отговори на стражите на стените** — Lore/Willpower checks, избегни `fear_mark`.  
3. **Поднови или откажи клетвата на олтара** — вземи Sacred Ash или отказ, отбележи state ефекти.  
4. **Премини през камери на оръжията и съкровищата** — управлявай изкушението, реши дали взимаш реликви.  
5. **Издържи теста на алчността и подземното езеро** — избери метод за плуване/сал/магия и успокой духовете.  
6. **Постави седемте монети във вратата и влез в [[belintash-sanctum]]** — подготви companions и journal.  
7. **Срещни гласа на амулета и вземи решението в камерата на колесницата** — избери „Запази“, „Използвай“ или „Документирай“.  
8. **Изпълни ритуала на запечатването** — следвай схемата или импровизирай с companions; управлявай `seal_complete`.  
9. **Навигирай [[belintash-collapse]]** — избери маршрут, остави писмо, направи жертва, защити дневника.  
10. **Определи съдбата си** — излез жив, остани пазител или остави артефактите за епилога; актуализирай `state.main_quest`.

## Rewards
- XP: 1000 XP (финален dungeon + морално решение + успешен ритуал).  
- Gold: 120 (дарове от поклонниците и благодарности от Филипопол, изплатени след като се потвърди запечатването).  
- Loot: `item.journal.final_letter`, `item.relic_token` (ако се изкушиш), `item.chariot_blueprint` (при избор В), `item.quest.coin_set` (консолидирани монети).  
- State: `state.flag.seal_complete = true/false`, `state.flag.chariot_respect`, `state.flag.chariot_curse`, `state.flag.hero_sacrifice`, `journal.hidden_letter`, `state.flag.final_vision`.  
- Social: `reputation.pilgrims +10` ако запазиш тайната; `reputation.court +10` ако избереш царската мисия; companions получават индивидуални buff/debuff според участието си.

## Hooks
- Отваря епилозите „Гласът на Ванга“, „Археолозите на 1970-те“ и „Осмият опит“.  
- Условия за side quest: писмото в тунела се чете от бъдеще герой → unlock „Legacy of the Hidden Letter“.  
- Ако `state.flag.hero_alive = uncertain`, GM може да стартира Post-Act V freeplay в Кръстова гора.

## Encounters
- **Living walls** — Lore или Presence 55; провал → `fear_mark`.  
- **Oath altar** — Willpower 60 или Spellcraft 50; провал → `state.flag.oath_ignored`.  
- **Treasure temptation** — Insight 50; провал → `state.flag.greedy_spirit = hostile`.  
- **Greed trial (cups)** — Luck 50 или Fire magic; провал → injury.  
- **Underground lake** — Athletics 60 / Craft 50 / Spell 55.  
- **Chariot dialogue** — Willpower, Leadership или Lore 60 в зависимост от отговора.  
- **Seal ritual** — Combination check (Lore + Companion assist 55).  
- **Collapse escape** — Athletics/Spell 55, `inventory.ropes` или `intel.tunnel_map` за auto-success.  
- **Final sacrifice** — Resource trade-off влияещ на епилога.

## Notes
- Поддържай напрежение с `state.flag.collapse_timer`.  
- Следи дали дневникът остава цял (`journal.intact`), дали монетите са изнесени, и дали companions са живи.  
- Записвай в journal: „Act V — Tunnel“, „Клетвата“, „Колесницата“, „Срутването“, „Последният избор“.  
- Използвай реалните тракийски вярвания (звездни карти, жречески прах) за flavor.  
- Ако играчът реши да наруши предупреждението, имай готови последици (curse, future faction tension).

## Conditions
- Активира се автоматично след завършване на [[main-quest-09]] и отключване на `crossforest_to_belintash`.  
- Изисква всички седем монети в инвентара; без тях входът отказва достъп.  
- Препоръчителни ресурси: `inventory.ropes >= 2`, `inventory.supplies >= 5`, `amulet_burden < 25`.  
- Ако `injury_level >= 3`, входът блокира, докато не се излекуваш в Кръстова гора (fail-loop).

## Outcome
- `state.main_quest.current = "act_v_aftermath"`; задава `state.main_quest.next = "epilogue"` или „post-act freeplay“.  
- `quest_flags.coin_set_sealed = true` ако ритуалът успее; иначе `state.flag.chariot_curse = true`.  
- `state.flag.hero_alive`, `state.flag.hero_sacrifice`, `journal.hidden_letter`, `state.flag.final_vision` се определят от изборите.  
- Companions и factions получават финални modifiers според решенията.  
- Подготвя валидаторските проверки за епилогите (ще бъдат добавени отделно).

## Outcome Hooks
- [[belintash-collapse]] — ако дневникът е оставен, епилогът стартира с археолозите.  
- [[cross-forest]] — ако героят се върне, Кръстова гора реагира с нови молитви (epilogue hook).  
- [[wonders-bridges]] — легендата за змея се обновява, ако монетите са скрити/върнати.  
- [[philippopolis]] — евентуални писма към двора (ако избера COND B в сцената 112).  
- [[cross-forest-hermit-oak]] — отшелникът усеща резултата и може да стартира side quest „Кой ще пази монетите“.

## Fail State
- Ако collapse таймерът изтече → `state.flag.hero_alive = false`, `journal.intact = false`, монетите се губят; започва епилог „Осмият опит“.  
- Провал при seal ritual → `state.flag.collapse_timer = fast`, companions може да бъдат затрупани (permadeath hook).  
- Ако `injury_level >= 4`, героят не може да продължи → трябва да рестартира сцената от autosave (letter или монолит).  
- При неспазване на клетвата (взимане на treasure) → `state.flag.chariot_curse = true`, tension +15 за всички бъдещи сцени.

## Aftermath
- Обнови journal с „Монетите се запечатаха“, „Писмото в тунела“, „Последната визия“ и отбележи избора за съдбата.  
- Player state: `current_area_id` се превключва към [[belintash-collapse]] или обратно към [[cross-forest]] според финала; `active_quests` маркира `main-quest-10` като completed при успешен изход.  
- Добави exploration entries за всяка ключова сцена (вход, стражи, клетвата, оръжията, съкровищницата, езерото, камерата на колесницата, ритуала, collapse маршрут, писмото, последната визия).  
- Уреди hook към епилогите в `player-data/runtime/state.json` (ще се добавят след завършване на Act V).  
- Прехвърли монетите в `item.quest.coin_set` или ги отбележи като изгубени заместители.
