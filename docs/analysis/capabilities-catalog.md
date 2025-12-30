# Capabilities Catalog (Appendix)

## Purpose
Пълен списък (~29 категории, 300+ способности) за RPG capability модел. Игрите избират подмножество в `config/capabilities.json` и могат да добавят собствени. Диапазоните са примерни; финалните числови стойности се дефинират в конкретната игра или engine конфигурация.

## Основни правила (диапазони / поведение)
- `health`: floor 0. При `health <= 0` герой приключва; ако играта има save/load → GM пита за load; иначе рестарт.
- `energy`: floor 0. При `energy == 0` GM ограничава combat/придвижване (напр. не може combat и пътуване до други градове), или следва логиката на играта.
- По избор: `mana`, `stamina`, `morale`, `hunger`, `thirst`, `reputation` (по фракция), `currency` (gold). Примерни диапазони/граници се описват в документацията/шаблоните, не са фиксирани тук.

## Как да се ползва в игра
- В `config/capabilities.json` играта декларира кои ключове ползва (и опционално диапазони/правила).
- Runtime стойности могат да се пазят в `player-data/runtime/state.json` (напр. поле `stats`).
- Дублиращи/липсващи ключове се третират като ERROR при старт.

### Мини skeleton (пример)
```json
{
  "health": {"enabled": true, "desc": "HP", "min": 0},
  "energy": {"enabled": true, "desc": "Stamina/energy pool", "min": 0},
  "mana": {"enabled": false},
  "morale": {"enabled": true, "desc": "Mental state", "min": -100, "max": 100}
}
```

### Примерна структура в `player-data/runtime/state.json` (stats + schema)
```json
{
  "stats": {
    "health": 32,
    "energy": 12,
    "mana": 0,
    "stamina": 18,
    "morale": 50,
    "hunger": 20,
    "thirst": 10,
    "reputation": {
      "guild": 15,
      "village": -5
    },
    "currency": {
      "gold": 120
    },
    "status_effects": {
      "poison": {"stack": 0}
    }
  }
}
```

> Подробният контракт е описан в [`tools/validator/schemas/state.schema.json`]. Validator-ът използва Ajv и ще връща `STATE-SCHEMA` предупреждения, ако `player-data/runtime/state.json` има отрицателни стойности, липсващи ключове или невалидни inventories/flags.

### Диапазони / guardrails (синхронизирани със schema)

| Capability        | Guardrail                                 |
|-------------------|-------------------------------------------|
| `health`, `energy`, `mana`, `stamina`, `hunger`, `thirst`, `stealth`, `perception` | `min/max` в [0..100] |
| `morale`          | `min/max` в [-100..100]                   |
| `armor`           | `min/max` в [0..50]                       |
| `reputation`      | използва `range: [-100, 100]` (без `min/max`) |
| `currency`        | само `min >= 0` (без горна граница)       |
| `crit_chance`     | `min/max` в [0..1]                        |
| `crit_multiplier` | `min` 1..3, `max` 1..5                    |

- Всяко capability изисква `enabled` (bool) и кратко `desc` (>=3 символа).
- Използвай **или** `range`, **или** `min/max`. Schema блокира смесица от двете.
- Custom capabilities наследяват `baseCapability` guardrails – минимум едно числово ограничение (`range`, `min` или `max`).
- Runtime стойности извън горните граници предизвикват `CAP-RUNTIME-RANGE`.
- При липсващи `min/max` за числови способности validator връща `CAP-RUNTIME-BOUNDS`.

### Inventories, flags и exploration
- `flags`: map от `string -> boolean/number/string`, използван за глобални story тригери. Пример: `"flags": {"tutorial_complete": true, "favor_tokens": 2}`.
- `inventories`: масив от обекти `{ id, name?, slots?, items[] }`, всеки item е `{ item_id, qty >= 0, title?, meta? }`. Използвай `slots.used/max`, за да дадеш guardrails за капацитета.
- `exploration_enabled` и `exploration_log_preview` остават част от state файла; schema гарантира, че preview е масив от string ID-та.

### Още пример за `config/capabilities.json` (entries с диапазони)
```json
{
  "health": {"enabled": true, "desc": "HP", "min": 0},
  "energy": {"enabled": true, "desc": "Stamina", "min": 0},
  "mana": {"enabled": true, "desc": "Magic energy", "min": 0, "max": 100},
  "stamina": {"enabled": true, "desc": "Physical endurance", "min": 0, "max": 100},
  "hunger": {"enabled": true, "desc": "Hunger level", "min": 0, "max": 100, "note": "below 10 -> penalties"},
  "thirst": {"enabled": true, "desc": "Thirst level", "min": 0, "max": 100, "note": "below 10 -> penalties"},
  "reputation": {"enabled": true, "desc": "Faction reps", "range": [-100, 100]},
  "currency": {"enabled": true, "desc": "Gold", "min": 0}
}
```

