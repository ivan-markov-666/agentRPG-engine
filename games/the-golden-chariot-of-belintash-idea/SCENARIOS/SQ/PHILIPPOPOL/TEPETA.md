# ФИЛИПОПОЛ · SIDE QUESTS — ТЕПЕТА (#66–93)

> **Traceability**: SIDE-QUESTS.md §Филипопол — тепета #66–93 · SCENARIO-WRITING-PLAN §7.5 · SCENARIO-TRACEABILITY.md §Side Quests

---

## Небет тепе — Стражевото сърце на Евмолпия

### SQ-PHI-TEPE-66 — „Стражевият резонанс“

> **Свързани документи**: SIDE-QUESTS.md §66, LOCATIONS.md §Небет тепе, MAIN-QUEST-OUTLINE.md §Act III, COMPANIONS.md §Елена

Археоложката Елена говори за камъни така, както Бай Ганьо за политика: „Небет тепе не е руина, а часовник. Помогни ми да чуя как бие.“ Трябва да синхронизираш бронзови шипове и да подредиш отломки по звездната карта на Евмолпия.

> **[ИЗБОР] Как настройваш механизма?**  
> **А)** Использваш триангулация с компаса на Стоян. *(Lore DC 13; успех → `insight.nebet_grid = true`; провал → камък пада, health -5)*  
> **Б)** Намираш духовете на пазачите чрез амулета. *(Spirit DC 14; успех → визия за древен код; провал → шум в главата, tension +5)*  
> **В)** Привличаш учениците от гръцкото училище да помогнат с изчисления. *(Leadership DC 12; успех → `network.scholars +1`; провал → учениците спорят, morale -5)*

> **STATE UPDATE**  
> - `quest_flags.philippopol.tepes.nebet_resonance = completed`  
> - Reward: `lore_token.guardian_watch`, `event.unlock = "Evmolpia_sundial"`

---

### SQ-PHI-TEPE-67 — „Храмът на дриадите“

> **Свързани документи**: SIDE-QUESTS.md §67, LOCATIONS.md §Небет тепе, MAGIC-SPELLS.md §Nature rites, BACHKOVO quests

Жрец от Бачково носи клонка розмарин и икона. „Тук си шепнат светци и дриади. Реши кой ще остане.“ Нужен е баланс между старото капище и новата литургия.

> **[ИЗБОР] Ритуал**  
> **А)** Православна лития. *(Spirit DC 12; успех → `blessing.dryad_shield`; провал → дриадите се ядосват)*  
> **Б)** Езическо приношение с мед и вино. *(Nature DC 13; успех → `buff.nymph_charm`; провал → монасите роптаят)*  
> **В)** Смесена служба с песнопение и гайда. *(Performance DC 14; успех → `unity_token.nebet`; провал → привличаш вниманието на фанатици, encounter)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.dryad_rite = outcome`; Reward според избора (защитен чар или религиозна подкрепа).

---

### SQ-PHI-TEPE-68 — „Пазачите на Евмолп“

> **Свързани документи**: SIDE-QUESTS.md §68, GAME-CAPABILITIES.md §Siege defense, WORLD-BIBLE.md §Brotherhood threats

Стражът на крепостта шепне: „Култовете копаят под стените. Ако ги пуснем, Старият град ще стане дупка като данъчна декларация.“ Време е за нощна обсада.

> **[ИЗБОР] Тактика**  
> **А)** Пряка атака в тунелите. *(Combat DC 14; успех → cultists routed; провал → wound -10 HP)*  
> **Б)** Затлачваш входа с вода от акведукта. *(Engineering DC 13; успех → `state.tunnels_flooded`; провал → наводнение, morale -5)*  
> **В)** Използваш сенките на Небет за засада. *(Stealth DC 12; успех → `advantage.first_round`; провал → аларма)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.nebet_guard = cleared`; Reward: `siege_support.bastion`, `reputation.royal +10`.

---

### SQ-PHI-TEPE-69 — „Димните сигнали“

> **Свързани документи**: SIDE-QUESTS.md §69, TRAVEL-SYSTEM.md §River alerts, ECONOMY.md §Trade nodes

