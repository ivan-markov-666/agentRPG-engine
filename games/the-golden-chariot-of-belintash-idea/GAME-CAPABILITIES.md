# 🎮 GAME CAPABILITIES - Bulgarian Historical RPG (1221 AD)

## 🎯 Game Vision

Historical RPG игра, която комбинира:
- **Dragon Age: Origins** style: Tactical choice-driven gameplay, companion relationships, moral dilemmas
- **Fallout: New Vegas** style: Faction reputation, multiple quest solutions, consequence-driven narrative
- **Setting:** България, 1221 година, по време на управлението на цар Иван Асен II

---

## 📋 CAPABILITIES SYSTEM

### Core Gameplay Pillars

```
1. EXPLORATION & DISCOVERY
   ├─ Tactical movement through historical locations
   ├─ Environmental storytelling
   ├─ Discovery of historical artifacts
   └─ Hidden secrets and lore

2. COMBAT & STRATEGY
   ├─ Tactical medieval combat
   ├─ Squad-based battles
   ├─ Stealth options
   └─ Non-combat solutions

3. SOCIAL & REPUTATION
   ├─ Faction relationships (Byzantine, Bulgarian, Latin Empire, Bogomils)
   ├─ NPC reputation tracking
   ├─ Dialogue skill checks
   └─ Political intrigue

4. CHARACTER PROGRESSION
   ├─ Skill-based advancement
   ├─ Equipment upgrades
   ├─ Story-driven character development
   └─ Companion bonding
```

---

## 🎲 CAPABILITIES CONFIGURATION

### 1. CHARACTER STATS (Primary Attributes)

```json
{
  "capabilities": {
    "attributes": {
      "vigor": {
        "type": "attribute",
        "display_name": "Сила",
        "description": "Физическа сила и издръжливост. Влияе на health, damage, носене на броня.",
        "min": 1,
        "max": 20,
        "default": 10,
        "affects": ["max_health", "melee_damage", "carry_capacity"]
      },
      "agility": {
        "type": "attribute",
        "display_name": "Ловкост",
        "description": "Бързина, рефлекси, точност. Влияе на уклонение, инициатива, стрелба.",
        "min": 1,
        "max": 20,
        "default": 10,
        "affects": ["dodge_chance", "initiative", "ranged_accuracy"]
      },
      "cunning": {
        "type": "attribute",
        "display_name": "Хитрост",
        "description": "Интелигентност, дипломация, подмолност. Влияе на persuasion, stealth, perception.",
        "min": 1,
        "max": 20,
        "default": 10,
        "affects": ["persuasion", "deception", "stealth", "perception"]
      },
      "willpower": {
        "type": "attribute",
        "display_name": "Воля",
        "description": "Ментална сила, духовност, устойчивост. Влияе на resistance, faith bonuses.",
        "min": 1,
        "max": 20,
        "default": 10,
        "affects": ["mental_resistance", "faith_power", "intimidation"]
      }
    }
  }
}
```

### 2. SKILLS (Secondary Capabilities)

