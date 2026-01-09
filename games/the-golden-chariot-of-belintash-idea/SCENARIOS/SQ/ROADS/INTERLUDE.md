# МЕЖДИННИ РЕГИОНИ · SIDE QUESTS — ПЪТНИ СЦЕНИ (#61–65)

> **Traceability**: SIDE-QUESTS.md §Междинни региони #61–65 · SCENARIO-WRITING-PLAN §7.8 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-TRAIL-61 — "Търговецът и бандитите"

> **Свързани документи**: SIDE-QUESTS.md §61, LOCATIONS.md §Път Каменица↔Мостово, NPCS.md §Търговец Димчо, ENCOUNTERS.md §Bandits

На завоя преди Мостово търговската кола е блокирана. Бандитът маха като бирник: „Данък за преминаване!“ Търговецът трепери, сякаш дължи сметка на две вдовици.

> **[ИЗБОР] Намеса**  
> **А)** Директен бой. *(Combat DC 12; 3 разбойника HP 35; успех → `loot.bandit_cache`; провал → wound -10 HP)*  
> **Б)** Разсейване – преструваш се на царски писар. *(Deception DC 12; успех → бандитите бягат; провал → гняв, +initiative)*  
> **В)** Преговори за разсрочка. *(Negotiation DC 11; успех → търговецът плаща символично; провал → репутация царска власт -5)*

> **STATE UPDATE**: `quest_flags.trails.bandits = resolved`; Reward: `merchant_discount +5%`, `information.road_conditions`.

---

## SQ-TRAIL-62 — "Изгубеният керван"

> **Свързани документи**: SIDE-QUESTS.md §62, LOCATIONS.md §Проход към Станимака, TRAVEL-SYSTEM.md §Mountain weather

Мъгла като прокурорско досие е обвила прохода. Керванът липсва. Само счупени колела и следи в снега.

> **[ИЗБОР] Търсене**  
> **А)** Следиш следите нагоре. *(Survival DC 13; успех → намираш кервана в клисура; провал → лавина, health -5)*  
> **Б)** Използваш ехо-свирка да повикаш каруцарите. *(Performance DC 12; успех → чуват; провал → вълци идват)*  
> **В)** Пращаш Шаро/companion да обходи възвишенията. *(Requires companion; Animal Handling DC 11; успех → бързо откриване)*

> **Encounter:** Замръзнали наемници (HP 30) + 2 вълка. Спасението → `coins +20`, `reputation.traders +10`, unlock `fast_travel.pass`.

---

## SQ-TRAIL-63 — "Мостът на духовете"

> **Свързани документи**: SIDE-QUESTS.md §63, LOCATIONS.md §Римски мост, MAGIC-SPELLS.md §Water spirits, AUDIO-SCRIPTS.md §River whispers

Нощем мостът бучи като заседание на сенатори. Воден дух настоява за разговор: „Пътниците забравиха да благодарят. Напомни им, иначе ще взема мостовете.“

> **[ИЗБОР] Ритуал**  
> **А)** Хвърляш монети и четеш молитва. *(Spirit DC 11; успех → духът омеква; провал → водата стяга, travel DC +2)*  
> **Б)** Предлагаш история за Белинташ, записана на пергамент. *(Lore DC 12; успех → получаваш `lore_token.river_secret`; провал → духът иска още)*  
> **В)** Командваш пътници да почистят и украсят моста. *(Leadership DC 11; успех → `reputation.villagers +5`; провал → тълпата роптае)*

> **STATE UPDATE**: `quest_flags.trails.spirit_bridge = appeased`; Reward: `information.water_routes`, `morale +5`.

---

## SQ-TRAIL-64 — "Въглищарят и вълците"

> **Свързани документи**: SIDE-QUESTS.md §64, LOCATIONS.md §Гора Каменица↔Мостово, BESTIARY.md §Wolves, NPCS.md §Димо въглищарят

Димо пази колибата си с тояга и смях: „Вълците мислят, че въглищата са печено. Помогни, преди да станат готвачи.“

> **[ИЗБОР] Тактика**  
> **А)** Асистираш в отбраната с огнени ями. *(Engineering DC 12; успех → wolves deterred; провал → fire spreads)*  
> **Б)** Мамаеш вълците с вълчи вой и примамка. *(Animal Handling DC 13; успех → ги пращаш другаде; провал → те атакуват)*  
> **В)** Придружаваш Димо до Каменица за помощ. *(Travel DC 11; успех → escort success; провал → random encounter)*

> **Encounter:** 4 вълка HP 30. Победа → `food_supply +1`, `campfire_bonus`, `lore_token.charcoal_path`.

---

## SQ-TRAIL-65 — "Кръстопътят"

> **Свързани документи**: SIDE-QUESTS.md §65, LOCATIONS.md §Гора център, MAGIC-SPELLS.md §Spirit riddles, AUDIO-SCRIPTS.md §Wind chimes

На кръстопът между три пътеки стои дух без сянка. „Има три пътя: минало, настояще, бъдеще. Избери и отговори на загадката.“

> **[ИЗБОР] Отговор**  
> **А)** Минал път – цитираш историята на дядовата карта. *(Lore DC 12; успех → `hidden_path.old_patrol`; провал → духът те връща)*  
> **Б)** Настоящ път – описваш текущата мисия с честност. *(Honor DC 11; успех → buff „clarity"; провал → духът намалява morale)*  
> **В)** Бъдещ път – предсказваш финала на Белинташ. *(Spirit DC 13; успех → `vision.path_choice`; провал → времева дезориентация, tension +5)*

> **STATE UPDATE**: `quest_flags.trails.crossroad = chosen_path`; Reward: `map.secret_trail`, `karma +1`, unlock `event.crossroads_echo` (може да промени Act V сцена).

---

> **Set Bonus:** При завършени пътни куестове `state.trails.safe_corridor = true`, което намалява random encounters по всички маршрути с 25% и отключва сцена „Кервани под звездите“ (party morale +10, travel speed +1 сегмент за следващото придвижване).