Гилдията на търговците иска сигналите към Марица да не паднат в грешни ръце. Седнеш ли на Небет тепе, виждаш целия град като върху бюрократична карта.

> **[ИЗБОР] Сигнал**  
> **А)** Код „зелено/жълто/червено“. *(Intellect DC 12; успех → търговците благодарят; провал → объркваш флаговете)*  
> **Б)** Имитираш фалшив сигнал, за да заблуждаваш враговете. *(Deception DC 13; успех → `intrigue +5`; провал → стражата те разпитва)*  
> **В)** Давaш сигнал чрез лира и ритъм (музикален код). *(Performance DC 11; успех → `buff.trade_discount`; провал → никой не разбира)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.smoke_signals = set`; Reward: `reputation.merchants +10`, `travel_risk.starfish = -10%`.

> **Set Bonus — Небет тепе**: При завършени #66–69 `state.tepes.nebet = "awakened"`, което дава +2 към Perception проверки в Стария град и отключва event „Нощният съвет на Евмолпия“.

---

## Таксим тепе — Водните огледала на града

### SQ-PHI-TEPE-70 — „Кастелиумът на водата“

> **Свързани документи**: SIDE-QUESTS.md §70, LOCATIONS.md §Таксим тепе, ENGINEERING.md §Aqueducts, TRAVEL-SYSTEM.md §Water supply

Дух на римски инженер не одобрява модерните навици: „Водата се губи, защото винтовете са ръждясали. Срам за Тримонциум.“ Трябва да рестартираш разпределителя.

> **[ИЗБОР] Ремонт**  
> **А)** Смазваш механизма със смес от масло и билки. *(Craft DC 12; успех → `state.aqueduct_flow = restored`; провал → резба се чупи)*  
> **Б)** Използваш магия за налягане. *(Arcana DC 13; успех → +10% вода; провал → пръскане, health -5)*  
> **В)** Намираш доброволци да носат нови тръби от Марково. *(Leadership DC 11; успех → `network.laborers`; провал → забавяне)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.castellum = completed`; Reward: `access.aqueduct_pass`, `travel_restoration +1 action`.

---

### SQ-PHI-TEPE-71 — „Храмът под огледалата“

> **Свързани документи**: SIDE-QUESTS.md §71, RELIGION.md §Cathedral, MAGIC-SPELLS.md §Purification

Катедралният протосингел разказва, че светена вода изчезва: „Някой пълни амфори под алтарите. Или демон, или по-хитър търговец.“

> **[ИЗБОР] Разследване**  
> **А)** Викаш Баба Руска за откриване на магия. *(Spirit DC 12; успех → разкриваш виновник; провал → мирише на дим)*  
> **Б)** Поставяш огледални капани по тунелите. *(Engineering DC 13; успех → `culprit_id = smuggler`; провал → счупваш реликва)*  
> **В)** Водиш открит процес на площада. *(Oratory DC 14; успех → `reputation.church +10`; провал → напрежение)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.taksim_theft = outcome`; Reward: `blessing.flow_guard`, `intrigue +5`.

---

### SQ-PHI-TEPE-72 — „Палатът на Филип“

> **Свързани документи**: SIDE-QUESTS.md §72, MAIN-QUEST-OUTLINE.md §History, NPCS.md §Филип потомци

Потомък на Филип Македонски иска да си върне терена. Наемници копаят и откриват части от древния дворец. Трябва да посредничиш, преди да стане гражданска война.

> **[ИЗБОР] План**  
> **А)** Плащаш откуп и ги изпращаш към друг chantier. *(Economy DC 13; успех → мир; провал → банкрут -10 coins)*  
> **Б)** Предлагаш им да станат охрана на двореца. *(Leadership DC 12; успех → `ally.mercs`; провал → бунт)*  
> **В)** Разкриваш, че наемниците са подкупени от гилдията на сенките. *(Investigation DC 14; успех → `intrigue +10`; провал → те нападат)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.palace = resolved`; Reward: `reputation.nobility +10` или `network.mercs` според избора.

---

### SQ-PHI-TEPE-73 — „Водната засада“