```json
{
  "skills": {
    "combat": {
      "melee_weapons": {
        "type": "skill",
        "display_name": "Ближен бой",
        "parent_attribute": "vigor",
        "description": "Умение с мечове, секири, копия",
        "min": 0,
        "max": 100,
        "default": 0
      },
      "archery": {
        "type": "skill",
        "display_name": "Стрелба",
        "parent_attribute": "agility",
        "description": "Умение с лък и стрели",
        "min": 0,
        "max": 100,
        "default": 0
      },
      "defense": {
        "type": "skill",
        "display_name": "Защита",
        "parent_attribute": "vigor",
        "description": "Умение с щит и блокиране",
        "min": 0,
        "max": 100,
        "default": 0
      }
    },
    "social": {
      "persuasion": {
        "type": "skill",
        "display_name": "Убеждаване",
        "parent_attribute": "cunning",
        "description": "Дипломация, преговори, убеждаване",
        "min": 0,
        "max": 100,
        "default": 0,
        "check_threshold": {
          "easy": 20,
          "medium": 50,
          "hard": 75,
          "legendary": 90
        }
      },
      "intimidation": {
        "type": "skill",
        "display_name": "Заплашване",
        "parent_attribute": "willpower",
        "description": "Налагане на страх, психологически натиск",
        "min": 0,
        "max": 100,
        "default": 0
      },
      "deception": {
        "type": "skill",
        "display_name": "Измама",
        "parent_attribute": "cunning",
        "description": "Лъжа, маскировка, манипулация",
        "min": 0,
        "max": 100,
        "default": 0
      }
    },
    "exploration": {
      "survival": {
        "type": "skill",
        "display_name": "Оцеляване",
        "parent_attribute": "vigor",
        "description": "Навигация, следене, разпознаване на опасности",
        "min": 0,
        "max": 100,
        "default": 0
      },
      "perception": {
        "type": "skill",
        "display_name": "Възприятие",
        "parent_attribute": "cunning",
        "description": "Забелязване на детайли, намиране на тайни",
        "min": 0,
        "max": 100,
        "default": 0
      },
      "stealth": {
        "type": "skill",
        "display_name": "Подмолност",
        "parent_attribute": "agility",
        "description": "Криене, тих ход, кражба",
        "min": 0,
        "max": 100,
        "default": 0
      }
    },
    "knowledge": {
      "history": {
        "type": "skill",
        "display_name": "История",
        "parent_attribute": "cunning",
        "description": "Познаване на историята, традициите, легендите",
        "min": 0,
        "max": 100,
        "default": 0
      },
      "religion": {
        "type": "skill",
        "display_name": "Религия",
        "parent_attribute": "willpower",
        "description": "Познаване на православието, богомилството, езичество",
        "min": 0,
        "max": 100,
        "default": 0
      },
      "medicine": {
        "type": "skill",
        "display_name": "Медицина",
        "parent_attribute": "cunning",
        "description": "Лекуване на рани, билкознание",
        "min": 0,
        "max": 100,
        "default": 0
      }
    }
  }
}
```

### 3. RESOURCES

```json
{
  "resources": {
    "health": {
      "type": "resource",
      "display_name": "Здраве",
      "description": "Жизнени точки. При 0 - смърт.",
      "min": 0,
      "max": 100,
      "default": 100,
      "regeneration": {
        "rate": 1,
        "interval": "rest",
        "conditions": ["not_in_combat", "has_food"]
      }
    },
    "stamina": {
      "type": "resource",
      "display_name": "Издръжливост",
      "description": "Енергия за бягане, атаки, специални умения",
      "min": 0,
      "max": 100,
      "default": 100,
      "regeneration": {
        "rate": 5,
        "interval": "turn",
        "conditions": ["not_sprinting"]
      }
    },
    "focus": {
      "type": "resource",
      "display_name": "Фокус",
      "description": "Концентрация за специални умения и критични атаки",
      "min": 0,
      "max": 50,
      "default": 50,
      "regeneration": {
        "rate": 2,
        "interval": "turn",
        "conditions": ["not_stunned"]
      }
    }
  }
}
```

### 4. CURRENCY & WEALTH

```json
{
  "currency": {
    "gold_hyperpyron": {
      "type": "currency",
      "display_name": "Златни иперпери",
      "description": "Византийски златни монети. Най-ценната валута.",
      "min": 0,
      "max": 999999,
      "default": 0,
      "rarity": "rare"
    },
    "silver_trachy": {
      "type": "currency",
      "display_name": "Сребърни трахеи",
      "description": "Византийски сребърни/билонови монети. Корубеста форма.",
      "min": 0,
      "max": 999999,
      "default": 50,
      "rarity": "common"
    },
    "copper_coins": {
      "type": "currency",
      "display_name": "Медни монети",
      "description": "Обикновени медни монети за дребни покупки.",
      "min": 0,
      "max": 999999,
      "default": 100,
      "rarity": "very_common"
    },
    "trade_goods": {
      "type": "currency_equivalent",
      "display_name": "Търговски стоки",
      "description": "Кожи, вълна, зърно - използвани за бартер",
      "min": 0,
      "max": 999999,
      "default": 0,
      "can_barter": true
    }
  }
}
```

### 5. REPUTATION & FACTIONS

