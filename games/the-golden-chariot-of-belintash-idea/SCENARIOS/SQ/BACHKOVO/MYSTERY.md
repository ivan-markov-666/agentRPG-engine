# БАЧКОВСКИ МАНАСТИР · SIDE QUESTS — МИСТЕРИЯ (#40–41)

> **Traceability**: SIDE-QUESTS.md §Бачково мистерия #40–41 · SCENARIO-WRITING-PLAN §7.4 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-BACH-MYST-40 — "Тайната на Клувията"

> **Свързани документи**: SIDE-QUESTS.md §40, LOCATIONS.md §Клувията, MAIN-QUEST-OUTLINE.md §Act III hooks, LORE-CARDS.md §MonetaKey02

Брат Теодосий, по-сух от пергамент и по-мъдър от данъчен инспектор, те води към Клувията. „Тук светлината пада под ъгъл, който не търпи лъжи. Ако издържиш бдението, ще чуеш гласове по-древни от нашата азбука.“

> **[ИЗБОР] Фаза I — Подготовка**  
> **А)** Пости и мълчание 24 часа. *(Willpower DC 13; успех → -2 DC за следващите проверки; провал → exhaustion -5 HP)*  
> **Б)** Алхимичен еликсир за видения. *(Requires `inventory.vision_tonic`; Spirit DC 12; успех → виждаш символи; провал → халюцинации, tension +5)*  
> **В)** Набавяш древни псалми от библиотеката и ги рецитираш. *(Lore DC 12; успех → `chant_resonance = true`; провал → псалмът се прекъсва от гръм)

> **[ИЗБОР] Фаза II — Бдение**  
> **А)** Стоиш под светлинния лъч и наблюдаваш сенките. *(Perception DC 14; успех → откриваш вдлъбнатина → Монета-ключ #2; провал → ослепителна светлина, health -10)*  
> **Б)** Медитираш и оставяш амулета да резонира. *(Spirit DC 14; успех → визия за тракийски ритуал, `lore_token.kluvia`; провал → духове шептят лъжи)*  
> **В)** Провеждаш мини-ритуал с Теодосий, като активираш вода и огън. *(Requires companion маг; Arcana DC 13; успех → `state.moneta_key_2 = obtained`; провал → пожар, tension +10)*

> **STATE UPDATE**  
> - `quest_flags.bachkovo.mystery.kluvia = completed`  
> - Reward: `item.moneta_key_2`, `vision.act_iv_hint`, `reputation.church +15`.

---

## SQ-BACH-MYST-41 — "Старият дневник"

> **Свързани документи**: SIDE-QUESTS.md §41, LOCATIONS.md §Библиотека, LORE-CARDS.md §Brotherhood, AUDIO-SCRIPTS.md §Whispered pages

Между прашни фолианти намираш дневник на монах от 1220 г. Писмеността е смесена — славянска и гръцка. Между редовете се появява мастило, което не иска да стои неподвижно.

> **[ИЗБОР] Разшифриране**  
> **А)** Ползваш химическа лампа, за да видиш скритите знаци. *(Engineering DC 12; успех → координати на тайник; провал → страницата почернява)*  
> **Б)** Молиш брат Теодосий да помага, но обещаваш discretion. *(Negotiation DC 11; успех → получаваш две секции; провал → той отказва, reputation.church -5)*  
> **В)** Викаш духа на автора чрез молитва и ладанка. *(Spirit DC 13; успех → диалог за Братството; провал → смразяваща визия, tension +5)*

> **[ИЗБОР] Последици**  
> **А)** Споделяш откритието с игумена. *(Honor +5; unlock `church_support_actIII`; но intrigue -5)*  
> **Б)** Задържаш копие за себе си. *(Gain `lore_token.brotherhood_diary`; но `reputation.church -5`)*  
> **В)** Пращаш препис на съюзник в Станимака. *(Intrigue DC 12; успех → `network.intel +1`; провал → писмото е прихванато)*

> **STATE UPDATE**  
> - `quest_flags.bachkovo.mystery.diary = {public, secret, shared}`  
> - Reward: `information.brotherhood_routes`, `map.hidden_chapel`, `intrigue +5` (ако задържиш)

---

> **Set Bonus:** При завършени мистерийни куестове `state.bachkovo.esoteric_circle = true`, което намалява DC за магически проверки в манастира с 2 и отключва сцена „Полунощното съвещание на монасите“ (foreshadow за Act IV).