> **Свързани документи**: SIDE-QUESTS.md §73, STEALTH.md §Aqueduct route, GUILD records

Гилдията на сенките ти подава карта на водните тунели: „Има склад с оръжия. Ще влезеш тихо или ще плуваш в съдебни дела.“

> **[ИЗБОР] Инфилтрация**  
> **А)** Пълзиш по сервизните шахти. *(Stealth DC 13; успех → surprise; провал → аларма)*  
> **Б)** Преливаш водата, за да ги изкараш навън. *(Engineering DC 12; успех → +advantage; провал → заливат те)*  
> **В)** Маскираш се като водонос. *(Disguise DC 11; успех → вътре без бой; провал → проверка)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.aqua_ambush = outcome`; Reward: `item.shadow_reservoir`, `stealth_tests +1 die` за градски мисии.

> **Set Bonus — Таксим тепе**: При завършени #70–73 `state.tepes.taksim = "flowing"`, намалява разхода на провизии в града с 25% и отключва event „Огледалата на водата“.

---

## Джамбаз тепе — Хълмът на въжеиграчите

### SQ-PHI-TEPE-74 — „Въжеиграчът на Асен“

> **Свързани документи**: SIDE-QUESTS.md §74, LOCATIONS.md §Джамбаз тепе, HISTORY.md §Battle of Klokotnitsa

Потомък на прочут акробат показва въже, опънато между две къщи: „Навремето тук се поздравяваха царе и въжеиграчи. Да върнем традицията.“

> **[ИЗБОР] Проява**  
> **А)** Лично преминаваш въжето. *(Acrobatics DC 14; успех → `prestige +10`; провал → fall -10 HP)*  
> **Б)** Обучаваш ученици да го направят. *(Leadership DC 12; успех → `talent_pool.acrobats`; провал → уплаха)*  
> **В)** Използваш магия за леко гравитация. *(Arcana DC 13; успех → showstopper; провал → магията свършва насред пътя)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.ropewalker = completed`; Reward: `item.braid_of_balance`.

---

### SQ-PHI-TEPE-75 — „Залезът над Св. Димитър“

> **Свързани документи**: SIDE-QUESTS.md §75, RELIGION.md §St Demetrios, HISTORY.md §Ivan Asen II

Църковен настоятел те води към храма: „Кръстоносците търсят реликви. Ако откраднат мощите, народът ще се отчае.“

> **[ИЗБОР] Защита**  
> **А)** Организираш нощни патрули. *(Combat DC 12; успех → отблъснати; провал → поражение)*  
> **Б)** Преговаряш с кръстоносците. *(Negotiation DC 13; успех → получаваш инфо; провал → дуел)*  
> **В)** Скриваш реликвите с магични печати. *(Spirit DC 14; успех → `relic_safe`; провал → печатът избухва)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.st_dimitrios = defended`; Reward: `blessing.guardian_of_plovdiv`.

---

### SQ-PHI-TEPE-76 — „Тайното училище“

> **Свързани документи**: SIDE-QUESTS.md §76, CULTURE.md §Education, NPCS.md §Учител Димо

Учителите от гръцкото училище искат да скрият книги от цензурата. „Ако ги вземат, децата ще учат само как да броят данъци.“

> **[ИЗБОР] Канал**  
> **А)** Пещерата под тепето. *(Stealth DC 12; успех → книги спасени; провал → патрул)*  
> **Б)** Преписваш ги на миниатюрни свитъци. *(Craft DC 13; успех → `library.microtexts`; провал → черно мастило)*  
> **В)** Използваш Джамбазовите къщи за временно укритие. *(Social DC 11; успех → `reputation.scholars +10`; провал → стопанинът се уплашва)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.secret_school = success`; Reward: `skill_token.academic`.

---

### SQ-PHI-TEPE-77 — „Аполоновите струни“

> **Свързани документи**: SIDE-QUESTS.md §77, MAGIC-SPELLS.md §Music rites, LORE-CARDS.md §Apollo Kendresios

Мистериозен музикант подава древна лира: „Вдигни струните и ще чуеш глас от времето, когато Пловдив се наричаше Пулпудева.“