```json
{
  "reputation": {
    "bulgarian_court": {
      "type": "faction_reputation",
      "display_name": "Двора на цар Иван Асен II",
      "description": "Отношение с българския царски двор",
      "min": -100,
      "max": 100,
      "default": 0,
      "thresholds": {
        "-100_to_-75": "Враг на короната",
        "-74_to_-25": "Недоверен",
        "-24_to_24": "Неутрален",
        "25_to_74": "Уважаван",
        "75_to_100": "Герой на България"
      }
    },
    "byzantine_exiles": {
      "type": "faction_reputation",
      "display_name": "Византийски изгнаници",
      "description": "Отношение с византийските бежанци във Филипопол",
      "min": -100,
      "max": 100,
      "default": 0
    },
    "latin_traders": {
      "type": "faction_reputation",
      "display_name": "Латински търговци",
      "description": "Отношение с венецианските и генуезки търговци",
      "min": -100,
      "max": 100,
      "default": 0
    },
    "bogomils": {
      "type": "faction_reputation",
      "display_name": "Богомили",
      "description": "Отношение с тайните богомилски общини",
      "min": -100,
      "max": 100,
      "default": 0,
      "hidden": true,
      "requires_discovery": true
    },
    "orthodox_church": {
      "type": "faction_reputation",
      "display_name": "Православна църква",
      "description": "Отношение с българската православна църква",
      "min": -100,
      "max": 100,
      "default": 25
    },
    "common_folk": {
      "type": "faction_reputation",
      "display_name": "Обикновени хора",
      "description": "Отношение със селяните и занаятчиите",
      "min": -100,
      "max": 100,
      "default": 0
    }
  }
}
```

### 6. STATUS EFFECTS

```json
{
  "status_effects": {
    "blessed": {
      "type": "buff",
      "display_name": "Благословен",
      "description": "Получил благословия от църквата. +10% resistance, +5% persuasion с православни",
      "duration": 3600,
      "stacks": false,
      "effects": {
        "mental_resistance": "+10%",
        "persuasion": "+5% vs orthodox"
      }
    },
    "wounded": {
      "type": "debuff",
      "display_name": "Ранен",
      "description": "Сериозна рана. -25% vigor, -15% max_health",
      "duration": 0,
      "stacks": true,
      "max_stacks": 3,
      "effects": {
        "vigor": "-25%",
        "max_health": "-15%"
      },
      "removal_condition": "heal_at_healer"
    },
    "poisoned": {
      "type": "debuff",
      "display_name": "Отровен",
      "description": "Отрова в кръвта. -2 health/turn",
      "duration": 300,
      "stacks": true,
      "max_stacks": 5,
      "effects": {
        "health_drain": -2
      }
    },
    "inspired": {
      "type": "buff",
      "display_name": "Вдъхновен",
      "description": "Вдъхновен от епична реч или събитие. +15% всички умения",
      "duration": 600,
      "stacks": false,
      "effects": {
        "all_skills": "+15%"
      }
    },
    "drunk": {
      "type": "mixed",
      "display_name": "Пиян",
      "description": "След прекалено вино. +5 courage, -10 cunning, -15 agility",
      "duration": 1800,
      "stacks": false,
      "effects": {
        "intimidation": "+5",
        "cunning": "-10",
        "agility": "-15"
      }
    },
    "fasting": {
      "type": "mixed",
      "display_name": "Постник",
      "description": "Спазва строг пост. +10 willpower, -5 vigor",
      "duration": 0,
      "stacks": false,
      "effects": {
        "willpower": "+10",
        "vigor": "-5",
        "faith_power": "+15%"
      },
      "removal_condition": "break_fast"
    }
  }
}
```

### 7. QUEST FLAGS & WORLD STATE

```json
{
  "quest_flags": {
    "met_tsar_ivan_asen": {
      "type": "boolean",
      "display_name": "Срещнал цар Иван Асен II",
      "description": "Имал е аудиенция с царя",
      "default": false,
      "affects": ["dialogue_options", "court_quests"]
    },
    "discovered_bogomil_community": {
      "type": "boolean",
      "display_name": "Открил богомилска община",
      "description": "Знае за тайна богомилска община",
      "default": false,
      "affects": ["bogomil_reputation", "church_quests"]
    },
    "witnessed_execution": {
      "type": "boolean",
      "display_name": "Видял екзекуция",
      "description": "Присъствал на публична екзекуция",
      "default": false,
      "affects": ["dialogue_trauma", "moral_alignment"]
    }
  },
  "world_state": {
    "season": {
      "type": "enum",
      "display_name": "Сезон",
      "description": "Текущ сезон на годината",
      "values": ["spring", "summer", "autumn", "winter"],
      "default": "summer",
      "affects": ["weather", "travel_difficulty", "food_availability"]
    },
    "time_of_day": {
      "type": "enum",
      "display_name": "Час",
      "description": "Текущо време на деня",
      "values": ["dawn", "morning", "noon", "afternoon", "dusk", "evening", "night", "midnight"],
      "default": "noon",
      "affects": ["visibility", "npc_availability", "danger_level"]
    },
    "war_tension": {
      "type": "integer",
      "display_name": "Военно напрежение",
      "description": "Ниво на напрежение с Епирското деспотство (преди битката при Клокотница)",
      "min": 0,
      "max": 100,
      "default": 40,
      "affects": ["military_quests", "border_safety", "trade_routes"]
    }
  }
}
```