### Примерни validation кодове (разширен списък)
- `ERROR[CAP-MISSING]` config/capabilities.json: add key '<cap>'.
- `ERROR[CAP-DUP]` config/capabilities.json: remove duplicate '<cap>'.
- `ERROR[CAP-RANGE]` config/capabilities.json: fix range for '<cap>'.
- `WARN[CAP-RUNTIME]` state.json: add '<cap>' in stats.
- `WARN[CAP-UNUSED]` capabilities.json: key enabled but no runtime value (if играта го изисква).

### Validation съобщения/кодове (примерни)
- Липсващ capability ключ → `ERROR[CAP-MISSING] config/capabilities.json: add key '<cap>'`.
- Дублиран capability → `ERROR[CAP-DUP] config/capabilities.json: remove duplicate '<cap>'`.
- Невалиден диапазон (min>max) → `ERROR[CAP-RANGE] config/capabilities.json: fix range for '<cap>'`.
- Липсваща runtime стойност (ако е задължителна за играта) → `WARN[CAP-RUNTIME] state.json: add '<cap>' in stats`.

## Разширени примерни диапазони/насоки по категории
- Combat ядро: `health(0..n)`, `energy/stamina(0..100)`, `armor(0..n)`, `block_chance(0..1)`, `crit_chance(0..1)`, `crit_multiplier(1..3)`, `dodge(0..1)`, `attack_speed(0..n)`.
- Magic: `mana(0..100)`, `mana_regen(0..10/turn)`, `spell_power(0..n)`, `magic_resist(0..n)`, `concentration(0..100)`.
- Stealth/Perception: `stealth(0..100)`, `perception(0..100)`, `trap_detection(0..100)`.
- Social/Reputation: `reputation[-100..100] per faction`, `influence(0..100)`, `charisma(0..100)`.
- Survival: `hunger(0..100)`, `thirst(0..100)`, `temperature_resist(-50..50)`, `fatigue(0..100)`.
- Crafting/Economy: `currency(>=0)`, `crafting_skill(0..100)`, `gathering(0..100)`, `trading(0..100)`.
- Movement/Exploration: `speed(0..n)`, `climb(0..100)`, `swim(0..100)`, `mount_handling(0..100)`, `navigation(0..100)`.
- Status Effects (binary/stacked): `poisoned`, `bleeding`, `stunned`, `burning`, `frozen` (bool или stack count 0..n).

## Derived stats (примерни правила)
- `armor` = база от equipment + бонуси; може да редуцира физическа щета.
- `magic_resist` = база от gear + buff; редуцира магическа щета.
- `mana_regen/stamina_regen` = функция от `wisdom`/`willpower`/equipment.
- `crit_chance` = базов клас + buffs + equipment; `crit_multiplier` обикновено 1.5–3.0.
- `block_chance` и `dodge` са вероятности (0..1), влияни от щит/ловкост.
- `speed` може да е функция от `agility` − тежест на equipment.
- `carry_capacity/encumbrance` = сила/конституция + gear; при превишение → penalizes speed/stealth.

## Mapping: catalog → `config/capabilities.json` (пример)
- Combat: `health`, `energy`, `stamina`, `armor`, `block_chance`, `crit_chance`, `crit_multiplier`, `dodge`, `attack_speed`.
- Magic: `mana`, `mana_regen`, `spell_power`, `magic_resist`, `concentration`.
- Stealth/Perception: `stealth`, `perception`, `trap_detection`.
- Social: `reputation` (per faction map), `influence`, `charisma`.
- Survival: `hunger`, `thirst`, `temperature_resist`, `fatigue`.
- Crafting/Economy: `currency` (map), `crafting_skill`, `gathering`, `trading`.
- Movement: `speed`, `climb`, `swim`, `mount_handling`, `navigation`.
- Status effects: булеви/стакуеми ключове (напр. `poisoned`: true|false или counter).

## Validation правила за custom capabilities
- Всеки custom ключ в `config/capabilities.json` трябва да има `enabled` (true/false) и кратко `desc`.
- Ако е числов: задай `min` и/или `max` или `range: [min, max]`; иначе `CAP-RANGE`.
- Ако е map: опиши очакваните под-ключове (например репутации по фракция).
- GM валидира, че runtime `state.stats` съдържа стойност за всяко `enabled` capability (CAP-RUNTIME ако липсва).
- Дублиране на ключ → CAP-DUP. Липсващ задължителен ключ → CAP-MISSING.

