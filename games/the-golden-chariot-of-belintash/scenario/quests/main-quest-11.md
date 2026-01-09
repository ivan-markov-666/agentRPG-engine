# Гласът на Ванга — Епилог I / Main Quest

## Metadata
| Параметър | Стойност |
|-----------|----------|
| **Тип** | Main Quest |
| **Акт** | Епилог I — „Гласът на Ванга“ |
| **Локации** | [[epilogue-vanga]], [[philippopolis]], [[belintash-collapse]] |
| **Предпоставки** | Завършен [[main-quest-10]], `state.main_quest.current = "act_v_epilogue_setup"` |
| **Точки** | 5 (Сцени 121–125) |

## Summary
След финала на Act V камерата се издига към Рупите. Ванга говори пред иманяри и вдовици, описвайки случилото се под Белинташ. Епилогът редува гласa ѝ с кадри от археолозите и гробището, завършвайки с напътствие към бъдещи истории.

## Story Beats
1. **Тишина и глас** — черен екран, звукът задава тон.  
2. **Пророчеството на Ванга** — иманярите чуват предупрежденията.  
3. **Археолозите през 1970-те** — показват последиците и hooks.  
4. **Гробището при Белинташ** — имената на падналите, писмо или мъгла.  
5. **Гласът затихва** — решава как етикетът „Act V — Край“ се визуализира.

## Steps
1. **Пусни тишината и звука в [[epilogue-vanga]]** — избери звук (вятър, глас, камбани) за сцена 121.  
2. **Изиграй пророчеството на Ванга** — сцената с иманярите задава основния hook (осем жертви, жената с писмото, плачещите кръстове).  
3. **Прехвърли камерата към археолозите в [[philippopolis]]** — определи дали документират, взимат монета или се оттеглят.  
4. **Покажи гробището и спомена за [[belintash-collapse]]** — избери дали се вижда нов кръст, оставено писмо или мъгла.  
5. **Завърши с шепота** — реши дали е черен екран, карта на бъдещите места или блестящ камък.

## Rewards
- XP: 150 (story closure).  
- Gold: 40 (дарове от поклонници и архивисти, които искат да запазят историята).  
- Loot: `item.epilogue.audio_reel`, `item.epilogue.archaeologist_letter`.  
- State: `state.main_quest.current = "epilogue_i"`, `journal.epilogue = ["vanga_message", ...]`, `state.epilogue.cemetery = {cross|letter|mist}`.  
- Social: `reputation.common_folk +5` ако гласът запази тайната; `reputation.court +5` ако писмата стигнат до двора.

## Hooks
- Unlocks [[main-quest-12]] (следващите епилози) или free-play в 1970-те.  
- Пророчеството за „осем жертви“ може да стартира DLC кампании.  
- Ако археолозите вземат монета, `world_bible.pending_case = "belintash_monograph"`.

## Encounters
- **Prophecy delivery** — Social/Presence 40 за иманярите (определя дали слушат).  
- **Archive comparison** — Lore 45 за сцената с археолозите (unlock intel).  
- **Cemetery inspection** — Investigation 35 за писмото/кръста.  
- **Fade-out choice** — Narrative control (GM решава, няма проверки).

## Notes
- Използвай ??sfx ?? cues от AUDIO-SCRIPTS.md.  
- Припомни state флаговете от Act V (journal.hidden_letter, hero_alive, coin_set_sealed).  
- Ако героят е жертвал дневника, епилогът показва мъгла вместо писмо.

## Conditions
- Изисква `quest_flags.coin_set_sealed == true` или `state.flag.chariot_curse = true` (показва по-мрачна версия).  
- `journal.hidden_letter = true` добавя допълнителен реплик в сцена 122/124.

## Outcome
- `state.main_quest.current = "epilogue_i"` и `state.main_quest.next = "epilogue_ii"`.  
- Journal: „Епилог I — Гласът на Ванга“.  
- `state.epilogue.vanga_message` = избраната реплика; `state.epilogue.archaeologists` = {record|coin|retreat}; `state.epilogue.cemetery` = {cross|letter|mist}.

## Outcome Hooks
- [[philippopolis]] — писмата предизвикват политически реакции.  
- [[belintash-collapse]] — flashbacks се активират, ако някой търси дневника.  
- [[epilogue-vanga]] — служи като hub за бъдещи DLC/epilози.

## Fail State
- Ако сцените не се изиграят (GM пропусне), `state.main_quest.current` остава „act_v_epilogue_setup“ и се изисква rerun.  
- Няма механичен провал; само липса на closure.

## Aftermath
- Обнови exploration log с записи за сцените 121–125.  
- Player state: `current_area_id = "epilogue-vanga"`, `active_quests` маркира `main-quest-11` като completed след сцената 125.  
- Подготвя unlock за следващия епилог файл.