> **[ИЗБОР] Изпълнение**  
> **А)** Трябва да повториш мелодията по слух. *(Performance DC 14; успех → портал се отваря; провал → струна се къса)*  
> **Б)** Разчиташ резби по колоните. *(Lore DC 13; успех → мелодията става ясна; провал → погрешен ритъм)*  
> **В)** Привличаш Валентин мага за дует. *(Requires `companion Val`; Arcana DC 12; успех → `spell.apollo_resonance`; провал → магът се прегрява)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.apollo_chord = completed`; Reward: `item.lyre_of_echoes`.

> **Set Bonus — Джамбаз тепе**: При завършени #74–77 `state.tepes.dzhambaz = "balanced"`, което дава +2 към Acrobatics/Performance в Стария град и отключва сцена „Асеновият въжен мост“.

---

## Сахат (Данов) тепе — Часовникът на времето

### SQ-PHI-TEPE-78 — „Часовникът на времето“

> **Свързани документи**: SIDE-QUESTS.md §78, LOCATIONS.md §Сахат тепе, HISTORY.md §Clock tower

Часовникарят показва механизъм с повече зъбчати колела от данъчни параграфи. „Маховикът спира, когато градът лъже себе си. Помогни ми да видим бъдещето.“

> **[ИЗБОР] Реглаж**  
> **А)** Настройваш пружината ръчно. *(Engineering DC 13; успех → `prophecy_token.clockwork`; провал → пръсти ранени)*  
> **Б)** Викаш духа на Антонио Барбаджелата. *(Spirit DC 14; успех → точен ход; провал → механиката полудява)*  
> **В)** Пускаш учениците да завъртат колелото. *(Leadership DC 11; успех → +1 morale; провал → те чупят зъбец)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.clock = tuned`; Reward: `token.future_glimpse` (еднократно прехвърля провален check).

---

### SQ-PHI-TEPE-79 — „Барутният склад“

> **Свързани документи**: SIDE-QUESTS.md §79, MILITARY.md §Garrison, WORLD-BIBLE.md §Threats

Стражите мърморят: „Барутът под хълма е по-нервен от чиновник без кафе.“ Слухове за саботаж.

> **[ИЗБОР] Контрамерки**  
> **А)** Проверяваш бъчвите и обезвреждаш фитили. *(Investigation DC 13; успех → безопасно; провал → пожар)*  
> **Б)** Пренасочваш барута в тайни тунели. *(Logistics DC 12; успех → `stock.secured`; провал → османски гарнизон подозира)*  
> **В)** Устройваш засада на саботьорите. *(Combat DC 14; успех → пленници; провал → експлозия -15 HP)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.powder = secured`; Reward: `artillery_support +1 use`.

---

### SQ-PHI-TEPE-80 — „Орфеевият шепот“

> **Свързани документи**: SIDE-QUESTS.md §80, LORE-CARDS.md §Orpheus, AUDIO-SCRIPTS.md §Wind motifs

Бард предлага конкурент на часовника: „Пей и ще чуеш кои павета пазят тайни.“

> **[ИЗБОР] Мелодия**  
> **А)** Изпяваш тракийски химн. *(Performance DC 13; успех → `vision.hidden_tunnel`; провал → гласът пресеква)*  
> **Б)** Комбинираш лира и камбани. *(Engineering + Performance DC 14; успех → `buff.inspire_guard`; провал → камбаните се разстройват)*  
> **В)** Записваш ехото на пергамент. *(Lore DC 12; успех → `scroll.orphic_echo`; провал → нищо не се чува)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.orpheus = completed`; Reward: `morale +5`, `knowledge.streets`.

---

### SQ-PHI-TEPE-81 — „Пътят на Данова“

> **Свързани документи**: SIDE-QUESTS.md §81, NPCS.md §Христо Г. Данов, HISTORY.md §Press

Ученици на Данова пренасят печатарски плочи към новата печатница. „Стражите смятат, че са оръжие. Трябва ни ескорт.“