## Допълнителни примерни runtime stats
```json
{
  "stats": {
    "status_effects": {
      "poisoned": false,
      "burning": 0,       // stack count
      "stunned": false
    },
    "factions": {
      "guild": 15,
      "village": -5,
      "mages": 30
    },
    "inventory_slots": {
      "used": 12,
      "max": 20
    },
    "encumbrance": {
      "weight": 35,
      "capacity": 50
    }
  }
}
```

## Метрики, свързани с capabilities (примерни)
- % сесии с поне едно custom capability (enabled).
- Avg брой capabilities per game (enabled).
- % CAP-* errors при старт (quality сигнал).
- Avg време за fix на CAP-* errors (напр. капвано в Step 4 diagnostic).

## Кратки дефиниции (основни ключове)
- `health`: жизнени точки; при `<=0` персонажът приключва (load/restart логика според играта).
- `energy/stamina`: ресурс за действие/движение; при 0 ограничава combat/пътуване.
- `mana`: ресурс за магия.
- `armor`: редукция на физическа щета.
- `magic_resist`: редукция на магическа щета.
- `block_chance`: шанс да блокираш входящ удар (0..1).
- `dodge`: шанс да избегнеш удар (0..1).
- `crit_chance`: шанс за критичен удар (0..1).
- `crit_multiplier`: множител на критичен удар (напр. 1.5–3.0).
- `spell_power`: сила на магии.
- `stealth`: скрита дейност; срещу `perception`.
- `perception`: откриване на скрито/капан.
- `reputation`: стойност per faction ([-100..100]).
- `currency`: валута/ресурс (map).
- `hunger/thirst/fatigue`: нужди; при прагове дават penalties.
- `status_effects`: bool/stack (poisoned, burning, stunned и др.).

## Units / честоти (guidelines)
- Регенерации: `mana_regen/stamina_regen` → “per turn” освен ако е указано друго.
- Скорости: `speed` → “relative scalar” или “tiles/turn”; уточнете в играта.
- Шансове: `block/dodge/crit_chance` → 0..1 (или 0–100%, но пишете в desc).
- Температура/устойчивост: стойности по избор, но посочете скала (напр. Celsius offset).
- Времеви полета: ISO8601 UTC.

## Naming / style guide за custom ключове
- snake_case, без интервали и главни букви (напр. `fire_affinity`, не `FireAffinity`).
- Избягвайте неясни имена; добавете `desc`.
- Ако е булев флаг → предпочитайте ясно име: `is_cursed`, `can_fly`.
- Ако е map → опишете под-ключовете в `desc` или README.

## Минимален vs препоръчан сет
- **Минимален (combat-light):** `health`, `energy`, `quests/state`, `inventory` (с много базова логика).
- **Базов combat:** + `armor`, `crit_chance`, `crit_multiplier`, `dodge`, `block_chance`.
- **Magic-heavy:** + `mana`, `mana_regen`, `spell_power`, `magic_resist`, `concentration`.
- **Survival flavor:** + `hunger`, `thirst`, `fatigue`, `temperature_resist`.
- **Stealth flavor:** + `stealth`, `perception`, `trap_detection`.
- **Economy/crafting:** + `currency`, `crafting_skill`, `gathering`, `trading`.

## Микро формули (guidance)
- Критична щета: `damage = base_damage * crit_multiplier` (ако proc-не crit_chance).
- Редукция от armor: напр. `final = base / (1 + armor/100)` (примерна формула; изберете своя).
- Редукция от magic_resist: аналогично на armor, или cap-нете до %.
- Encumbrance: ако `weight > capacity` → penalty на `speed` и `stealth` (например -10% на точка превишение).
- Regen: `mana_regen`/`stamina_regen` се прилага per turn; при статус “exhausted” може да падне до 0.

## Per-ability mini-defs (основни категории, 1 изречение)
- Combat: **armor** (редукция физика), **block_chance** (шанс блок), **dodge** (шанс избегне), **crit_chance** (шанс crit), **crit_multiplier** (множител), **attack_speed** (честота/инициатива), **spell_power** (магическа сила).
- Magic: **mana** (ресурс), **mana_regen** (възстановяване per turn), **concentration** (устойчивост на прекъсване), **magic_resist** (редукция магия).
- Stealth: **stealth** (скриване), **perception** (откриване), **trap_detection** (специализиран perception).
- Social: **reputation** (per faction), **influence/charisma** (социален успех, цена, реакции).
- Survival: **hunger/thirst/fatigue** (нужди), **temperature_resist** (устойчивост).
- Movement: **speed** (tiles/turn или scalar), **climb/swim/navigation** (специализирано придвижване).
- Economy: **currency** (map), **trading** (цени), **crafting_skill/gathering** (успех/качество).
- Status effects: bool/stack, влияят на stats (poison DoT, stun disable, snare/slow).

