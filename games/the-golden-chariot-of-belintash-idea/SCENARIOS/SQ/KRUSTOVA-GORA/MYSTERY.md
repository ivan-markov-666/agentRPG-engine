# КРЪСТОВА ГОРА · SIDE QUESTS — МИСТЕРИЯ (#58–60)

> **Traceability**: SIDE-QUESTS.md §Кръстова гора мистерия #58–60 · SCENARIO-WRITING-PLAN §7.7 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-KRG-MYST-58 — "Парчето от Кръста"

> **Свързани документи**: SIDE-QUESTS.md §58, LOCATIONS.md §Кръстова гора, MAIN-QUEST-OUTLINE.md §Act IV, LORE-CARDS.md §Holy shard

Видение те буди като камбана в понеделник: „Вдигни камъка с резбата на лоза.“ На разсъмване кръстовете са втори хоризонт, а отгоре се спуска лъч, който сочи ниша.

> **[ИЗБОР] Как следваш видението?**  
> **А)** Пости и мълчание до полунощ, после стъпваш бос през росата. *(Willpower DC 14; успех → `vision_accuracy +2`; провал → exhaustion -5 HP)*  
> **Б)** Разчиташ резбите като код. *(Lore DC 13; успех → локализираш камера; провал → объркваш посоките)*  
> **В)** Молиш отшелника за благослов и използваш амулета. *(Spirit DC 12; успех → `item.holy_shard`; провал → амулетът прегрява, morale -5)*

> **STATE UPDATE**  
> - `quest_flags.krustova.mystery.holy_shard = obtained`  
> - Reward: `item.cruciform_fragment` (resist corruption +10), `vision.act_v_path`.

---

## SQ-KRG-MYST-59 — "Последното желание"

> **Свързани документи**: SIDE-QUESTS.md §59, LOCATIONS.md §Светите поляни, NPCS.md §Отшелникът, COMPANIONS.md §Pilgrim archetype

Умиращ поклонник шепне: „Погреби ме там, където кръстовете шептят на вятъра. Инак душата ми ще чака като документ без подпис.“

> **[ИЗБОР] Погребален избор**  
> **А)** Пълна литургия с монаси и песнопения. *(Leadership DC 12; успех → `reputation.church +10`; провал → спор за ритуала)*  
> **Б)** Тайна нощна церемония, за да не се намесват власти. *(Stealth DC 11; успех → `karma +1`; провал → стражи губят доверие)*  
> **В)** Смесен ритуал: християнски и древен. *(Spirit DC 13; успех → `buff.dual_faith`; провал → отшелникът се сърди, tension +5)*

> **STATE UPDATE**  
> - `quest_flags.krustova.mystery.last_wish = honored`  
> - Reward: `blessing.peace_of_cross`, `morale +10`, възможност за видение ако companion присъства.

---

## SQ-KRG-MYST-60 — "Отшелникът и тайната"

> **Свързани документи**: SIDE-QUESTS.md §60, LOCATIONS.md §Кръстова гора, MAIN-QUEST-OUTLINE.md §Moneta key, COMPANIONS.md §Hermit

Отшелникът живее сред кръстове и тишина по-силна от държавна цензура. „Има седма монета. Ще ти я дам, ако докажеш, че не си тук за слава.“

> **[ИЗБОР] Доказателство**  
> **А)** Изброяваш всички жертви, които си спасил, и се отричаш от награда. *(Persuasion DC 14; успех → `item.moneta_key_7`; провал → той мълчи)*  
> **Б)** Предлагаш да оставиш ценен артефакт като залог. *(Donate rare item; Honor DC 12; успех → `trust +10`; провал → артефакт задържан)*  
> **В)** Приемаш изпитание – нощна бдение върху голия камък. *(Endurance DC 15; успех → получаваш ключа; провал → frostbite, health -10)*

> **STATE UPDATE**  
> - `quest_flags.krustova.mystery.hermit = {trusted, denied}`  
> - Reward: `item.moneta_key_7`, `lore_token.hermit_prophecy`, `reputation.church +15`.

---

> **Set Bonus:** При завършени мистерийни куестове `state.krustova.pilgrim_path = open`, което намалява DC за духовни проверки с 2 и отключва сцена „Хоровете на кръстовата нощ“ (foreshadow за кулминацията в Белинташ).
