# Capabilities Catalog (Appendix)

## Purpose
Full list (~29 categories, 300+ capabilities) for the RPG capability model. Games choose a subset in `config/capabilities.json` and can add their own. Ranges are illustrative; final numeric values are defined in the specific game or engine configuration.

## Core rules (ranges / behavior)
- `health`: floor 0. At `health <= 0` the character is done; if the game has save/load → GM asks for load; otherwise restart.
- `energy`: floor 0. At `energy == 0` GM limits combat/movement (e.g. cannot combat and travel to other cities), or follows the game's logic.
- Optional: `mana`, `stamina`, `morale`, `hunger`, `thirst`, `reputation` (per faction), `currency` (gold). Example ranges/limits are documented in docs/templates and are not fixed here.

## How to use in a game
- In `config/capabilities.json` the game declares which keys it uses (and optionally ranges/rules).
- Runtime values can be stored in `player-data/runtime/state.json` (e.g. `stats` field).
- Duplicate/missing keys are treated as ERROR on start.

### Minimal skeleton (example)
```json
{
  "health": {"enabled": true, "desc": "HP", "min": 0},
  "energy": {"enabled": true, "desc": "Stamina/energy pool", "min": 0},
  "mana": {"enabled": false},
  "morale": {"enabled": true, "desc": "Mental state", "min": -100, "max": 100}
}
```

### Example structure in `player-data/runtime/state.json` (stats + schema)
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

> The detailed contract is described in [`tools/validator/schemas/state.schema.json`]. The validator uses Ajv and will return `STATE-SCHEMA` warnings if `player-data/runtime/state.json` has negative values, missing keys, or invalid inventories/flags.

### Ranges / guardrails (synchronized with the schema)
| Capability        | Guardrail                                 |
|-------------------|-------------------------------------------|
| `health`, `energy`, `mana`, `stamina`, `hunger`, `thirst`, `stealth`, `perception` | `min/max` in [0..100] |
| `morale`          | `min/max` in [-100..100]                   |
| `armor`           | `min/max` in [0..50]                       |
| `reputation`      | uses `range: [-100, 100]` (no `min/max`) |
| `currency`        | only `min >= 0` (no upper bound)       |
| `crit_chance`     | `min/max` in [0..1]                        |
| `crit_multiplier` | `min` 1..3, `max` 1..5                    |
- Each capability requires `enabled` (bool) and a short `desc` (>=3 chars).
- Use **either** `range` **or** `min/max`. The schema blocks mixing the two.
- Custom capabilities inherit `baseCapability` guardrails — at least one numeric constraint (`range`, `min`, or `max`).
- Runtime values outside the bounds above trigger `CAP-RUNTIME-RANGE`.
- If `min/max` are missing for numeric capabilities, the validator returns `CAP-RUNTIME-BOUNDS`.

### Inventories, flags, and exploration
- `flags`: map `string -> boolean/number/string`, used for global story triggers. Example: `"flags": {"tutorial_complete": true, "favor_tokens": 2}`.
- `inventories`: array of objects `{ id, name?, slots?, items[] }`, each item is `{ item_id, qty >= 0, title?, meta? }`. Use `slots.used/max` to provide capacity guardrails.
- `exploration_enabled` and `exploration_log_preview` remain part of the state file; the schema ensures the preview is an array of string IDs.

### Another example for `config/capabilities.json` (entries with ranges)
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

### Example validation codes (extended list)
- `ERROR[CAP-MISSING]` config/capabilities.json: add key '<cap>'.
- `ERROR[CAP-DUP]` config/capabilities.json: remove duplicate '<cap>'.
- `ERROR[CAP-RANGE]` config/capabilities.json: fix range for '<cap>'.
- `WARN[CAP-RUNTIME]` state.json: add '<cap>' in stats.
- `WARN[CAP-UNUSED]` capabilities.json: key enabled but no runtime value (if the game requires it).