## Status effects подробно
- Тип: `bool` или `stack_count`.
- Типични ефекти: DoT (poison/bleed/burn), CC (stun/silence/root), debuff (slow/weakness), heal block, anti-magic.
- Премахване: `cure/antidote/rest`, специални buff-ове, класови умения.
- Препоръка: опишете продължителност/стек лимит в `desc` или rules файл.

## Scaling / tiers (примерни насоки)
- Stealth/perception растат с level/tier (напр. +5 на tier).
- Armor soft-cap: напр. формула с намаляваща възвръщаемост (1/(1+armor/k)).
- Crit caps: може да се ограничи до 80–90% за баланс.
- Magic_resist: капнете до % (напр. 75%) или използвайте diminishing returns.

## Resource interactions
- Ниски `hunger/thirst` → penalty на `mana_regen/stamina_regen` и/или `speed`.
- Висок `fatigue` → намалява `crit_chance`, `block_chance`, `dodge`.
- Status “exhausted” може да спира regen напълно.

## UI contract препоръки (hud)
- `ui/hud.json` може да включва: bars за `health/energy/mana`, списък `status_effects`, карта `reputation` (per faction), `currency`, `fatigue/hunger/thirst`.
- Добавете `schema_version` и кратки labels/units в HUD, за да е ясно на UI слоя.

## Quest gating via capabilities
- Quest стъпки могат да изискват capability (напр. `strength >= 10`, `stealth >= 50`).
- GM съобщава lock/unlock: “Need Stealth 50 to bypass guard; you have 40”.
- При unlock GM записва флага/прогреса в state, без да спойлва съдържание извън текущата рамка.

## Crafting / economy конкретика
- Качество на предмети (tiers): common/uncommon/rare/epic (или числов quality).
- Success chance за craft: базира се на `crafting_skill` ± recipe difficulty.
- Salvage % и trading modifiers: `trading` влияе на buy/sell (пример: ±(trading/200)).
- Currency може да е много-валутно (gold/gems/credits) и да се описва като map.

## Примери за custom capabilities
- `fire_affinity` (0..100, влияе на fire damage и resist).
- `corruption` (0..100, висока стойност дава debuffs).
- `sanity` (-100..100, ниско → халюцинации/penalties).
- `radiation_resist` (0..100, редукция на radiation DoT).

## Validation severity guide
- CAP-MISSING, CAP-DUP, CAP-RANGE: blocking (ERROR).
- CAP-RUNTIME, CAP-UNUSED: WARN (ако играта ги маркира като optional, GM може да ги ескалира).
- Custom validation може да повиши WARN → ERROR, ако capability е критично за quest gating.

## Data typing table (описание в desc/note)
- Числа: описвайте единици и cap (напр. “0..100, percent”).
- Проценти: 0..1 или 0..100% — запишете как се чете.
- Map: опишете под-ключовете (напр. factions, currencies).
- Bool/stack: уточнете дали е flag или stack_count; ако stack → max stack.

## Изчерпателен списък на capabilities (по предоставения текст)

Списъкът съдържа **29 основни категории** с над **300+ индивидуални способности**, които обхващат практически всяка възможна механика виждана в RPG жанра. Всяка способност може да бъде комбинирана с други за създаване на уникални комбинации и плейстайлове. Различните игри използват различни комбинации; това е база, от която всяко RPG вероятно черпи.

### ОСНОВНИ БОЕН СИСТЕМИ
- Преки атаки: обикновени удари, бързи удари, мощни удари, специални движения
- Оръжейно майсторство: мечове, брадви, копия, лъкове, двойна ръка, две ръце
- Боен стил: агресивен, защитен, балансиран

### МАГИЯ И МАГИЧЕСКИ СПОСОБНОСТИ
**8 магически школи:** Evocation, Conjuration, Transmutation, Illusion, Divination, Enchantment, Abjuration, Necromancy

**Елементална магия:** Fire, Ice, Lightning, Water, Earth, Air, Nature, Light, Darkness

### ДВИЖЕНИЕ И ПОЗИЦИОНИРАНЕ
Базово движение: Walk, Run, Sprint, Jump, Climb, Swim

