# Гласът на археолозите — Епилог III / Main Quest

## Metadata
| Параметър | Стойност |
|-----------|----------|
| **Тип** | Main Quest |
| **Акт** | Епилог III — „Гласът на археолозите“ |
| **Локации** | [[belintash-modern-camp]], [[belintash-collapse]], [[philippopolis]] |
| **Предпоставки** | Завършен [[main-quest-12]], `state.main_quest.current = "epilogue_ii"` |
| **Точки** | 5 (Сцени 131–135) |

## Summary
Модерна експедиция се разполага на Белинташ през 2024 г. Броячът на жертвите светва отново, камерата прескача към наши дни, археолозите спорят кой да води, тунелът се отваря, а в края се открива осмата жертва — героят. Куестът решава дали тайната ще бъде запазена или издадена.

## Story Beats
1. **Броячът на жертвите** — визуализира осемте светлини и задава тона.  
2. **Скок във времето** — преход към 2020-те с дронове/архивни кадри.  
3. **Археолозите спорят** — избор кой оглавява експедицията.  
4. **Отворът под скалите** — решава как екипът влиза и стабилизира тунела.  
5. **Осмата жертва** — реакцията пред скелета и колесницата, определя изхода.

## Steps
1. **Активирай брояча в [[belintash-modern-camp]]** — избери стила (кръстове, карта, дневник) и запиши `state.epilogue.counter_style`.  
2. **Покажи скока във времето** — реши как камерата минава към 2020-те и обнови `world_state.timeline = "2020s_modern_day"`.  
3. **Избери ръководителя на експедицията** — Лилия, Костов или Велев (Leadership check), задава `state.epilogue.expedition_lead`.  
4. **Отвори тунела** — избери метод (ровър, ритуал, военен клин), направи Engineering check и маркирай `quest_flags.belintash_tunnel_opened = true`.  
5. **Срещни осмата жертва** — реши реакцията (почит, излъчване, опит за амулета) и задай `ending_id`.

## Rewards
- XP: 200 (modern closure).  
- Gold: 80 (финансиране от грантове/спонсори).  
- Loot: `item.modern.archive_drive`, `item.modern.security_pass`.  
- State: `state.main_quest.current = "epilogue_iii"`, `state.main_quest.next = "epilogue_iv"`, `world_state.timeline = "2020s_modern_day"`, `state.epilogue.expedition_lead`, `state.epilogue.counter_style`, `state.epilogue.ritual_protection`, `state.epilogue.outcome = ending_id`.  
- Social: `reputation.bulgarian_court +10` ако тайната се пази; `reputation.common_folk +10` ако се излъчи; `reputation.bogomils +5` при ритуалния вход.

## Hooks
- Unlocks [[main-quest-14]] (Епилог IV — „Следите от златото“).  
- `ending_id` определя NG+ intro и DLC hooks (`legacy_kept`, `secret_exposed`, `silence_enforced`).  
- `quest_flags.belintash_tunnel_opened` позволява future free-play в тунела.

## Encounters
- **Counter ceremony** — Presence 35 за да държиш брояча стабилен (иначе tension +5).  
- **Leadership dispute** — Leadership 40, провал → `tension +5`.  
- **Engineering check** — Engineering 45 (или Ritual check при опция Б) за стабилизиране на входа.  
- **Security breach** — Stealth vs Security 12 ако медии се промъкват.  
- **Final reaction** — Narrative choice; при опция В се хвърля Saving throw срещу collapse (DC 14).

## Notes
- Пренеси state от Епилог II (song_theme, pact, museum_response).  
- Ако `state.epilogue.heir = "granddaughter"`, тя може да участва чрез видеовръзка (bonus на morale).  
- Ако `state.hazard.belintash_rocks = "unstable"`, добави допълнителни checks по време на сцените 134–135.

## Conditions
- Изисква достъп до [[belintash-modern-camp]] и `state.epilogue.pact` вече определен.  
- Ако `state.epilogue.pact = "secrecy"`, опцията за live stream (Step 5Б) носи extra tension +5.

## Outcome
- `state.main_quest.current = "epilogue_iii"`, `state.main_quest.next = "epilogue_iv"`.  
- Journal: „Епилог III — Гласът на археолозите“.  
- `state.epilogue.outcome = ending_id` и `news_feed.add(ending_id)`.

## Outcome Hooks
- [[belintash-modern-camp]] — служи като hub за NG+ и DLC мисии.  
- [[philippopolis]] — университетът реагира според ending_id.  
- [[belintash-collapse]] — тунелът остава отворен или се запечатва според избора.

## Fail State
- Ако Engineering check (Step 4) провали + collapse → `state.main_quest.current` остава „epilogue_i i“ и GM трябва да рестартира сцените, докато тунелът е безопасен.  
- Ако security lockdown изгони екипа, ending_id се насочва автоматично към „silence_enforced“.

## Aftermath
- Добави exploration entries за сцените 131–135.  
- Обнови runtime state към [[belintash-modern-camp]].  
- Подготви unlock за Епилог IV.