### Validation messages/codes (examples)
- Missing capability key → `ERROR[CAP-MISSING] config/capabilities.json: add key '<cap>'`.
- Duplicate capability → `ERROR[CAP-DUP] config/capabilities.json: remove duplicate '<cap>'`.
- Invalid range (min>max) → `ERROR[CAP-RANGE] config/capabilities.json: fix range for '<cap>'`.
- Missing runtime value (if required by the game) → `WARN[CAP-RUNTIME] state.json: add '<cap>' in stats`.

## Extended example ranges/guidelines by category
- Combat core: `health(0..n)`, `energy/stamina(0..100)`, `armor(0..n)`, `block_chance(0..1)`, `crit_chance(0..1)`, `crit_multiplier(1..3)`, `dodge(0..1)`, `attack_speed(0..n)`.
- Magic: `mana(0..100)`, `mana_regen(0..10/turn)`, `spell_power(0..n)`, `magic_resist(0..n)`, `concentration(0..100)`.
- Stealth/Perception: `stealth(0..100)`, `perception(0..100)`, `trap_detection(0..100)`.
- Social/Reputation: `reputation[-100..100] per faction`, `influence(0..100)`, `charisma(0..100)`.
- Survival: `hunger(0..100)`, `thirst(0..100)`, `temperature_resist(-50..50)`, `fatigue(0..100)`.
- Crafting/Economy: `currency(>=0)`, `crafting_skill(0..100)`, `gathering(0..100)`, `trading(0..100)`.
- Movement/Exploration: `speed(0..n)`, `climb(0..100)`, `swim(0..100)`, `mount_handling(0..100)`, `navigation(0..100)`.
- Status Effects (binary/stacked): `poisoned`, `bleeding`, `stunned`, `burning`, `frozen` (bool or stack count 0..n).

## Derived stats (example rules)
- `armor` = base from equipment + bonuses; may reduce physical damage.
- `magic_resist` = base from gear + buff; reduces magic damage.
- `mana_regen/stamina_regen` = function of `wisdom`/`willpower`/equipment.
- `crit_chance` = base class + buffs + equipment; `crit_multiplier` usually 1.5–3.0.
- `block_chance` and `dodge` are probabilities (0..1), influenced by shield/agility.
- `speed` may be a function of `agility` − equipment weight.
- `carry_capacity/encumbrance` = strength/constitution + gear; if exceeded → penalizes speed/stealth.

## Mapping: catalog → `config/capabilities.json` (example)
- Combat: `health`, `energy`, `stamina`, `armor`, `block_chance`, `crit_chance`, `crit_multiplier`, `dodge`, `attack_speed`.
- Magic: `mana`, `mana_regen`, `spell_power`, `magic_resist`, `concentration`.
- Stealth/Perception: `stealth`, `perception`, `trap_detection`.
- Social: `reputation` (per faction map), `influence`, `charisma`.
- Survival: `hunger`, `thirst`, `temperature_resist`, `fatigue`.
- Crafting/Economy: `currency` (map), `crafting_skill`, `gathering`, `trading`.
- Movement: `speed`, `climb`, `swim`, `mount_handling`, `navigation`.
- Status effects: boolean/stackable keys (e.g. `poisoned`: true|false or counter).

## Validation rules for custom capabilities
- Each custom key in `config/capabilities.json` must have `enabled` (true/false) and a short `desc`.
- If it is numeric: set `min` and/or `max` or `range: [min, max]`; otherwise `CAP-RANGE`.
- If it is a map: describe expected sub-keys (e.g. reputation per faction).
- The GM validates that runtime `state.stats` contains a value for each `enabled` capability (CAP-RUNTIME if missing).
- Duplicate key → CAP-DUP. Missing required key → CAP-MISSING.

## Additional example runtime stats
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

## Metrics related to capabilities (examples)
- % of sessions with at least one custom capability (enabled).
- Avg number of capabilities per game (enabled).
- % CAP-* errors on start (quality signal).
- Avg time to fix CAP-* errors (e.g. captured in Step 4 diagnostics).