---

## 🧭 HUD & WORLD METRICS (Runtime-ready)

| Метрика | Описание | Източник (state path) | Влияние |
|---------|----------|-----------------------|---------|
| **Дата** | ISO формат, напр. `1221-01-05` | `world_state.date` | Сезонни евенти, празници |
| **Час / Time of Day** | `dawn/morning/noon/...` | `world_state.time_of_day` + `current_hour` | NPC наличност, опасности нощем |
| **Време** | Тип (слънце, дъжд, сняг, мъгла), интензитет, температура | `world_state.weather` | Бойни модификатори (лук в дъжд), travel трудност |
| **Видимост / Шум** | `world_state.visibility`, `world_state.noise_level` | `world_state.visibility/noise_level` | Stealth/Perception проверки |
| **Локация / Карта** | Текуща област + marker | `world_state.location.{area_id,map_marker,coordinates}` | HUD мини-карта, fast-travel |
| **Health / Stamina / Focus** | Основни ресурси | `stats.health/stamina/focus` | Бой, умения |
| **Morale** | -100..100 | `stats.morale` | Crit шанс, companion approval, диалогови тонове |
| **Carry Capacity** | Макс товар / текущо тегло + ниво на натоварване | `stats.carry_capacity_max`, `stats.carry_weight_current`, `stats.encumbrance_level` | При Heavy ↓Stamina regen, при Overloaded няма Sprint |
| **Inventory Weight** | Автоматично от предметите | `inventories[].items[].meta.weight` | Изчислява carry_weight_current |
| **Currency** | Иперпери, трахеи, медни, стоки | `stats.currency.{gold_hyperpyron,...}` | Бартери, подкупи, проверки |
| **Amulet Burden** | Тежест/изтощение на амулета | `amulet_state.burden` | При ≥80 → статут „Amulet Exhausted“, `amulet_state.equipped=false` докато `cooldown_remaining_minutes` > 0 |
| **Combat Momentum** | Натрупан боен бонус | (будещо) `stats.combat_momentum` | +Damage / +Focus при серия |
| **Armor Integrity** | Издръжливост на бронята | (будещо) `stats.armor_integrity` | Намалява damage reduction при 0 |
| **Threat Level** | Агрото към враговете | (будещо) `stats.threat_level` | Фокусиране на враговете |

> **Бележка:** Всички HUD метрики вече са част от runtime state и могат да се четат/модифицират от сценарии и UI контракти.

---

## 🎯 FALLOUT-STYLE SPECIAL CHECKS

### Skill Check Examples

```
[PERCEPTION 60] "Забелязваш, че монахът носи символи на богомилите под расото си."

[VIGOR 15+] "Отвличаш тежкия меч от войника и го обезоръжаваш с един рязък удар."

[PERSUASION 75] "Убеждаваш боляра, че подкрепата му за царя ще бъде възнаградена."

[HISTORY 50] "Разпознаваш, че това е древна тракийска руна, свързана с бог Сабазий."

[RELIGION 80] "Цитираш Евангелието на старобългарски и печелиш уважението на патриарха."

[CUNNING 18+] "Разкриваш тайната стая зад иконата в манастира."
```

---

## 🎮 DRAGON AGE-STYLE COMPANION SYSTEM

### Companion Approval (Runtime-ready)

```json
{
  "companions": {
    "approval": {
      "type": "relationship_meter",
      "min": -100,
      "max": 100,
      "state_path": "companion_relationships",
      "thresholds": {
        "-100_to_-75": "Враждебен - ще те предаде",
        "-74_to_-25": "Недоволен - критикува решенията ти",
        "-24_to_24": "Неутрален",
        "25_to_74": "Приятелски настроен",
        "75_to_100": "Предан - готов да умре за теб"
      },
      "affects": ["dialogue_options", "personal_quests", "combat_bonuses"]
    }
  }
}
```

