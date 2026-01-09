# СТАНИМАКА · SIDE QUESTS — ПОМОЩ (#25–28)

> **Traceability**: SIDE-QUESTS.md §Станимака помощ #25–28 · SCENARIO-WRITING-PLAN §7.3 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-STA-HELP-25 — "Пакетът на Никифор"

> **Свързани документи**: SIDE-QUESTS.md §25, LOCATIONS.md §Станимака, NPCS.md §Никифор, TRAVEL-SYSTEM.md §Stanimaka↔Бачково

Никифор, гръцки търговец с мустак като подпис, ти бута дървена кутия: „До Бачково, без да я отваряш. Ако беше лесно, щях да пратя гълъб, а не герой.“

> **[ИЗБОР] Как пазиш пакета?**  
> **А)** Заключваш го в скрит джоб и вървиш сам. *(Stealth DC 12; успех → `package_status = secure`; провал → джебчия краде 1 coin)*  
> **Б)** Наемаш двама стражи от пазара. *(Costs 5 coins; Leadership DC 10 за координация; успех → `threat -5`; провал → стражите спорят, tension +5)*  
> **В)** Използваш тайния куриерски маршрут през лозята. *(Requires `lore_token.bachkovo_path`; Athletics DC 11; успех → време -1 сегмент)*

> **STATE UPDATE**  
> - `quest_flags.stanimaka.help.nikifor_package = {delivered, opened}`  
> - Reward: `coins +10` + intel hook (ако не отваряш) или `artifact_fragment` но `reputation.merchants -5` (ако бръкнеш).

---

## SQ-STA-HELP-26 — "Изгубеният документ"

> **Свързани документи**: SIDE-QUESTS.md §26, LOCATIONS.md §Пазар/кръчма, GAME-CAPABILITIES.md §Investigations, AUDIO-SCRIPTS.md §Market hum

Търговецът Йосиф стиска празни ръце: „Документът ми е по-важен от това да се къпя на Спасов ден. Изчезна между глътките в „Златния петел“.“

> **[ИЗБОР] Следа**  
> **А)** Разпитваш кръчмаря и записваш показания. *(Persuasion DC 11; успех → насочва те към каруцар; провал → получаваш сметка)*  
> **Б)** Претърсваш масите със скрити знаци. *(Investigation DC 12; успех → намираш восъчно петно → документ в дъното на бъчва)*  
> **В)** Проследяваш подозрителен пияница до заден двор. *(Stealth DC 11; успех → документът е в чантата му; провал → мини-бой, health -5)*

> **STATE UPDATE**  
> - `quest_flags.stanimaka.help.lost_document = completed`  
> - Reward: `coins +5`, `reputation.merchants +5`, unlock `trade_discount.stanimaka = -5%`

---

## SQ-STA-HELP-27 — "Болният кон"

> **Свързани документи**: SIDE-QUESTS.md §27, LOCATIONS.md §Занаятчийски квартал, COMPANIONS.md §Теофил, GAME-CAPABILITIES.md §Animal care

Каруцарят гледа коня си така, както чиновник гледа недовършен отчет: „Без него няма да стигна до Филипопол. Може ли магия или мехлем?“

> **[ИЗБОР] Лечение**  
> **А)** Смесваш билки с помощта на Калина. *(Medicine DC 12; успех → `state.horse_health = stable`; провал → tension +5)*  
> **Б)** Убеждаваш Теофил да приложи алхимична инжекция. *(Requires `reputation.greek_quarter ≥ 0`; Negotiation DC 13; успех → buff „swift hooves"; провал → Теофил иска 5 coins)*  
> **В)** Правиш механична шина за крака. *(Craft DC 11; успех → unlock blueprint „cart suspension"; провал → счупен инструмент)*

> **STATE UPDATE**  
> - `quest_flags.stanimaka.help.sick_horse = completed`  
> - Reward: `travel.pass_to_philippopolis = free ride`, `companion_affinity.cart_driver +5`

---

## SQ-STA-HELP-28 — "Децата сираци"

> **Свързани документи**: SIDE-QUESTS.md §28, LOCATIONS.md §Църква „Св. Богородица Петричка“, NPCS.md §Отец Павел, ECONOMY.md §Charity mechanics

Свещеникът те посреща с умора, която не може да се изповяда: „Три деца без дом. Ако беше хроника, щях да напиша жалейка. Помогни им.“

> **[ИЗБОР] Решение**  
> **А)** Организираш благотворителна трапеза на площада. *(Leadership DC 12; успех → `morale.villagers +10`; провал → разход 5 coins)*  
> **Б)** Договаряш майстор от занаятчийския квартал да ги приеме чираци. *(Negotiation DC 13; успех → `state.orphans_adopted = true`; провал → репутация църква -5)*  
> **В)** Използваш лични средства и амулет за защита. *(Donate ≥8 coins; Spirit DC 11 → `blessing.child_guard = true`)*

> **STATE UPDATE**  
> - `quest_flags.stanimaka.help.orphans = completed`  
> - Reward: `reputation.church +20`, `karma +2`, unlock `festival_hook = "Feast of Mercy"`

---

> **Set Bonus:** Всички помощни куестове в Станимака активират `state.stanimaka.community_support = true`, което намалява цените на пазара с 5% и отключва сцена „Хоровете на благодарността“ (еднократен morale buff +10 за party).