## Short definitions (core keys)
- `health`: hit points; at `<=0` the character is done (load/restart logic depends on the game).
- `energy/stamina`: action/movement resource; at 0 it limits combat/travel.
- `mana`: magic resource.
- `armor`: physical damage reduction.
- `magic_resist`: magic damage reduction.
- `block_chance`: chance to block an incoming hit (0..1).
- `dodge`: chance to avoid a hit (0..1).
- `crit_chance`: chance for a critical hit (0..1).
- `crit_multiplier`: critical hit multiplier (e.g. 1.5–3.0).
- `spell_power`: spell strength.
- `stealth`: hidden action; against `perception`.
- `perception`: detection of hidden/traps.
- `reputation`: value per faction ([-100..100]).
- `currency`: currency/resource (map).
- `hunger/thirst/fatigue`: needs; thresholds apply penalties.
- `status_effects`: bool/stack (poisoned, burning, stunned, etc.).

## Units / frequencies (guidelines)
- Regeneration: `mana_regen/stamina_regen` → “per turn” unless stated otherwise.
- Speeds: `speed` → “relative scalar” or “tiles/turn”; specify per game.
- Chances: `block/dodge/crit_chance` → 0..1 (or 0–100%, but specify in `desc`).
- Temperature/resistance: choose values, but specify a scale (e.g. Celsius offset).
- Time fields: ISO8601 UTC.

## Naming / style guide for custom keys
- snake_case, no spaces and no uppercase letters (e.g. `fire_affinity`, not `FireAffinity`).
- Avoid unclear names; add `desc`.
- If it is a boolean flag → prefer a clear name: `is_cursed`, `can_fly`.
- If it is a map → describe sub-keys in `desc` or README.

## Minimal vs recommended set
- **Minimal (combat-light):** `health`, `energy`, `quests/state`, `inventory` (with very basic logic).
- **Baseline combat:** + `armor`, `crit_chance`, `crit_multiplier`, `dodge`, `block_chance`.
- **Magic-heavy:** + `mana`, `mana_regen`, `spell_power`, `magic_resist`, `concentration`.
- **Survival flavor:** + `hunger`, `thirst`, `fatigue`, `temperature_resist`.
- **Stealth flavor:** + `stealth`, `perception`, `trap_detection`.
- **Economy/crafting:** + `currency`, `crafting_skill`, `gathering`, `trading`.

## Micro formulas (guidance)
- Critical damage: `damage = base_damage * crit_multiplier` (if proc-ing crit_chance).
- Armor reduction: e.g. `final = base / (1 + armor/100)` (example formula; choose your own).
- Magic resist reduction: similarly to armor, or cap to %.
- Encumbrance: if `weight > capacity` → penalty on `speed` and `stealth` (e.g. -10% per point exceeded).
- Regen: `mana_regen`/`stamina_regen` applies per turn; at "exhausted" status may drop to 0.
- Regen: `mana_regen`/`stamina_regen` is applied per turn; at “exhausted” status it may drop to 0.

## Per-ability mini-defs (core categories, 1 sentence)
- Combat: **armor** (physical reduction), **block_chance** (block chance), **dodge** (evade chance), **crit_chance** (crit chance), **crit_multiplier** (multiplier), **attack_speed** (rate/initiative), **spell_power** (magical power).
- Magic: **mana** (resource), **mana_regen** (recovery per turn), **concentration** (interrupt resistance), **magic_resist** (magic reduction).
- Stealth: **stealth** (hiding), **perception** (detection), **trap_detection** (specialized perception).
- Social: **reputation** (per faction), **influence/charisma** (social success, prices, reactions).
- Survival: **hunger/thirst/fatigue** (needs), **temperature_resist** (resistance).
- Movement: **speed** (tiles/turn or scalar), **climb/swim/navigation** (specialized movement).
- Economy: **currency** (map), **trading** (prices), **crafting_skill/gathering** (success/quality).
- Status effects: bool/stack, affect stats (poison DoT, stun disable, snare/slow).