> **[ИЗБОР] Ескорт**  
> **А)** Създаваш фалшив каруцарски документ. *(Forgery DC 11; успех → безпроблемно; провал → глоба)*  
> **Б)** Разсейваш стражите с публично четене. *(Performance DC 12; успех → публика ги задържа; провал → насъскават те)*  
> **В)** Използваш тунел през часовниковата кула. *(Stealth DC 13; успех → `press_plates_secure`; провал → затворен проход)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.danov_path = success`; Reward: `item.printing_plate`, `reputation.scholars +5`.

> **Set Bonus — Сахат тепе**: При завършени #78–81 `state.tepes.sahat = "synchronized"`, което дава еднократен reroll на провален градски skill check и отключва сцена „Залезът на часовете“.

---

## Бунарджик — Хълмът на освободителите

### SQ-PHI-TEPE-82 — „Хълмът на освободителите“

> **Свързани документи**: SIDE-QUESTS.md §82, LOCATIONS.md §Бунарджик, HISTORY.md §Liberators

Кметът подава плакат: „Готвят саботаж на паметниците. Ако ги съборят, градът ще се раздели като хляб без сол.“

> **[ИЗБОР] Защита**  
> **А)** Организираш доброволци за патрул. *(Leadership DC 12; успех → `civic_morale +10`; провал → хаос)*  
> **Б)** Поставяш капани около паметника. *(Engineering DC 13; успех → `trap_network`; провал → турист пада)*  
> **В)** Преговаряш с провокаторите. *(Persuasion DC 14; успех → тайни мотиви; провал → те изострят ситуацията)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.liberators = defended`; Reward: `state.philippopol.civic_morale +10`.

---

### SQ-PHI-TEPE-83 — „Изворът на Херкулес“

> **Свързани документи**: SIDE-QUESTS.md §83, HYDROLOGY.md §Bunar springs

Пазачът на изворите подсмърча: „Някой сипва отрови. Хората се разболяват.“

> **[ИЗБОР] Действие**  
> **А)** Филтър с билки и въглени. *(Medicine DC 12; успех → очистено; провал → временно решение)*  
> **Б)** Засада на отровителите. *(Stealth DC 13; успех → пленници; провал → бягат)*  
> **В)** Пренасяш извора към друг канал. *(Engineering DC 14; успех → `water_route_new`; провал → изворът отслабва)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.hercules_spring = safe`; Reward: `health_regen +1`, `karma +1`.

---

### SQ-PHI-TEPE-84 — „Любимецът на Народа“

> **Свързани документи**: SIDE-QUESTS.md §84, CIVICS.md §Rallies

Глашатай обявява митинг, но вълк в овча кожа иска да отвлече тълпата.

> **[ИЗБОР] План**  
> **А)** Укрепваш сцената и трибуната. *(Engineering DC 11; успех → crowd safe; провал → паника)*  
> **Б)** Контрашоу с Шаро и музиканти. *(Performance DC 12; успех → morale +5; провал → освирквания)*  
> **В)** Разкриваш подкупените агенти. *(Investigation DC 13; успех → `reputation.villagers +10`; провал → те те нападат)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.people_favorite = success`; Reward: `reputation.cityfolk +10`.

---

### SQ-PHI-TEPE-85 — „Нощта на казематите“

> **Свързани документи**: SIDE-QUESTS.md §85, DUNGEONS.md §Bunardjik tunnels

Ветеранът разказва за пленени съюзници под хълма. „Ако не ги извадим, ще говорят срещу нас.“

