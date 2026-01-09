# КАМЕНИЦА · SIDE QUESTS — СЪБИРАНЕ (#12–13)

> **Traceability**: SIDE-QUESTS.md §Каменица събиране #12–13 · SCENARIO-WRITING-PLAN §7.2 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-KAM-GATH-12 — "Билки за лечител"

> **Свързани документи**: SIDE-QUESTS.md §12, LOCATIONS.md §Билкарските поляни, COMPANIONS.md §Калина, TRAVEL-SYSTEM.md §river_loop

Селският лечител киха върху списък с билки, дълъг като данъчна декларация, и те моли да събереш "само пет". Бай Ганьо би казал, че това е разходка, но Родопите имат друго мнение.

> **[ИЗБОР] Подход към събирането**  
> **А)** Маршрутът на реката — събираш мента, див риган и жълт кантарион. *(Survival DC 11; успех → `inventory.herbs += {mint,oregano,hypericum}`; провал → пиявиците ти вземат 5 HP)*  
> **Б)** Търсене в сенките на бора — играеш на "пази се от вълк". *(Stealth DC 12; успех → намираш рядката "нощна лайка" → buff `resistance_poison +5`; провал → encounter с лисица)*  
> **В)** Викаш Калина за помощ и подчертаваш, че е научен експеримент. *(Requires companion Калина; Lore DC 10; успех → „herbal_tincture" item)*

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.gathering.herbs = completed`  
> - Reward: `inventory.potions += 1 healing`, `reputation.mages +5`, unlock `journal.append("Herbal debt repaid")`

---

## SQ-KAM-GATH-13 — "Дърва за зимата"

> **Свързани документи**: SIDE-QUESTS.md §13, LOCATIONS.md §Боровата гора, GAME-CAPABILITIES.md §Resource gathering, ITEMS.md §Wood bundles

Вдовица с деца се кълне, че кюмбе без дърва е по-студено от народен депутат без микрофон. Трябва да насечеш дърва и да ги доставиш преди да завали.

> **[ИЗБОР] Тактика**  
> **А)** Ползваш брадвата на Стоян и работиш сам. *(Strength DC 12; успех → `inventory.materials.wood += 2`; провал → натъртено рамо, stamina -10)*  
> **Б)** Организираш селски бригадирски ден с вино и песни. *(Leadership DC 11; успех → работата приключва бързо, `reputation.villagers +5`; провал → половината група се разсейва)*  
> **В)** Впрягаш магарето на Петър и правиш supply chain, достойна за електрифициран Балкан. *(Logistics DC 10; успех → получаваш „sledge_cart" tool; провал → магарето бяга, chase mini-event)*

> **STATE UPDATE**  
> - `quest_flags.kamenitsa.gathering.firewood = completed`  
> - Reward: `karma +1`, `inventory.food += 1 (homemade stew)`, `state.buff.warmth = +2 HP regen през зимни сцени`

---

> **Set Bonus:** При завършени куестове за събиране `state.kamenitsa.resource_stockpile = true`, което намалява цената на алхимични съставки и дървен материал в Каменица с 10% и отключва side сцена „Пазарът на есента“.