## Status effects (detailed)
- Type: `bool` or `stack_count`.
- Typical effects: DoT (poison/bleed/burn), CC (stun/silence/root), debuff (slow/weakness), heal block, anti-magic.
- Removal: `cure/antidote/rest`, special buffs, class skills.
- Recommendation: describe duration/stack limit in `desc` or a rules file.

## Scaling / tiers (example guidelines)
- Stealth/perception scale with level/tier (e.g. +5 per tier).
- Armor soft-cap: e.g. diminishing returns formula (1/(1+armor/k)).
- Crit caps: may be limited to 80–90% for balance.
- Magic_resist: cap to % (e.g. 75%) or use diminishing returns.

## Resource interactions
- Low `hunger/thirst` → penalty to `mana_regen/stamina_regen` and/or `speed`.
- High `fatigue` → reduces `crit_chance`, `block_chance`, `dodge`.
- Status “exhausted” may stop regeneration completely.

## UI contract recommendations (hud)
- `ui/hud.json` can include: bars for `health/energy/mana`, a `status_effects` list, a `reputation` map (per faction), `currency`, `fatigue/hunger/thirst`.
- Add `schema_version` and short labels/units in the HUD so it is clear for the UI layer.

## Quest gating via capabilities
- Quest steps may require a capability (e.g. `strength >= 10`, `stealth >= 50`).
- GM announces lock/unlock: “Need Stealth 50 to bypass guard; you have 40”.
- On unlock, the GM writes the flag/progress in state without spoiling content beyond the current frame.

## Crafting / economy specifics
- Item quality (tiers): common/uncommon/rare/epic (or numeric quality).
- Success chance for crafting: based on `crafting_skill` ± recipe difficulty.
- Salvage % and trading modifiers: `trading` affects buy/sell (example: ±(trading/200)).
- Currency can be multi-currency (gold/gems/credits) and described as a map.

## Examples of custom capabilities
- `fire_affinity` (0..100, affects fire damage and resist).
- `corruption` (0..100, high value applies debuffs).
- `sanity` (-100..100, low → hallucinations/penalties).
- `radiation_resist` (0..100, reduction of radiation DoT).

## Validation severity guide
- CAP-MISSING, CAP-DUP, CAP-RANGE: blocking (ERROR).
- CAP-RUNTIME, CAP-UNUSED: WARN (if the game marks them as optional, the GM may escalate them).
- Custom validation can raise WARN → ERROR if a capability is critical for quest gating.

## Data typing table (describe in desc/note)
- Numbers: describe units and cap (e.g. “0..100, percent”).
- Percentages: 0..1 or 0..100% — specify how to interpret.
- Map: describe sub-keys (e.g. factions, currencies).
- Bool/stack: specify whether it is a flag or stack_count; if stack → max stack.

## Exhaustive list of capabilities (from the provided text)

The list contains **29 core categories** with over **300+ individual capabilities**, covering nearly every mechanic seen in the RPG genre. Each capability can be combined with others to create unique combinations and playstyles. Different games use different combinations; this is a base that most RPGs likely draw from.

### CORE COMBAT SYSTEMS
- Direct attacks: normal strikes, quick strikes, heavy strikes, special moves
- Weapon mastery: swords, axes, spears, bows, dual wield, two-handed
- Combat style: aggressive, defensive, balanced

### MAGIC AND MAGICAL ABILITIES
**8 magic schools:** Evocation, Conjuration, Transmutation, Illusion, Divination, Enchantment, Abjuration, Necromancy

**Elemental magic:** Fire, Ice, Lightning, Water, Earth, Air, Nature, Light, Darkness

### MOVEMENT AND POSITIONING
Basic movement: Walk, Run, Sprint, Jump, Climb, Swim