Специални движения: Dash/Roll, Teleport/Blink, Grapple/Swing, Wall Run/Jump, Backflip, Slide, Double/Triple Jump, Charged Jump, Phase through objects, Rocket Jump, Jet Pack, Gravity Shift, Parachute, Zip-line

### CROWD CONTROL
Обездвижване: Stun, Paralyze, Root, Freeze, Sleep, Petrify

Дезориентация: Daze, Confuse, Blind, Disorient

Контрол скорост: Slow, Speed reduction, Haste reduction

Позиционен контрол: Knockback, Knockdown, Throw, Push, Pull, Knockup, Juggle

Таунт: Provoke attention, Force aggression

### ЗАЩИТНИ И РЕАКТИВНИ СПОСОБНОСТИ
Парирование: Parry, Riposte

Блокиране: Shield block, Armor absorption, Damage reduction

Уклончивост: Dodge, Evasion, Sidestep, Repositioning

Отразяване: Reflect, Bounce spells, Redirect

Контраатак: Counter attack

### ЛЕЧЕНИЕ И ПОДДЪРЖАНЕ
Директно лечение: Heal, Healing Touch, Cure, Holy Light

Масово лечение: Group Heal, Area Heal, Healing Wave, Aura Heal

Лечение състояние: Cure poison/disease, Remove status

Възраждане: Revive, Auto-revive, Resurrection, Raise Dead

Регенерация: HP regen, Lifesteal, Blood siphon

### BUFF / ENHANCEMENT
Attack buffs: Attack Up, Damage Increase, Critical Increase, Precision Boost

Defense buffs: Defense Up, Armor Boost, Protection, Harden Skin

Speed buffs: Haste, Movement/Attack Speed Increase

Elemental buffs: Elemental damage boosts, Resistance increases

Compound buffs: Multi-stat up

### DEBUFF / ОТСЛАБВАНЕ
Damage debuffs: Attack Down, Damage Reduction, Armor Break

Defense debuffs: Defense Down, Vulnerability, Penetration

Speed debuffs: Slow, Movement/Attack speed reduce

Curse: Curse, Hex, Jinx, Doom, Malediction

### СТАТУС ЕФЕКТИ / DoT
Poison, Burn, Bleed, Freeze/Chill, Electrocution, Decay/Necrotic

### Summon / Партньор способности
Summon същества (Beast, Elemental, Demon, Undead, Minion), Summon Familiar/Companion, Summon Weapon, Handle/Train/Command Animal, Pet Attack/Defend, Summon Assist

### ТРАНСФОРМАЦИЯ / Усилване
Polymorph/Shapeshift, Berserk/Rage, Elemental Transform, Multi-form Shifting

### СОЦИАЛНИ СПОСОБНОСТИ
Persuade, Deceive, Intimidate, Insight, Leadership, Charisma Aura

### СКРИТНОСТ И ОТКРИВАНЕ
Stealth, Invisibility, Disguise, Detection/Perception, Tracking, Sense Magic

### РАЗВЕЖДАНЕ И ЕКСПЛОРАЦИЯ
Breathing (underwater/air), Vision (dark/infra/thermal), Navigation, Survival, Gathering, Trap Detection/Disable

### АЛХИМИЯ / КРАФТ
Transmutation/Alchemy, Equivalent Exchange, Potion Brewing, Material Analysis, Synthesis

### КРАФТ / ПРОИЗВОДСТВО
Weapon/Armor/Accessory Crafting, Repair, Enhancement/Enchant Items

### БЛАГОСЛАВКА / ПРОКЛЯТИЕ
Blessing, Anti-Blessing, Curse/Hex, Counter-Curse, Fate Manipulation

### ДИСТАНЦИОННИ СПОСОБНОСТИ
Projectiles (Arrow/Throw/Bullet), Beams, Explosions, Waves, Remote Control/Telekinesis

### СПЕЦИАЛНИ МЕХАНИКИ И РЕСУРСИ
Cooldown, Mana Cost, Health Cost, Stamina Cost, Resource Generation (Rage/Fury/Focus), Charge Time, Channel Time

### СПЕЦИАЛИЗИРАНИ РОЛИ И ТАКТИКИ
Tank (Taunt/Threat), DPS (Burst/Combo), Healer (Heal/Aura/Res), Control (CC/Status), Utility (Support/Resource/Tactical)

---

Различните игри ще използват подмножества или собствени добавки. Engine-ът очаква `config/capabilities.json` да декларира кои capabilities са активни за конкретната игра.
