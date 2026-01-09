# Писмата и наследниците — Епилог II / Main Quest

## Metadata
| Параметър | Стойност |
|-----------|----------|
| **Тип** | Main Quest |
| **Акт** | Епилог II — „Писмата и наследниците“ |
| **Локации** | [[epilogue-heir-meadow]], [[zabyrdo]], [[philippopolis]], [[belintash-collapse]], [[epilogue-vanga]] |
| **Предпоставки** | Завършен [[main-quest-11]], `state.main_quest.current = "epilogue_i"` |
| **Точки** | 5 (Сцени 126–130) |

## Summary
Писмото на героя е намерено години по-късно и достига до наследниците. На поляната над Забърдо те изпяват песента, обсъждат писмата на археолозите и решават дали тайната ще остане скрита. Куестът продължава тона от Епилог I и подготвя следващите епилози и DLC hooks.

## Story Beats
1. **Писмото на героя** — определя кой наследник или археолог го открива.  
2. **Възраждането на песента** — темата на песента задава настроение (жертва, опасност, надежда).  
3. **Писмата на археолога** — реакцията на музея/властите.  
4. **Наследниците се събират** — пактът между фамилиите.  
5. **Финалният кадър** — надпис/координати/песен, които затварят Епилог II.

## Steps
1. **Прочети писмото на поляната [[epilogue-heir-meadow]]** — избери кой го намира и задава POV (flashback към [[belintash-collapse]]).  
2. **Изпей старата песен** — реши темата (жертва/опасност/надежда) и запиши `state.epilogue.song_theme`.  
3. **Преслушай писмата на археолога в [[philippopolis]]** — определя реакцията на музея (разследване, скептицизъм, охрана).  
4. **Събери наследниците от [[zabyrdo]] в кръг** — пакт за тайната, нови пазители или публикуване на писмата.  
5. **Завърши с финалния кадър** — реши надписа/координатите/песента и задай `state.main_quest.current = "epilogue_ii"`.

## Rewards
- XP: 150 (legacy storytelling).  
- Gold: 60 (дарения от наследниците за поддръжка на песента и архива).  
- Loot: `item.legacy.folk_song_scroll`, `item.archive.letter_bundle`.  
- State: `state.epilogue.heir`, `state.epilogue.song_theme`, `state.epilogue.museum_response`, `state.epilogue.pact`, `state.main_quest.current = "epilogue_ii"`, `state.main_quest.next = "epilogue_iii"`.  
- Social: `reputation.common_folk +5` ако песента се сподели, `reputation.bulgarian_court +5` ако музеят участва.

## Hooks
- Unlocks следващия епилог (археолозите в наши дни).  
- Пактът определя дали DLC „Next Generation“ или „Public Reveals“ е достъпно.  
- Писмата на археолога могат да стартират side quest за музейни интриги.

## Encounters
- **Letter discovery** — Investigation/Social 35 за да разбереш кой го открива.  
- **Song performance** — Performance/Presence 40 (темата дава бонуси).  
- **Museum response** — Lore/Diplomacy 45 при избори B/В.  
- **Heir pact** — Negotiation 40 за постигане на консенсус.  
- **Final shot** — Narrative control; няма проверки, но влияе на state.

## Notes
- Напомни за резултатите от Act V (journal.hidden_letter, hero_alive, coin_set_sealed).  
- Ако писмото не е оставено в Act V, наследниците намират копие (effect -5 morale).  
- Свържи сцената с Ванга чрез voice-over или запис от епилога.

## Conditions
- `journal.hidden_letter = true` за пълния ефект; иначе куестът все пак се играе, но песента губи част от силата.  
- Изисква `state.epilogue.vanga_message` да е зададен.

## Outcome
- `state.main_quest.current = "epilogue_ii"`, `state.main_quest.next = "epilogue_iii"`.  
- Journal: „Епилог II — Писмата и наследниците“.  
- `state.epilogue.archives` се попълва с нови данни (песен, писма, пакт).

## Outcome Hooks
- [[epilogue-vanga]] — гласът се връща за преход към Епилог III.  
- [[zabyrdo]] — селото може да отключи нови песни/side quests.  
- [[epilogue-heir-meadow]] — остава като future hub.

## Fail State
- Няма класически провал; ако сцените не се изиграят, `state.main_quest.current` остава „epilogue_i“. GM трябва да рестартира куеста.

## Aftermath
- Добави exploration entries за сцени 126–130.  
- Обнови runtime state към [[epilogue-heir-meadow]] и отбележи резултатите (`state.epilogue.*`).  
- Подготви unlock за Епилог III.