Special movement: Dash/Roll, Teleport/Blink, Grapple/Swing, Wall Run/Jump, Backflip, Slide, Double/Triple Jump, Charged Jump, Phase through objects, Rocket Jump, Jet Pack, Gravity Shift, Parachute, Zip-line

### CROWD CONTROL
Immobilization: Stun, Paralyze, Root, Freeze, Sleep, Petrify

Disorientation: Daze, Confuse, Blind, Disorient

Speed control: Slow, Speed reduction, Haste reduction

Positional control: Knockback, Knockdown, Throw, Push, Pull, Knockup, Juggle

Taunt: Provoke attention, Force aggression

### DEFENSIVE AND REACTIVE ABILITIES
Parrying: Parry, Riposte

Blocking: Shield block, Armor absorption, Damage reduction

Evasion: Dodge, Evasion, Sidestep, Repositioning

Reflection: Reflect, Bounce spells, Redirect

Counter-attack: Counter attack

### HEALING AND SUPPORT
Direct healing: Heal, Healing Touch, Cure, Holy Light

Group healing: Group Heal, Area Heal, Healing Wave, Aura Heal

Status cure: Cure poison/disease, Remove status

Revive: Revive, Auto-revive, Resurrection, Raise Dead

Regeneration: HP regen, Lifesteal, Blood siphon

### BUFF / ENHANCEMENT
Attack buffs: Attack Up, Damage Increase, Critical Increase, Precision Boost

Defense buffs: Defense Up, Armor Boost, Protection, Harden Skin

Speed buffs: Haste, Movement/Attack Speed Increase

Elemental buffs: Elemental damage boosts, Resistance increases

Compound buffs: Multi-stat up

### DEBUFF / WEAKENING
Damage debuffs: Attack Down, Damage Reduction, Armor Break

Defense debuffs: Defense Down, Vulnerability, Penetration

Speed debuffs: Slow, Movement/Attack speed reduce

Curse: Curse, Hex, Jinx, Doom, Malediction

### STATUS EFFECTS / DoT
Poison, Burn, Bleed, Freeze/Chill, Electrocution, Decay/Necrotic

### Summon / Companion abilities
Summon creatures (Beast, Elemental, Demon, Undead, Minion), Summon Familiar/Companion, Summon Weapon, Handle/Train/Command Animal, Pet Attack/Defend, Summon Assist

### TRANSFORMATION / Empowerment
Polymorph/Shapeshift, Berserk/Rage, Elemental Transform, Multi-form Shifting

### SOCIAL ABILITIES
Persuade, Deceive, Intimidate, Insight, Leadership, Charisma Aura

### STEALTH AND DETECTION
Stealth, Invisibility, Disguise, Detection/Perception, Tracking, Sense Magic

### SURVIVAL AND EXPLORATION
Breathing (underwater/air), Vision (dark/infra/thermal), Navigation, Survival, Gathering, Trap Detection/Disable

### ALCHEMY / CRAFT
Transmutation/Alchemy, Equivalent Exchange, Potion Brewing, Material Analysis, Synthesis

### CRAFTING / PRODUCTION
Weapon/Armor/Accessory Crafting, Repair, Enhancement/Enchant Items

### BLESSING / CURSE
Blessing, Anti-Blessing, Curse/Hex, Counter-Curse, Fate Manipulation

### RANGED ABILITIES
Projectiles (Arrow/Throw/Bullet), Beams, Explosions, Waves, Remote Control/Telekinesis

### SPECIAL MECHANICS AND RESOURCES
Cooldown, Mana Cost, Health Cost, Stamina Cost, Resource Generation (Rage/Fury/Focus), Charge Time, Channel Time

### SPECIALIZED ROLES AND TACTICS
Tank (Taunt/Threat), DPS (Burst/Combo), Healer (Heal/Aura/Res), Control (CC/Status), Utility (Support/Resource/Tactical)

---
Different games will use subsets or their own additions. The engine expects `config/capabilities.json` to declare which capabilities are active for a given game.
