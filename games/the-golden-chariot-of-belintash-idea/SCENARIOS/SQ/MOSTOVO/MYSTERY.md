# МОСТОВО/ГОРНОСЛАВ · SIDE QUESTS — МИСТЕРИЯ (#21–24)

> **Traceability**: SIDE-QUESTS.md §Мостово/Горнослав мистерия #21–24 · SCENARIO-WRITING-PLAN §7.2 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-MOS-MYST-21 — "Урокът на Руска"

> **Свързани документи**: SIDE-QUESTS.md §21, LOCATIONS.md §Горнослав, MAGIC-SPELLS.md §Protection, AUDIO-SCRIPTS.md §Night vigil

Баба Руска ти подава шепа сол и казва със смешка: „Ще прекараш нощ на Урочния камък. Ако оцелееш без да станеш легенда, ще научиш защо змиите не ядат БДЖ билети.“

> **[ИЗБОР] Как издържаш бдението?**  
> **А)** Сядаш в кръга и пееш народна песен. *(Performance DC 12; успех → `spell.unlock = "Защита от уроки"`; провал → ехо те плаши, tension +5)*  
> **Б)** Рисуваш защитни руни с амулета. *(Spirit DC 13; успех → `state.buff.runic_shield = true`; провал → амулетът прегрява, health -5)*  
> **В)** Оставяш приношение (мед, хляб) и наблюдаваш сенките. *(Lore DC 11; успех → `lore_token.urochniy_secret`; провал → лисица го краде)*

> **STATE UPDATE**  
> - `quest_flags.mostovo.mystery.ruska = completed`  
> - Reward: spell „Защита от уроки“ или специален buff според избора.

---

## SQ-MOS-MYST-22 — "Хорището на самодивите"

> **Свързани документи**: SIDE-QUESTS.md §22, LOCATIONS.md §Самодивска поляна, COMPANIONS.md §Калина, WORLD-BIBLE.md §Samodiva lore

Калина те предупреждава: „Самодивите не обичат туристи. Ако ще ги търсим, върви сякаш отиваш на опашка за масло — смирено и с надежда.“

> **[ИЗБОР] Настройка**  
> **А)** Нощно наблюдение със скрити огледала. *(Stealth DC 13; успех → виждаш танца, получаваш `item.samodiva_flower`; провал → самодивите те плашат, morale -5)*  
> **Б)** Свириш на кавал/флейта. *(Performance DC 12; успех → самодивите оставят „искрящ прах“; провал → инструментът се чупи)*  
> **В)** Предлагаш легенда, разказана в стила на Алеко. *(Storytelling/Lore DC 14; успех → получаваш предзнаменование за Белинташ)*

> **STATE UPDATE**  
> - `quest_flags.mostovo.mystery.samodiva = completed`  
> - Reward: `inventory.samodiva_flower`, `buff.dance_of_light`, или `vision.hook_act_iii`

---

## SQ-MOS-MYST-23 — "Гласът от кладенеца"

> **Свързани документи**: SIDE-QUESTS.md §23, LOCATIONS.md §Старият кладенец, AUDIO-SCRIPTS.md §Echo motif, LORE-CARDS.md §Ancient miners

На път от Мостово към Горнослав чуваш глас от древен кладенец: „Надолу има повече истории от чиновник с пет папки.“ Няма никой, но гласа настоява.

> **[ИЗБОР] Реакция**  
> **А)** Спускаш се с въже и факла. *(Athletics DC 12; успех → откриваш резба и запис „Братството е минало тук“)*  
> **Б)** Говориш чрез амулета — питаш кой е. *(Spirit DC 13; успех → дух на древен миньор дава координати към скрит вход)*  
> **В)** Пускаш Шаро/друг спътник за наблюдение и записваш ехото. *(Requires companion; Investigation DC 11; успех → разгадаваш кодирано послание)*

> **STATE UPDATE**  
> - `quest_flags.mostovo.mystery.well_voice = completed`  
> - Reward: `lore_hint.ancient_history`, `map.hidden_cache`, или `journal.append("Well prophecy")`

---

## SQ-MOS-MYST-24 — "Сънят на дядо Стоян"

> **Свързани документи**: SIDE-QUESTS.md §24, COMPANIONS.md §Стоян, MAGIC-SPELLS.md §Dreamwalk, AUDIO-SCRIPTS.md §Lullaby reprise

Жена на болен старец твърди, че той бълнува: „Златото зад големия бук!“ Стоян лежи като герой след банкет и шепне имена. Светлината в стаята е мека като усмивката на Бай Ганьо пред европейски бюфет.

> **[ИЗБОР] Влизане в съня**  
> **А)** Използваш dreamwalk potion. *(Requires `inventory.potion_dream`; Spirit DC 14; успех → виждаш карта на скрит склад)*  
> **Б)** Разпитваш роднините и търсиш физически следи. *(Investigation DC 12; успех → откриваш стар дневник с координати)*  
> **В)** Пееш приспивна песен, за да стабилизираш съня и да зададеш въпроси. *(Performance DC 11; успех → `lore_token.hidden_gold`; провал → старецът се буди, tension +5)*

> **STATE UPDATE**  
> - `quest_flags.mostovo.mystery.dream = completed`  
> - Reward: `karma +1`, `reputation.villagers +10`, unlock `side_hook.hidden_gold_trail`

---

> **Set Bonus:** Когато всички мистерийни куестове са готови, `state.mostovo.whispers = true`, което намалява DC за общуване с Баба Руска и самодивските NPC-та (-2) и отключва сцена „Нощните шепоти над Горнослав“ (foreshadow за Act II).
