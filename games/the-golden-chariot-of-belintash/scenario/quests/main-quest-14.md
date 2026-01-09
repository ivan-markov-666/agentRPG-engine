# Следите от златото — Епилог IV / Main Quest

## Metadata
| Параметър | Стойност |
|-----------|----------|
| **Тип** | Main Quest |
| **Акт** | Епилог IV — „Следите от златото“ |
| **Локации** | [[belintash-amulet-vault]], [[belintash-modern-camp]], [[belintash-collapse]] |
| **Предпоставки** | Завършен [[main-quest-13]], `state.main_quest.current = "epilogue_iii"` |
| **Точки** | 5 (Сцени 136–140) |

## Summary
След като модерната експедиция влиза в тунела, камерата на амулета се пробужда. Амулетът светва, надписът под лампите изисква превод, съветът решава съдбата на тайната, гласът зад кадър прави финалното обобщение, а последният кадър показва как Белинташ живее в бъдещето.

## Story Beats
1. **Амулетът се разгаря** — светлината избира наследник, учен или страж.  
2. **Надписът под лампите** — решава се кой превежда и какво се записва.  
3. **Съдбата на тайната** — публично разкриване, тайно досие или инсценирана катастрофа.  
4. **Гласът зад кадър** — тонът на разказвача (героичен, хумористичен, предупреждаващ).  
5. **Кадърът, който остава** — финалният визуален hook (мистерия, наследници, DLC светлина).

## Steps
1. **Пробуди амулета в [[belintash-amulet-vault]]** — избери кой го държи (наследник, учен или оставяна жертва) и задаj `state.epilogue.amulet_status`.  
2. **Преведи надписа** — реши дали наследник, AI или камерата само записва; попълни `state.epilogue.inscription = {heir|ai|sealed}`.  
3. **Реши съдбата на тайната** — публично, тайно досие или запечатване; задаj `state.epilogue.outcome = {secret_exposed|legacy_kept|silence_enforced}`.  
4. **Избери тона на разказвача** — `state.epilogue.narration = {heroic|humorous|ominous}` влияе на NG+.  
5. **Определи финалния кадър** — мистериозен пламък, списък с наследници или светлина към ново място; задаj `credits.config.ending`.

## Rewards
- XP: 250 (ultimate closure).  
- Gold: 100 (спонсорство или благодарности от наследниците).  
- Loot: `item.epilogue.amulet_fragment`, `item.epilogue.archival_plate`.  
- State: `state.main_quest.current = "epilogue_iv"`, `state.main_quest.next = null`, `state.epilogue.amulet_status`, `state.epilogue.inscription`, `state.epilogue.outcome`, `state.epilogue.narration`, `credits.config.ending`.  
- Social: `reputation.bulgarian_court +10` ако тайната се запази; `reputation.common_folk +15` ако се разкрие; `reputation.bogomils +5` при ритуалното запечатване.

## Hooks
- Unlocks NG+ / DLC hooks (`dlc_hook.balkan_trail`, `quest_hook.next_generation`).  
- Ако ending е „secret_exposed“, се отваря storyline за „Modern Archive Disputes“.  
- Ако ending е „silence_enforced“, се активира hazard `state.hazard.belintash_rocks = "collapse_imminent"` за бъдещи кампании.

## Encounters
- **Amulet surge** — Willpower 45 или Tech 45 според избрания подход; провал → `state.hazard.belintash_rocks = "unstable"`.  
- **Inscription translation** — Lore 50 или AI Tech 45; провал → надписът остава sealed.  
- **Outcome debate** — Diplomacy 40; провал → tension +5 и случайно ending (GM roll).  
- **Narrator tone** — Performance 35 (или просто narrative control).  
- **Final shot** — Narrative check, провал → default ending „mystery_roll“.

## Notes
- Използвай резултатите от предишните епилози: кой е наследникът, кой води експедицията, дали тунелът е стабилен.  
- Ако `quest_flags.belintash_tunnel_opened = false`, сценарият започва с аварийно разчистване (добави допълнителна сцена).  
- При `state.epilogue.pact = "secrecy"` live stream е заключен, освен ако Diplomacy не постигне съгласие.

## Conditions
- Не може да стартира, ако `state.hazard.belintash_rocks = "collapse_imminent"` без стабилизация (Engineering сцена преди Step 1).  
- Изисква достъп до [[belintash-amulet-vault]] и `state.epilogue.expedition_lead` зададен.

## Outcome
- `state.main_quest.current = "epilogue_iv"` и кампанията приключва.  
- Journal: „Епилог IV — Следите от златото“.  
- `credits.config.ending` съхранява избора и подготвя NG+.

## Outcome Hooks
- [[belintash-modern-camp]] — се превръща в музей или охранявана зона според ending.  
- [[belintash-collapse]] — може да се запечата или отвори за free-play.  
- [[zabyrdo]] / [[philippopolis]] — реагират според това дали тайната излиза публично.

## Fail State
- Ако амулетът бъде насилствено взет и провали проверката, `state.hazard.belintash_rocks = "collapse_imminent"` и ending се заключва към „silence_enforced“.  
- Ако никой не може да преведе надписа, играчите получават само базов ending без NG+ hooks.

## Aftermath
- Добави exploration записи за сцените 136–140.  
- Обнови runtime state с финалния ending snapshot.  
- Финален валидатор за целия сценарий.
