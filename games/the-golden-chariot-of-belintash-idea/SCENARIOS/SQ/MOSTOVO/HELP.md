# МОСТОВО/ГОРНОСЛАВ · SIDE QUESTS — ПОМОЩ (#14–17)

> **Traceability**: SIDE-QUESTS.md §Мостово/Горнослав помощ #14–17 · SCENARIO-WRITING-PLAN §7.2 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-MOS-HELP-14 — "Билки за Калина"

> **Свързани документи**: SIDE-QUESTS.md §14, LOCATIONS.md §Мостово, COMPANIONS.md §Калина, TRAVEL-SYSTEM.md §herbal_triangle

Калина разстила карта на билки, по-сложна от данъчен формуляр. „Три билки, три изпитания. Който ги донесе, ще чуе как Белинташ шепти на водата.“

> **[ИЗБОР] Коя билка гониш първо?**  
> **А)** „Сълзата на мъха" край водопада. *(Athletics DC 12; успех → `inventory.herbs += moss_teardrop`; провал → мокри дрехи, health -5)*  
> **Б)** „Златната коприва" в полето със стършели. *(Stealth DC 11; успех → `buff.poison_resist +5`; провал → sting, tension +5)*  
> **В)** „Дъхът на нощта" близо до руините. *(Spirit DC 13; успех → `lore_token.night_bloom`; провал → hallucination, morale -5)*

> **STATE UPDATE**  
> - `quest_flags.mostovo.help.kalina = completed`  
> - Reward: Companion Калина отключена (или affinity +10), `inventory.potions += 1 alchemical_tonic`

---

## SQ-MOS-HELP-15 — "Болното дете"

> **Свързани документи**: SIDE-QUESTS.md §15, LOCATIONS.md §Горнослав, MAGIC-SPELLS.md §Healing rites, AUDIO-SCRIPTS.md §Lullaby motif

Отчаяна майка държи детето си като грамота пред султан: „Лекарят от Станимака не идва, а треската пее.“

> **[ИЗБОР] Метод за лечение**  
> **А)** Даваш билките на Калина + ритуал. *(Medicine DC 12; успех → `state.child_health = "recovered"`; провал → tension +5)*  
> **Б)** Викаш Баба Руска за нощна молитва. *(Requires relation с Баба Руска ≥ 0; Spirit DC 11)*  
> **В)** Организираш селски сбор за вода и огнище (народна терапия). *(Leadership DC 11; успех → morale +10 villagers)*

> **STATE UPDATE**  
> - `quest_flags.mostovo.help.sick_child = completed`  
> - Reward: `reputation.villagers += 15`, `buff.blessing_child = +3 HP regen (24h)`

---

## SQ-MOS-HELP-16 — "Старецът и планината"

> **Свързани документи**: SIDE-QUESTS.md §16, LOCATIONS.md §Пътят към Караджов камък, TRAVEL-SYSTEM.md §ridge_pass

Стар овчар, ухилен като герой от "Бай Ганьо", настоява да види планината още веднъж. „Краката ми са дърва, но сърцето е гайда.“

> **[ИЗБОР] Как го придружавaш?**  
> **А)** Носиш го на муле и разказваш истории. *(Animal Handling DC 10; успех → `lore_hint.hidden_pass`; провал → муле се спъва, travel delay)*  
> **Б)** Строиш импровизирано носило с местните. *(Craft DC 11; успех → `reputation.villagers +5`; провал → носилото се клати, tension +5)*  
> **В)** Пускаш стареца да върви бавно, а ти разчистваш пътя. *(Athletics DC 12; успех → unlock „secret overlook“ сцена)*

> **STATE UPDATE**  
> - `quest_flags.mostovo.help.old_man = completed`  
> - Reward: `map.hidden_path_to_karadjov = true`, `karma +1`

---

## SQ-MOS-HELP-17 — "Писмото до сина"

> **Свързани документи**: SIDE-QUESTS.md §17, TRAVEL-SYSTEM.md §mostovo_stanimaka_route, COMMUNICATION.md §Courier rules

Болна майка ти подава писмо, запечатано с парченце восък. „Занеси го в Станимака преди жътвата. Иначе синът ми ще продаде нивата.“

> **[ИЗБОР] Курирски стил**  
> **А)** Бърз пробег „като делова телеграма". *(Travel DC 12; успех → `time_bonus`, reward +2 coins; провал → exhaustion -10)*  
> **Б)** Скрепваш го към pigeon post. *(Requires `inventory.tools.pigeon_kit`; success → tension -5, но intrigue +5)*  
> **В)** Включваш съобщение в търговски керван. *(Negotiation DC 11; успех → `reputation.merchants +5`; провал → такса 3 coins)*

> **STATE UPDATE**  
> - `quest_flags.mostovo.help.letter = completed`  
> - Reward: `karma +1`, `reputation.villagers +5` (допълнителен бонус ако доставиш лично)

---

> **Set Bonus:** При завършени всички помощни куестове в Мостово/Горнослав `state.mostovo.support = true`, което намалява travel DC между Каменица ↔ Мостово ↔ Горнослав с 2 и отключва сцена „Пазарът на билките“ (евтини отвари, -10% цена).
