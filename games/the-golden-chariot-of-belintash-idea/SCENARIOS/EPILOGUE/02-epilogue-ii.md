# ЕПИЛОГ II · СЦЕНИ 126–130 — "ПИСМА И НАСЛЕДНИЦИ"

---

## Сцена 126 — "Писмото на героя"

> **Traceability**: MAIN-QUEST-OUTLINE §551 · SCENARIO-WRITING-PLAN §6.7 · ред #356  
> **Свързани документи**: LORE-CARDS.md §Hidden letter, JOURNAL.md §Final entry

Писмо, забравено в ниша, стига до наследници години по-късно.

> **[ИЗБОР] Кой го намира?**  
> **А)** Внучка на героя. *(unlock `state.epilogue.heir = "granddaughter"`)*  
> **Б)** Млад археолог. *(Lore +5, tension +5)*  
> **В)** Старица от Забърдо, която помни песента. *(Compassion +5)*

> **STATE HOOK**: определя POV за сцени 127–129.

---

## Сцена 127 — "Възраждането на песента"

> **Traceability**: MAIN-QUEST-OUTLINE §552 · SCENARIO-WRITING-PLAN §6.7 · ред #357  
> **Свързани документи**: LORE-CARDS.md §Folk song, AUDIO-SCRIPTS.md §Lament

Наследникът изпява старата песен на Белинташ пред ново поколение.

> **[ИЗБОР] Какво подчертава песента?**  
> **А)** Жертвата на героя. *(emotion +10)*  
> **Б)** Опасността от алчност. *(Foreshadow +5)*  
> **В)** Надеждата за бъдещи пазители. *(morale +5)*

> **STATE UPDATE**: `state.epilogue.song_theme` = sacrifice/greed/hope.

---

## Сцена 128 — "Писмата на археолога"

> **Traceability**: MAIN-QUEST-OUTLINE §553 · SCENARIO-WRITING-PLAN §6.7 · ред #358  
> **Свързани документи**: DOCUMENTARY-SCRIPTS.md §Archive, COMMUNICATION.md §Official report

Археологът пише до Софийския музей: „Открихме символи, които не са от този век.“

> **[ИЗБОР] Как реагира музеят?**  
> **А)** Приемат писмото и започват тайно разследване. *(intel +10)*  
> **Б)** Отхвърлят го като легенда. *(tension -5, но lore -5)*  
> **В)** Пращат отряд да охранява района. *(security +5, intrigue +5)*

> **STATE HOOK**: влияе на финалните кредити/продължения.

---

## Сцена 129 — "Наследниците се събират"

> **Traceability**: MAIN-QUEST-OUTLINE §554 · SCENARIO-WRITING-PLAN §6.7 · ред #359  
> **Свързани документи**: LORE-CARDS.md §Heir circle, WORLD-BIBLE.md §Future hooks

На поляна край Забърдо три семейства (героя, отшелника, гилдията) се срещат.

> **[ИЗБОР] Какъв пакт сключват?**  
> **А)** Да пазят тайната за още сто години. *(state.epilogue.pact = "secrecy")*  
> **Б)** Да обучат нови пазители. *(unlock `quest_hook.next_generation`)*  
> **В)** Да публикуват писмата, но без местоположения. *(intrigue +5, lore +5)*

> **STATE UPDATE**: пактът влияе на бъдещи кампания/продължение.

---

## Сцена 130 — "Финалният кадър"

> **Traceability**: MAIN-QUEST-OUTLINE §555–556 · SCENARIO-WRITING-PLAN §6.7 · ред #360  
> **Свързани документи**: AUDIO-SCRIPTS.md §Credits, LORE-CARDS.md §Legacy image

Камерата се отдръпва: Белинташ в здрач, дъжд пада върху каменни кръгове.

> **[ИЗБОР] Как завършва сцената?**  
> **А)** Надпис: „Тайната оцелява.“ *(mystery +10)*  
> **Б)** Показват се координати, които угасват. *(Foreshadow sequel)*  
> **В)** Песента продължава, докато картината избледнява. *(emotion +10)*

> **STATE UPDATE**  
> - `state.main_quest.current = "epilogue_ii"`  
> - Journal: „Епилог II — Писмата и наследниците“  
> - Подготвя се Епилог III / DLC hook.

---

> **Следва:** Епилог III · Сцени 131–135 "Гласът на археолозите в наши дни".
