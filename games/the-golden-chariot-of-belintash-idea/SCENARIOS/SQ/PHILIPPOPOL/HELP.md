# ФИЛИПОПОЛ · SIDE QUESTS — ПОМОЩ (#42–45)

> **Traceability**: SIDE-QUESTS.md §Филипопол помощ #42–45 · SCENARIO-WRITING-PLAN §7.5 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-PHI-HELP-42 — "Библиотеката на Елена"

> **Свързани документи**: SIDE-QUESTS.md §42, LOCATIONS.md §Градска библиотека, NPCS.md §Елена, MAIN-QUEST-OUTLINE.md §Act IV research

Елена те посреща с очи по-остри от перо. „Забранената секция пази карти за Белинташ. Ще ми помогнеш, нали? Ако бях чиновник, щях да подкупя архива, но съм учен.“

> **[ИЗБОР] Достъп**  
> **А)** Подправяш писмо от царската канцелария. *(Forgery DC 13; успех → `access.pass = granted`; провал → `intrigue -5`, tension +5)*  
> **Б)** Влизаш през покрива по нощите. *(Athletics DC 12 + Stealth 12; успех → `lore_token.library`; провал → стражи те гонят, health -10)*  
> **В)** Убеждаваш библиотекаря, че правиш дарение. *(Negotiation DC 11 + 5 coins; успех → половин ден достъп; провал → отнемат монети без достъп)*

> **STATE UPDATE**  
> - `quest_flags.philippopol.help.elena_library = completed`  
> - Reward: `companion_unlock.elena`, `research.draughts_of_belintash`, `reputation.scholars +10`.

---

## SQ-PHI-HELP-43 — "Бащата на Елена"

> **Свързани документи**: SIDE-QUESTS.md §43, NPCS.md §Болярин Петър, ROMANCE.md §Elena arc, ECONOMY.md §Dowries

Болярин Петър счита теб за неканен коментар в протокол. „Дъщеря ми ще се омъжи по какъвто ред кажа аз. Друго?“

> **[ИЗБОР] Подход**  
> **А)** Политическо убеждаване – показваш колко полезен е изследователят Елена за царството. *(Persuasion DC 14; успех → `state.elena_family = appeased`; провал → tension +10)*  
> **Б)** Организираш дуел на аргументи с логос и цитати. *(Lore/Oratory DC 13; успех → боляринът отстъпва; провал → той забранява срещи)*  
> **В)** Помагаш на Елена да подготви бягство/скрит брак. *(Stealth DC 12 + Travel DC 12; успех → unlock „Elena on the run" акт; провал → преследване, risk +15)*

> **STATE UPDATE**  
> - `quest_flags.philippopol.help.elena_father = outcome (approved, forbidden, runaway)`  
> - Reward: `reputation.nobility +/-`, `romance_progress.elena +1`, или `intrigue +5`.

---

## SQ-PHI-HELP-44 — "Благородникът и дългът"

> **Свързани документи**: SIDE-QUESTS.md §44, LOCATIONS.md §Гръцки квартал, ECONOMY.md §Debt mechanics, NPCS.md §Лихварят Салмон

Млад благородник Алексий ти шепне като човек, който говори с банкнотите си: „Лихварят Салмон ме притиска. Ако не платя, ще разкаже тайните ми.“

> **[ИЗБОР] Решение**  
> **А)** Плащаш част от дълга с токен от царската каса. *(Costs 10 coins; Persuasion DC 11 → `debt_reduced`; провал → Салмон иска лихва)*  
> **Б)** Доказваш, че договорът е незаконен. *(Law DC 13; успех → `state.debt_void`; провал → прокурорите те гледат накриво)*  
> **В)** Инсценираш „кражба“ на дълговия свитък. *(Stealth DC 12; успех → доказателство изчезва; провал → охрана те ранява)*

> **STATE UPDATE**  
> - `quest_flags.philippopol.help.noble_debt = resolved`  
> - Reward: `access.royal_court = true`, `reputation.nobility +10`, `intrigue +5` (ако е тайно).

---

## SQ-PHI-HELP-45 — "Просякът философ"

> **Свързани документи**: SIDE-QUESTS.md §45, LOCATIONS.md §Тракийски квартал, LORE-CARDS.md §Ancient scholars, COMPANIONS.md §Philosopher

Пред портите на библиотеката стои просяк с акцент като лекция в Константинопол. „Те ме забравиха, а аз помня руините под града. Дай ми шанс да ги покажа.“

> **[ИЗБОР] Подкрепа**  
> **А)** Даваш му чисти дрехи и го отвеждаш при Елена. *(Charisma DC 11; успех → `ally.philosopher = guide`; провал → пазачите го гонят)*  
> **Б)** Финансираш малка школа на улицата. *(Donate 8 coins; Leadership DC 12; успех → `reputation.commons +10`; провал → учениците бягат)*  
> **В)** Следваш го в подземните тунели, за да провериш знанието му. *(Exploration DC 13; успех → `map.under_plovdiv`; провал → мини капан, health -10)*

> **STATE UPDATE**  
> - `quest_flags.philippopol.help.philosopher = completed`  
> - Reward: `companion_hook.philosopher`, `lore_token.ancient_cisterns`, `karma +1`.

---

> **Set Bonus:** При завършени помощни куестове `state.philippopol.civic_support = true`, което намалява административните такси в града с 10% и отключва сцена „Фестивалът на трите хълма“ (party morale +10, intrigue +5).
