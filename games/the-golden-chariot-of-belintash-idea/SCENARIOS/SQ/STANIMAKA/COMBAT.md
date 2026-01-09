# СТАНИМАКА · SIDE QUESTS — БОЙ (#29–31)

> **Traceability**: SIDE-QUESTS.md §Станимака бой #29–31 · SCENARIO-WRITING-PLAN §7.3 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-STA-CBT-29 — "Турнирът на силните"

> **Свързани документи**: SIDE-QUESTS.md §29, LOCATIONS.md §Станимака пазар, GAME-CAPABILITIES.md §Arena rules, AUDIO-SCRIPTS.md §Drums of trial

Обявление на площада гласи: „Градът търси герой, не статистик.“ Турнирът включва три рунда: ръкопашен бой, оръжие и демонстрация на ловкост. Публиката вика като на заседание на Народното събрание.

> **[ИЗБОР] Подход към турнира**  
> **А)** Изцяло честен бой. *(Athletics DC 14, Weapons DC 13; успех → `title = "Защитник на Станимака"`; провал → wound -15 HP)*  
> **Б)** Смес от магия и хитрост. *(Requires spell slot; Arcana DC 13; успех → врагът ослепява 1 r.; провал → магът-съдия те порицава, tension +10)*  
> **В)** Договорка с ковача Димитър за специално оръжие. *(Costs 8 coins; Craft DC 11; успех → +5 dmg първи рунд)*

> **Encounter flow:** Рунд 1 – борец (HP 60), Рунд 2 – мечоносец (HP 55), Рунд 3 – елитен боец (HP 70). Между рундовете можеш да лекуваш 1 действие. Победа → `reward.coins +50`, нов меч "Гласът на Арда".

> **STATE UPDATE**: `quest_flags.stanimaka.combat.tournament = {won, lost}`; допълнителни бонуси: `reputation.royal +20` при победа.

---

## SQ-STA-CBT-30 — "Бандата на Лисицата"

> **Свързани документи**: SIDE-QUESTS.md §30, LOCATIONS.md §Околностите, BESTIARY.md §Humans, NPCS.md §Капитан на стражата

Капитанът ти подава карта: „Лисицата и хората му режат каравани като данъчни оценки. Искам им оръжията на масата.“

> **[ИЗБОР] План**  
> **А)** Нощна засада край стария мост. *(Stealth DC 13; успех → изненадващ рунд; провал → бандитите са готови)*  
> **Б)** Псевдо-преговори, за да ги събереш наведнъж. *(Deception DC 14; успех → all bandits clustered, +area dmg; провал → tension +10)*  
> **В)** Обединяваш селски опълченци. *(Leadership DC 12; успех → 2 NPC allies HP 30; провал → morale villagers -5)*

> **Encounter:** Лисицата (HP 75, dual wield, ability "Feint"), +3 bandits (HP 40). Ако бъде хванат жив → unlock `interrogation_hook.vulchan`. Победа → `coins +10`, `reputation.royal +15`, `inventory.bandit_cache`.

> **STATE UPDATE**: `quest_flags.stanimaka.combat.fox_band = {defeated, escaped}`.

---

## SQ-STA-CBT-31 — "Дуелът на честта"

> **Свързани документи**: SIDE-QUESTS.md §31, LOCATIONS.md §Гръцки квартал, GAME-CAPABILITIES.md §Duel rules, AUDIO-SCRIPTS.md §String tension

Благородник с перо на шапката те предизвиква, защото си „оскърбил“ честта му (спор за вино). Дуелиратe се при изгрев пред Петричката крепост.

> **[ИЗБОР] Отговор**  
> **А)** Приемаш честно. *(Honor +5; Sword DC 13; успех → `reputation.royal +10`; провал → `reputation.royal -5`, wound -10 HP)*  
> **Б)** Предлагаш duel-by-proxy (Стоян или друг companion). *(Requires companion; Loyalty DC 12; успех → companion affinity +5; провал → companion gets hurt)*  
> **В)** Опитваш се да медицираш вместо бой. *(Negotiation DC 14; успех → конфликт решен, `intrigue +5`; провал → duel anyway but -2 initiative)*

> **Encounter:** 1 Noble Duelist HP 65, has riposte ability. Ако спечелиш с чест → получаваш токен за достъп до царската гвардия. Ако убиеш без милост → `karma -2`, tension +10.

> **STATE UPDATE**: `quest_flags.stanimaka.combat.duel = outcome (honor_win, dishonor, draw)`.

---

> **Set Bonus:** Всички бойни куестове завършени → `state.stanimaka.security = fortified`, което намалява random encounter rate в града с 50% и отключва сцена „Гвардейските фанфари“ (party morale +10, reputation.royal +5).
