# СТАНИМАКА · SIDE QUESTS — МИСТЕРИЯ (#32–34)

> **Traceability**: SIDE-QUESTS.md §Станимака мистерия #32–34 · SCENARIO-WRITING-PLAN §7.3 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-STA-MYST-32 — "Фалшивите монети"

> **Свързани документи**: SIDE-QUESTS.md §32, LOCATIONS.md §Занаятчийски квартал, ECONOMY.md §Currency flow, NPCS.md §Димитър Ковачът

Димитър тряска чук по наковалнята така, сякаш чува обвиненията като данъчен ревизор. „Не съм аз, но ако не докажем, че не съм, ще ме обесят върху собствените ми клещи.“

> **[ИЗБОР] Разследваш как?**  
> **А)** Анализираш монетите в неговата ковачница. *(Craft/Investigation DC 13; успех → "сплавта съдържа калай" → води към гръцкия квартал)*  
> **Б)** Следиш търговеца, който ги разпространява. *(Stealth DC 12; успех → откриваш тайна преса във вино изба)*  
> **В)** Уговаряш Теофил да направи алхимичен тест. *(Negotiation DC 11 + 3 coins; успех → веществото сочи към царски склад)*

> **STATE UPDATE**  
> - `quest_flags.stanimaka.mystery.fake_coins = culprit_id`  
> - Reward: `weapon_upgrade.free = true`, `reputation.merchants +15`, `intrigue +5` ако разкриеш вътрешни хора.

---

## SQ-STA-MYST-33 — "Изчезналата невеста"

> **Свързани документи**: SIDE-QUESTS.md §33, LOCATIONS.md §Предградия, WORLD-BIBLE.md §Samodiva lore, AUDIO-SCRIPTS.md §Wedding lament

Младоженецът плаче с такава енергия, че би разплакал и Бай Ганьо. „Вечерта преди сватбата тя изчезна. Оставила венец и перо.“

> **[ИЗБОР] Теория**  
> **А)** Убеждаваш стражата да отвори архивите за бегълци. *(Persuasion DC 12; успех → следа към търговец; провал → бюрокрация -10 morale)*  
> **Б)** Събираш момински дружки за нощно дирене край реката. *(Leadership DC 11; успех → намираш стъпки към самодивско хорище)*  
> **В)** Правиш ритуал с венец и перо, за да видиш видение. *(Spirit DC 14; успех → виждаш, че е отвлечена от ревнив маг; провал → получаваш hallucinatory debuff)*

> **STATE UPDATE**  
> - `quest_flags.stanimaka.mystery.bride = {ran_away, kidnapped, enchanted}`  
> - Reward: `coins +10`, `reputation.villagers +10`, и unlock допълнителен куест според изхода (напр. спасение от самодиви или дуел с магьосник).

---

## SQ-STA-MYST-34 — "Духът в кръчмата"

> **Свързани документи**: SIDE-QUESTS.md §34, LOCATIONS.md §Гостилница „Златен петел“, AUDIO-SCRIPTS.md §Ghost knocks, MAGIC-SPELLS.md §Exorcism lite

Кръчмарят шепти: „Нощем някой чука по масите и излива вино. Клиентите мислят, че е дух, а аз мисля за банкрут.“

> **[ИЗБОР] Обяснение**  
> **А)** Настройваш нощна стража с механици и звънци. *(Engineering DC 12; успех → хващаш prankster; провал → духът се ядосва, хвърля бутилки)*  
> **Б)** Призоваваш духа чрез стар тост и четене от дневника на кръчмата. *(Lore/Spirit DC 13; успех → дух на бивш пияница, иска незавършен дълг)*  
> **В)** Викаш Баба Руска за „дестилационен екзорсизъм“. *(Requires reputation с Горнослав ≥0; успех → buff „Spirits appeased"; провал → Руска се смее, че духът има по-добър вкус от нас)*

> **STATE UPDATE**  
> - `quest_flags.stanimaka.mystery.tavern_ghost = resolved`  
> - Reward: `free_board.stanimaka = true (3 rests)`, `inventory.special_wine`, `karma +1` ако помириш духа.

---

> **Set Bonus:** Всички мистерийни куестове завършени → `state.stanimaka.conspiracy_web = mapped`, намалява DC за бъдещи intrigue проверки в града с 2 и отключва сцена „Нощните пазари шушукат тайни“ (foreshadow към Act III).