> **[ИЗБОР] Спасение**  
> **А)** Пробиваш тайна вентилация. *(Engineering DC 14; успех → stealth entry; провал → срутище)*  
> **Б)** Създаваш бунт сред пленниците. *(Leadership DC 13; успех → те помагат; провал → стражите наказват)*  
> **В)** Използваш алхимичен дим. *(Alchemy DC 12; успех → извличане; провал → задушаване)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.kazemates = freed`; Reward: `map.underground_plovdiv`, `ally.veterans +1`.

> **Set Bonus — Бунарджик**: При завършени #82–85 `state.tepes.bunardzhik = "fortified"`, намалява риска от метежи в града и отключва сцена „Пирът на освободителите“.

---

## Младежки (Джендем) хълм — Песента на недрата

### SQ-PHI-TEPE-86 — „Песента на Кендресийския Аполон“

> **Свързани документи**: SIDE-QUESTS.md §86, LOCATIONS.md §Младежки хълм, MAGIC-SPELLS.md §Hybrid rites

Валентин магът предлага суматоха: „Ще пея за Аполон и ще се моля на Кръста. Ела да държиш ритъма.“

> **[ИЗБОР] Участие**  
> **А)** Свириш на кавал. *(Performance DC 13; успех → `spell.tracian_echo`; провал → фалш)*  
> **Б)** Палиш благовония и четеш псалом. *(Spirit DC 12; успех → `buff.dual_faith`; провал → дим в очите)*  
> **В)** Търсиш древни символи в скалите. *(Investigation DC 14; успех → `lore_token.apollo_gate`; провал → хлъзгане)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.apollo_rite = completed`; Reward: `spell.tracian_echo`.

---

### SQ-PHI-TEPE-87 — „Вратите на ада“

> **Свързани документи**: SIDE-QUESTS.md §87, DUNGEONS.md §Hellmouth

Миньори твърдят, че чуват бучене. „Казват, че там са вратите на ада. Аз казвам, че са вентилационни шахти.“

> **[ИЗБОР] Изследване**  
> **А)** Спускаш се с въжета и факли. *(Athletics DC 13; успех → `hidden_chamber`; провал → burn -5 HP)*  
> **Б)** Използваш звук за картография. *(Engineering DC 12; успех → карта; провал → ехото плаши всички)*  
> **В)** Пращаш Шаро/companion напред. *(Animal Handling DC 11; успех → безопасно; провал → companion frightened)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.hell_gate = mapped`; Reward: `resist.fear +10`.

---

### SQ-PHI-TEPE-88 — „Базиликата в мъглата“

> **Свързани документи**: SIDE-QUESTS.md §88, ARCHAEOLOGY.md §Early basilica

Монах-писар търси помощ за възстановка на базилика, която се появява само в мъгли.

> **[ИЗБОР] Методи**  
> **А)** Почистване с билкови отвари. *(Craft DC 12; успех → стенописи изплуват; провал → боята се разтича)*  
> **Б)** Литургия, за да „закотвиш“ мъглата. *(Spirit DC 13; успех → стабилен вход; провал → мъглата поглъща всичко)*  
> **В)** Оптични инструменти за проследяване. *(Engineering DC 11; успех → `lore_token.basilica`; провал → стъклата се запотяват)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.basilica = restored`; Reward: `blessing.mist_shield`.

---

### SQ-PHI-TEPE-89 — „Джинските светлини“

> **Свързани документи**: SIDE-QUESTS.md §89, FOLKLORE.md §Djinn tales

Децата твърдят, че виждат светлини като джинове. Истината вероятно е по-прозаична, но кой знае?

> **[ИЗБОР] Обяснение**  
> **А)** Фосфоресциращи лишеи. *(Nature DC 12; успех → `item.glowmoss`; провал → плесен)*  
> **Б)** Шегаджии с фенери. *(Investigation DC 11; успех → „виновник“; провал → няма следи)*  
> **В)** Истински духове. *(Spirit DC 13; успех → `ally.djinn_firefly`; провал → уплах)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.djinn = outcome`; Reward: `luck_charm +1`.

> **Set Bonus — Младежки хълм**: При завършени #86–89 `state.tepes.mladeshki = "harmonized"`, дава +2 Spirit проверки срещу страх и отключва сцена „Песента на джендемското ехо“.

---

## Алтъ / Каменица тепе — Спомен за камък и пиво

### SQ-PHI-TEPE-90 — „Песента на каменоделците“

> **Свързани документи**: SIDE-QUESTS.md §90, LOCATIONS.md §Алтъ/Каменица, ECONOMY.md §Masonry

Стар каменоделец иска да спаси последните блокове от разрушеното тепе. „Ще построим нещо ново или поне ще оставим надпис.“

> **[ИЗБОР] Спасяване**  
> **А)** Организираш талиги за извозване. *(Logistics DC 12; успех → `materials.reserve`; провал → тролей катастрофира)*  
> **Б)** Режеш блокове с алхимичен клин. *(Alchemy DC 13; успех → перфектни блокове; провал → експлозия)*  
> **В)** Даваш ги на пивоварната срещу вечен достъп. *(Negotiation DC 11; успех → `ally.brewery`; провал → собствениците се възползват)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.kamenitza_stones = saved`; Reward: `materials.kamenitza`, `reputation.artisans +10`.

