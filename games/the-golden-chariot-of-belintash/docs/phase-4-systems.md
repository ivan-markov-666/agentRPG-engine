# Phase 4 — Capabilities, Economy & Companions

_Източници: `games/the-golden-chariot-of-belintash-idea/GAME-CAPABILITIES.md`, `CURRENCY-SYSTEM.md`, `COMPANIONS.md`, `SCENARIOS/ACT-I/`._

## 1. Capabilities sync
| Capability | Тип / обхват | Конфигурация (@config/capabilities.json) | Runtime state (@player-data/runtime/state.json) |
| --- | --- | --- | --- |
| `health` | Ресурс (0–120) | `max: 120` заради закаляването на героя | `stats.health = 80` (след Каменица инцидента) |
| `stamina` | Ресурс (0–100) | Описва физическата издръжливост | `stats.stamina = 55` |
| `focus` | Ресурс (0–50) | Канал за амулета и специални умения | `stats.focus = 25`; ако пада под 10 → амулет предупреждения |
| `hunger` / `thirst` | Състояние (0 сит → 100 опасност) | Валидира guard-и в пътните сцени | `stats.hunger = 30`, `stats.thirst = 25` |
| `morale` | -100 → 100 | Свързан с companion approval и карма | `stats.morale = 5` (неутрално) |
| `amulet_burden` | 0 → 100 | Следи умората на талисмана | `stats.amulet_burden = 18` |
| `armor` / `stealth` / `perception` | Тактически метрики | Мapped директно към checks в main quests | `armor=5`, `stealth=10`, `perception=12` |
| `carry_capacity` | кг лимит (0–120) | Ползва се от loot сцените в Act I | `stats.carry_capacity = 35` |
| `reputation.*` | Фракции (Bulgarian court, etc.) | Engine range [-100,100] | Добавени ключове според WORLD-BIBLE |
| `currency.*` | Иперпери/трахеи/медни/бартер | Виж §2 | Initial: 0/0/15/0 |

> ✅ Всички активни capabilities имат съответни runtime стойности (няма orphan-и). Guard-овете в куестовете могат да използват същите ключове без risk.

## 2. Economy & currency rules
- **Валути**: златни иперпери → сребърни трахеи → медни трахеи → бартер стоки (`trade_goods`).
- **Конверсия** (по `CURRENCY-SYSTEM.md`): `1 hyperpyron = 12 silver = 288 copper`, `1 silver = 24 copper`.
- **Стартово състояние**: героят е с 15 медни, без сребърни/златни. Това съвпада с идеята за бедно начало.
- **Quest hooks**:
  - `main-quest-02` дава 1–2 сребърни при спасяване на стадото (апдейт в step rewards).
  - Side quest `mos-help-14` → бартер: редките билки = 1 сребърна + companion unlock.
  - Добави бележка в всеки пазарен сцена block: „Цена = X медни или бартер (кожа/билки)“ → runtime update на `stats.currency`.
- **Telemetry флагове (подготвка)**: проследявай `currency_delta` и `trade_goods_delta` на сценариите за Phase 5 KPI.

## 3. Companion system (Act I scope)
| Companion | Unlock quest / условие | Състояние в runtime | Одобрение / бележки |
| --- | --- | --- | --- |
| **Шаро** | `main-quest-02` („Следите към Мостово“) → приеми кучето след сцената със Стойчо | Активен companion още от Mostovo. Одобрението се пази в `companion_relationships.sharo` (по подразбиране `+25`). | Нуждае се от храна (`hunger` checks). Guard: ако глад >70, companion спира да помага. |
| **Калина** | Side quest `mos-help-14` → събери трите билки | След завършване добави `companion_relationships.kalina = 0` и отключи нейните умения (healing buff hooks). | Калина не влиза в бой; сцените проверяват `companion_active == "kalina"` преди да предлага отвари. |
| **Баба Руска (mentor NPC)** | Story mentor, не е companion, но unlock-ва `status_effects.blessed`. | Няма entry. | Използва `status_effects` вместо relationship. |

### Runtime hooks
- **Companion switch**: При смяна запиши `companion_relationships.<old>` (без да триeш ключа). Това позволява approval да е persistent.
- **Approval thresholds**: copy от `GAME-CAPABILITIES.md` → `-25/+25` и `+75` за специални реплики.
- **Fail states**: ако companion умре (`companion_death` flag) → `morale -= 25` и добави нов quest hook (вж. `COMPANIONS.md`).

## 4. Pending Phase 4 tasks
1. **Items & inventory hooks** — извадка от `ITEMS.md`: нужен списък за храни, лечебни отвари, търговски стоки → директно към `scenario/items/*.md`.
2. **Companion data in state** — добави реални ключове (`"sharo": 25`) + switch флаг (напр. `active_companion_id`).
3. **Economy tables в куестовете** — опиши конкретни цени/награди във всяка quest markdown стъпка (особено в Act I side quests).
