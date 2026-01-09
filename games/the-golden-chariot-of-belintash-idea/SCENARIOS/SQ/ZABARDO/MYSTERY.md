# ЧУДНИ МОСТОВЕ / ЗАБЪРДО · SIDE QUESTS — МИСТЕРИЯ (#56–57)

> **Traceability**: SIDE-QUESTS.md §Чудни мостове/Забърдо мистерия #56–57 · SCENARIO-WRITING-PLAN §7.6 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-ZAB-MYST-56 — "Сълзите на змея"

> **Свързани документи**: SIDE-QUESTS.md §56, LOCATIONS.md §Чудни мостове, LORE-CARDS.md §Dragon legend, WORLD-BIBLE.md §Artifacts

Старецът от Забърдо сочи към стърчащите арки: „Когато змей умира, плаче с камък. Който събере сълзите му, може да върви през огън без да стане писък.“

> **[ИЗБОР] Как ги търсиш?**  
> **А)** Окачваш кристални решетки под арките и чакаш нощния конденз. *(Engineering DC 12; успех → `item.dragon_teardrop`; провал → решетката пада, health -5)*  
> **Б)** Следваш легендата за оттичащите се сълзи към подземна щерна. *(Lore DC 13; успех → откриваш ниша; провал → изгубваш се, tension +5)*  
> **В)** Пееш старото „Леле, змейо“ и наблюдаваш сиянията. *(Performance/Spirit DC 14; успех → кристалът се проявява; провал → змейски ехолалия, morale -5)*

> **STATE UPDATE**  
> - `quest_flags.zabardo.mystery.dragon_tears = collected`  
> - Reward: `item.dragon_tear_crystal` (fire resist +10), `lore_token.dragon_legend`, `karma +1` ако споделиш кристала със селото.

---

## SQ-ZAB-MYST-57 — "Гласът в пещерата"

> **Свързани документи**: SIDE-QUESTS.md §57, LOCATIONS.md §Пещера под моста, AUDIO-SCRIPTS.md §Echo chant, MAGIC-SPELLS.md §Spirit communion

В най-дълбоката пещера, където дишането звучи като държавен протокол, чуваш глас: „Не всяко чудовище е чудовище. Понякога е пазител.“

> **[ИЗБОР] Как разговаряш с гласа?**  
> **А)** Отговаряш с въпроси за змея и оставяш дар от сол. *(Spirit DC 12; успех → духът разказва за реалната жертва; провал → ехото се ядосва, tension +5)*  
> **Б)** Използваш резонансен инструмент (кавал/гайда), за да модулрираш гласа. *(Performance DC 13; успех → получаваш указание за тайно помещение; провал → събаряш сталактит, health -5)*  
> **В)** Викаш companions за call-and-response ритуал. *(Requires ≥2 companions; Leadership DC 11; успех → `vision.dragon_pact`; провал → companions frightened, morale -5)*

> **STATE UPDATE**  
> - `quest_flags.zabardo.mystery.cave_voice = appeased`  
> - Reward: `lore_token.guardian_truth`, `map.secret_vein`, `buff.dragon_guardian (spirit ally)` за следващата битка.

---

> **Set Bonus:** При завършени мистерийни куестове `state.zabardo.legend_awoken = true`, което дава -2 DC за взаимодействие с магически зверове и отключва сцена „Съветът на старейшините над змейските кости“ (foreshadow за Act V).