---

### SQ-PHI-TEPE-91 — „Гергьовският сбор“

> **Свързани документи**: SIDE-QUESTS.md §91, FESTIVALS.md §Gerovden, ECONOMY.md §Brewery

Пивовар кани народа да възстанови стария сбор. „Без него, бирата е просто напитка, а не песен.“

> **[ИЗБОР] Събитие**  
> **А)** Организираш борба и хора. *(Leadership DC 12; успех → morale +10; провал → бой)*  
> **Б)** Създаваш „занаятчийски пазар“. *(Economy DC 11; успех → `coins +10`; провал → дъжд)*  
> **В)** Пишеш нова песен за Каменица. *(Performance DC 13; успех → `song.kamenitza`; провал → публика се смее)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.gergana = celebrated`; Reward: `buff.feast_kamenitza`.

> **Set Bonus — Каменица**: При завършени #90–91 `state.tepes.kamenitza = "remembered"`, което намалява цената на строителни материали с 10% и отключва сцена „Песента на каменоделците“.

---

## Лаут тепе — Войнушкото селище

### SQ-PHI-TEPE-92 — „Стражите на Лаут“

> **Свързани документи**: SIDE-QUESTS.md §92, LOCATIONS.md §Лаут тепе (воинушко селище), MILITIA.md §Voinuks

Войнушкото старейшинство иска помощ срещу набег. „Ние пазим пътищата, но гарнизонът е далече.“

> **[ИЗБОР] Отбрана**  
> **А)** Строиш дървени щитове и ровове. *(Engineering DC 12; успех → `defense_bonus`; провал → нелепи конструкции)*  
> **Б)** Тренираш войнушките семейства. *(Leadership DC 13; успех → `ally.voinuks`; провал → контузии)*  
> **В)** Пращаш сигнал към Бунарджик. *(Travel DC 11; успех → подкрепления; провал → стражите закъсняват)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.laut_defense = held`; Reward: `ally.voinushko_selo`, `reputation.militia +10`.

---

### SQ-PHI-TEPE-93 — „Оброчната плочка“

> **Свързани документи**: SIDE-QUESTS.md §93, ARCHAEOLOGY.md §Thraco-Roman, LOCATIONS.md §Лаут тепе

Археолог търси оброчна плочка на тракийския конник, скрита в отминалото селище. Контрабандисти я дебнат.

> **[ИЗБОР] Състезание**  
> **А)** Преравяш руините с войнушките деца. *(Investigation DC 12; успех → намирате; провал → губите време)*  
> **Б)** Установяваш засада на контрабандистите. *(Stealth DC 13; успех → арести; провал → битка)*  
> **В)** Примамваш ги с фалшива плочка. *(Deception DC 14; успех → `intrigue +10`; провал → те открадват фалшификата и се усъмняват)*

> **STATE UPDATE**: `quest_flags.philippopol.tepes.laut_votive = secured`; Reward: `artifact.trakian_tablet`, `karma +1`.

> **Set Bonus — Лаут тепе**: При завършени #92–93 `state.tepes.laut = "steadfast"`, unlocks new travel hub „Войнушко селище Лаут" и намалява пътните DC между Филипопол и Тракия с 2.

---

> **Grand Set Bonus — Тримонциум**: Завърши всички тепетни куестове (#66–93), за да активираш `state.philippopol.tepes_unity = true`, което намалява DC за градски intrigue/stealth проверки с 3, отключва сцена „Съветът на трите хълма“ и дава избор как да използваш легендите (support main quest infiltration, morale boost, или магическо предупреждение за Act V).
