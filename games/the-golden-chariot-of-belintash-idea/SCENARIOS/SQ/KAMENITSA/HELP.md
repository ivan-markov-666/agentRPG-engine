# КАМЕНИЦА · SIDE QUESTS — ПОМОЩ (#1–5)

> **Traceability**: SIDE-QUESTS.md §Каменица помощ #1–5 · SCENARIO-WRITING-PLAN §7.2 ред #366 · SCENARIO-TRACEABILITY.md §1.8

---

## SQ-KAM-HELP-01 — "Мишките в избата"

> **Свързани документи**: LOCATIONS.md §Механата "Синята перра", CHARACTERS.md §Петър Механджията, GAME-CAPABILITIES.md §Crafting/Traps

Петър те води в избата, където мишките са устроили бал, по-шумен от театър на Бай Ганьо. Сиренето е нагризано като проект на чиновник, а буретата стенат.

> **[ИЗБОР] Как гониш мишките?**  
> **А)** Смесваш билки на Калина и правиш димящ репелент. *(Alchemy DC 10, успех → `inventory.note = "herbal_repellent"`; провал → cough → health -5)*  
> **Б)** Подреждаш механични капани от ковашкия шиш на Стоян. *(Engineering DC 11, успех → `state.kamenitsa.tavern_clean = true`; провал → Петър се смее, reputation -2)*  
> **В)** Пускаш Шаро да организира лов. *(Requires companion Шаро; ако успее — `companion_affinity.sharo +5`, tension -5)

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.help.mice = completed`  
> - Reward: `inventory.coins += 5`, `state.buff.free_meals = 3 days`  
> - Journal entry: „Почистих мишките на Петър“

---

## SQ-KAM-HELP-02 — "Изгубената овца"

> **Свързани документи**: SIDE-QUESTS.md §2, LOCATIONS.md §Каменица околности, BESTIARY.md §Вълци, TRAVEL-SYSTEM.md §Forest clearings

Овчарят Илия държи гегата като съдия перо. „Овцата ми изчезна, а без нея стадото е като чиновник без печат“.

> **[ИЗБОР] Как търсиш овцата?**  
> **А)** Следваш следи в калта. *(Survival DC 12 → успех: намираш овцата до ягодова поляна)*  
> **Б)** Използваш амулета, за да чуеш меещия страх. *(Spirit DC 10 → успех: амулетът показва посока, но tension +3)*  
> **В)** Организираш селско издирване. *(Leadership DC 11 → успех: villagers assist, unlock rumor „Светлините на хълма“)

> **Encounter:** ако хвърлиш 1 на d6 при вариант А/Б → мини-сцена с вълк (combat или chase). Победа → получаваш „вълча вълна“, провал → овцата ранена (reward -1 coin).

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.help.sheep = completed`  
> - Reward: `inventory.coins += 3`, `inventory.materials.wool += 1`  
> - `faction_reputation.villagers += 2`

---

## SQ-KAM-HELP-03 — "Баба Пена иска вода"

> **Свързани документи**: SIDE-QUESTS.md §3, LOCATIONS.md §Кладенецът, COMPANIONS.md §Стоян (ако е наблизо), MAGIC-SPELLS.md §Blessing

Баба Пена живее на хълма и гласът ѝ вибрира като струна на гъдулка. „Очите ми вече не виждат кладенеца, чедо. Донеси вода и благословията ми е твоя.“

> **[ИЗБОР] Как носиш водата?**  
> **А)** Напълваш ведрата сам. *(Stamina check: ако health < 50 → exhaustion -5)*  
> **Б)** Използваш импровизирана система от въже и макара. *(Craft DC 9, успех → unlock `tool improvised_winch`)*  
> **В)** Призоваваш дъждовна молитва (ако имаш spell „Плачът на облаците“). *(Spirit DC 12, успех → buffs `state.weather.temporary_rain = true`)

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.help.water = completed`  
> - Reward: `buff.baba_pena_blessing = +3 HP regen/hour (24h)`  
> - `karma += 1`, `faction_reputation.villagers += 1`

---

## SQ-KAM-HELP-04 — "Прокапалият покрив"

> **Свързани документи**: SIDE-QUESTS.md §4, LOCATIONS.md §Къщата на Мара, GAME-CAPABILITIES.md §Construction, ITEMS.md §Building materials

Вдовица Мара посреща с поглед, който може да отреже дюшек. „Дъждът ми прави лодка в кухнята, а гредите се клатят като пияни гайтани.“

> **[ИЗБОР] Как ремонтираш покрива?**  
> **А)** Намираш дърво и слама (requires `inventory.materials.wood ≥ 1` и `straw ≥ 1`). *(Success → `craft.check = auto`)*  
> **Б)** Импровизираш катранено покритие от механджийски смоли. *(Alchemy DC 12; успех → покривът издържа буря, reward +1 bread)*  
> **В)** Викаш селския майстор и плащаш от джоба си. *(inventory.coins -2 → reputation +3, unlock future discount)

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.help.roof = completed`  
> - Reward: `inventory.coins += 2`, `inventory.food += 1 (homemade bread)`  
> - Ако вариант Б → `state.item.tar_patch = true` (може да спре течове другаде)

---

## SQ-KAM-HELP-05 — "Детето и вълка"

> **Свързани документи**: SIDE-QUESTS.md §5, BESTIARY.md §Wolves, TRAVEL-SYSTEM.md §Forest night path, COMPANIONS.md §Шаро (полезен), AUDIO-SCRIPTS.md §Tension motif

Майка, бледа като сиромашка пита, крещи: „Детето гони котето и не се върна! А вълците вият…“ Сцената е като трагикомедията на Алеко — и опасна, и абсурдна.

> **[ИЗБОР] План за спасение**  
> **А)** Проследяваш детските стъпки и използваш пищялката на Стоян за сигнал. *(Survival DC 13; успех → намираш детето преди вълците, morale +10)*  
> **Б)** Пускаш Шаро напред и вървиш по неговите лайове. *(Requires Шаро; Skill check Animal Handling DC 11)*  
> **В)** Използваш примамка: оставяш месо и засаждаш огнен кръг. *(Alchemy или Fire magic DC 12; успех → вълците се спират, tension -5)*

> **Encounter:** ако провалиш проверката → битка с 2 вълка (stats от BESTIARY). Спасение след победа, но `child_injury = true` (reward -3 coins, karma unaffected).

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.help.child = completed`  
> - Reward: `inventory.coins += 10`, `faction_reputation.villagers += 10`  
> - Unlock rumor „Тайната пътека към Горнослав“ ако детето сподели къде е било.

---

> **Set Bonus:** След изпълнение на всички Каменица помощ quests активира `state.kamenitsa.support_ready = true`, което намалява разходите за провизии (-10%) преди пътуването към Мостово.