**Интеграция:** стойностите се записват в `player-data/runtime/state.json` под `companion_relationships.{companion_id}` (валидни са числа от -100 до 100). UI-овете могат да четат директно от този map и да визуализират метъра; сценарните файлове могат да използват същия ключ за условни преходи/модификации.

---

## ⚙️ ENGINE COMPATIBILITY NOTES

### Validator Requirements (CAP-* Checks)

Всички capabilities трябва да:
1. ✅ Имат уникални ID-та
2. ✅ `min` <= `default` <= `max`
3. ✅ `type` е валиден enum от: `attribute`, `skill`, `resource`, `currency`, `faction_reputation`, `status_effect`, `quest_flag`, `world_state`
4. ✅ `status_effects` имат `stacks` >= 0
5. ✅ `reputation` е в range [-100, 100]
6. ✅ Референции към други capabilities са валидни (напр. `parent_attribute`)

### Runtime State Compatibility

State файлът `player-data/runtime/state.json` трябва да:
- Съдържа всички дефинирани capabilities с валидни стойности
- Поддържа структурата: `{ "capabilities": {...}, "reputation": {...}, "currency": {...}, "status_effects": [...] }`
- Validation schema: JSON Schema чрез Ajv

### Exploration Log Integration

```json
{
  "exploration_enabled": true,
  "exploration_log_preview": [
    "training-grounds-wolf-threat",
    "philippopolis-underground-discovery",
    "bachkovo-miraculous-icon"
  ]
}
```

---

## 📊 METRICS & KPIs

### Gameplay Metrics to Track

```
- Average skill check success rate per skill type
- Most used dialogue approach (persuasion vs intimidation vs deception)
- Faction reputation trends
- Combat vs non-combat quest solutions ratio
- Currency accumulation rate
- Status effect frequency (buffs vs debuffs)
- Death count per difficulty tier
- Weather distribution (слънце/дъжд/сняг)
- Average amulet burden uptime
- Encumbrance violations (колко често играчът е overloaded)
```

---

## 🎨 UI INTEGRATION NOTES

Capabilities системата интегрира с UI contracts:
- **Character Sheet:** Показва attributes, skills, resources
- **Reputation Screen:** Показва faction meters с thresholds
- **Inventory:** Показва currency и trade goods
- **Status Bar:** Показва active status effects с tooltips
- **Dialogue UI:** Показва skill checks като опции (example: `[PERSUASION 60]`)
- **World HUD:** Време, метео, карта marker, амулет статус, carry capacity
- **Map Screen:** Използва `world_state.location.map_marker` + coordinates за позициониране
- **Quest Log:** Показва дата/час на последния запис
- **Travel UI:** Взима `world_state.weather` и `stats.encumbrance_level` за изчисление на време

---

## 🔄 VERSIONING

```
Version: 1.0.0-beta
Game: Bulgarian Historical RPG (1221 AD)
Engine: agentRPG-engine v0.x
Last Updated: 2026-01-05
```

---

## 📝 NOTES FOR GAME MASTER

### Препоръки за използване:

1. **Skill Checks:** Използвай прозрачни [SKILL XX] маркери в dialogue options
2. **Reputation:** Всяко важно решение трябва да има faction consequence
3. **Status Effects:** Създавай memorable situations (drunk at feast, blessed before battle, wounded after ambush)
4. **Currency:** Помни, че през 1221г. повечето селяни използват BARTER, не монети
5. **Historical Accuracy:** Capabilities отразяват исторически реалности (religion skill е православие+богомилство, няма магия)

### Забранени Capabilities:

❌ Магия (не съответства на historical setting)
❌ Sci-fi технологии
❌ Модерни концепти (gunpowder, electricity, etc.)
❌ Fantasy races (elves, dwarves - само хора!)

### Препоръчани Capabilities Expansions:

✅ Crafting skills (blacksmithing, leatherworking)
✅ Trade skills (merchant, haggling)
✅ Language skills (Greek, Latin, Cuman)
✅ Animal handling (horses, hunting dogs)

---

**КРАЙ НА CAPABILITIES ДЕФИНИЦИЯ**
