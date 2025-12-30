---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - 'docs/analysis/research/domain-similar-open-source-llm-rpg-engines-and-if-frameworks-research-2025-12-19.md'
  - 'docs/analysis/brainstorming-session-2025-12-14T16-45-00+0200.md'
workflowType: 'product-brief'
lastStep: 4
project_name: 'A RPG game engine for LLM models.'
user_name: 'Master'
date: '2025-12-19'
---

# Product Brief: A RPG game engine for LLM models.

**Date:** 2025-12-19
**Author:** Master

---

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Step 2 — Vision

> **Status (22 дек 2025):** Стъпки 1–4 са изпълнени и документът е заключен като Product Brief v1. Допълнения се правят само ако се появи ново изискване от Decision/PRD фазата.

### Executive Summary

AgentRPG Engine е open-source **npm package** (и GitHub repo) за RPG/interactive narrative игри, в който **един централен Game Master (GM), управляван от LLM**, води играта и изпълнява ролята на “backend” логиката, **без класически backend/API слой**.

Engine-ът е **platform-agnostic**: първоначално интегриран с Windsurf (copy/paste workflow през Cascade), но остава независим от конкретна платформа (в бъдеще: Cursor/Claude Code и др.).

Играта е **file-first**: има `manifest/entry.json` файл, който описва играта и съдържа връзки към related файлове (rules/config/content). Стартирането на играта става чрез **session-init файл** (`player-data/session-init.json`), който играчът подава (copy-paste в Cascade). След това engine-ът отваря и подава само нужните файлове към LLM по предсказуем навигационен поток (LLM да не се лута “какво следва”).

Основна цел за v1: **за кратко време да се стига до playable прототип**, полезен и за creators, и за players.

### Core Vision

#### Problem Statement

Създаването на LLM-driven RPG преживяване често изисква класически backend/game-loop слой, API и инфраструктура (вкл. база данни), вместо LLM да може да управлява gameplay-а директно върху готов engine framework с ясни договори (contracts) и стабилни модели.

#### Problem Impact

- Бавен старт: време отива в инфраструктура и glue code вместо в съдържание и итерация на gameplay.
- Висок праг за вход: нужни са backend знания, deployment и поддръжка.
- Чупливост: без стабилен state/contract модел прототипите трудно стават повторяеми и подлежащи на tooling.

#### Why Existing Solutions Fall Short

(категории)

- “Prompt-first” подходи без стабилен **state/contract** модел → трудно повторяемо и трудно за tooling.
- Подходи с класически backend/orchestrator слой → повече инфраструктура и поддръжка, против целта “no classic backend”.

#### Proposed Solution

Engine framework (open-source npm package), който:

- Дефинира **manifest/entry.json** (статичен) като основен вход за играта и източник на връзки към related файлове (rules/config/content).
- Дефинира **session-init** (`player-data/session-init.json`), който играчът подава при старт (copy-paste в Cascade).
- Има минимален **Host Adapter интерфейс** (platform-agnostic): engine core работи чрез операции като `readFile/writeFile/listFiles/log`, без vendor lock-in.
- **Няма HTTP endpoints/сървър и няма DB**: persistence е чрез **централизирани JSON файлове**.

##### Entry & Session Contracts (file-first)

- `manifest/entry.json` е single source of truth за:
  - идентичност и версия на играта
  - engine compatibility range
  - engine layers: `engine_layers` (масив от npm packages, напр. `[@agentrpg/engine, @my/game-engine-custom]`; custom layer е optional — ако липсва, engine работи само с core)
  - enabled capabilities
  - канонични пътища към content/config/schemas/ui
  - start entrypoint (напр. start scene)

- `player-data/session-init.json` съдържа само параметри за стартиране на сесия (без контент), напр.:
  - коя игра да се стартира (path/id)
  - player profile (име)
  - optional save to load / run id

##### Save model (file-based, no DB)

- Save файловете са под `player-data/saves/`.
- `player-data/saves/index.json` изброява save-овете (минимум: `save_id`, `created_at`, `scene_id`, `summary`, `file_path`) и може да се разширява по време на разработката.
- Всеки save пази canonical state snapshot + cursor (напр. `scene_id` + `turn_id`/`step_id`), без копия на `ui/*.json`.

##### Folder ownership

- Game package-ът идва с папките и initial template файлове за `ui/` и `player-data/`.
- Engine/GM обновяват runtime output по време на игра; UI и player не редактират `player-data/`.

##### UI (read-only) и runtime output

UI не е част от engine-а; UI може да идва с играта (например NextJS). Engine-ът предоставя стабилен **file-based UI contract**:

- Фиксирани пътища:
  - `ui/scene.json`
  - `ui/actions.json`
  - `ui/hud.json`
  - `ui/history.json`
  - `ui/index.json`

- Runtime output модел:
  - engine core може да предостави template/skeleton
  - GM/LLM обновява UI файловете всеки “turn”
  - UI **само чете и рендва** (read-only)
  - Player input се подава само през chat (Windsurf), не през UI

- `ui/actions.json` съдържа **предложени действия**, но не е изчерпателно. Играчът може да предложи и друго действие, а GM/LLM трябва да държи играча **в рамка** според света/епохата/правилата (напр. без смартфон в каменната ера, без time travel ако играта не го позволява, но с възможност за разходка до близкото село (дори и да не е спомена изрично в сценария на играта)).

- `ui/scene.json` съдържа минимум:
  - `scene_id`, `title`, `description`, `location`, `npcs_present`, `timestamp`

- История:
  - `ui/history.json` пази последните **N** събития/turns (default **N=20**) + линк към пълната история
  - пълната история е append-only JSONL лог: `player-data/runtime/history.full.jsonl`

- `ui/index.json` играе ролята на UI manifest:
  - pointers към `ui/*.json`
  - schema versions за всеки UI output файл (map по file path, напр. `ui/scene.json` -> `schemas/ui.scene.v1.json`)
  - pointers към `player-data/` (напр. saves index + full history)

##### Player data / portability

- Данните за прогреса са портируеми и са вътре в играта, под `player-data/`.
- `player-data/` е **engine-managed**.
- Save файловете живеят под `player-data/saves/`.

##### Schemas / Contracts

Engine-ът публикува schemas/contracts и ги версионира (major version), напр.:
- `schemas/ui.scene.v1.json`
- `schemas/state.v1.json`

##### Capabilities (examples)

Engine-level capabilities (играта може да изключва някои per game):
- `health`, `mana`, `stamina`
- `inventory`, `equipment`, `encumbrance/strength`
- `skills`, `level`, `progress`
- `quests`
- `date_time`
- (допълнителни примери): `currency`, `status_effects`, `factions/reputation`, `relationships`, `flags`, `location`, `journal/log`

##### Combat

- Turn-based combat във v1, начална реализация с усещане подобно на “Легендата за зеления дракон”, с перспектива за добавяне на други combat системи.

##### Upgrade-friendly customization (override layer)

- Engine-ът е open-source npm package, но позволява “безболезнени” къстомизации чрез модел **core engine + per-game custom engine layer**:
  - **Core engine**: официалният upstream npm package (напр. `@agentrpg/engine`)
  - **Per-game custom engine layer**: отделен npm package за конкретната игра, който *зависи от* core engine-а и добавя/override-ва:
    - capabilities (engine-level additions)
    - configs
    - schemas/contracts

- Този custom layer се интегрира чрез **официални extension points** (концепция), така че обновяването на core engine-а да става като update на dependency, без да се губят custom промените (детайлите на механизма се уточняват в последваща спецификация).

## Step 3 — Target Users

### Primary Users

#### Primary Persona A: Engine-Dev (Structured)

- **Name & Context:** Алекс, 29. Самоук/инди engine-dev, който може да редактира JSON/YAML и да "връзва" взаимодействията между файловете. Публикува като GitHub repo, от което се прави npm package.
- **What matters most:** contracts, extensibility, determinism.
- **Success (30–60 min prototype):**
  - Playable slice: малко село + NPC/обекти + поне 1 main quest, който може да се завърши.
  - Save/load данните са в играта, но механизмът е от engine-а.

#### Primary Persona B: Prompt-first Creator (v1 target)

- **Name & Context:** Мира, 24. Gamer/creator, който иска "LLM + идея → игра" с минимални редакции (главно по templates и entry файла).
- **Definition of playable:** chat loop (UI е nice-to-have).
- **Biggest friction:** "къде да пиша сценария"
- **Resolved by convention:**
  - Сценарият живее в `games/<gameId>/scenario/`, с `scenario/index.md` като вход (с линкове към по-малки файлове).

### Secondary Users

- **Gamers (players):** хора, които искат да играят LLM-driven RPG; част от тях могат да еволюират към Prompt-first creators.

### User Journey

#### Onboarding & Switching (shared concept)

- **Games workspace:** игрите са в `games/<gameNameWithID>/...` (не са част от engine npm package-а). Най-лесен flow: zip архив → разархивиране в `games/`.
- **Start / Switch game:** за да започне/превключи игра, LLM чете `games/<gameId>/manifest/entry.json`.
- **Scenario navigation:** `games/<gameId>/scenario/index.md` описва "какво се очаква" и сочи към модулни части на сценария (за да се побира в context window).
- **Capabilities selection:** `games/<gameId>/config/capabilities.json` описва кои capabilities/метрики от engine-а се ползват (напр. `mana: off`, `health: on`), а `manifest/entry.json` сочи към този файл.

#### Scenario Navigation Contract (S3 hybrid + active quest state)

- `scenario/index.md` е каталог с линкове към `scenario/areas/*` и `scenario/quests/*` + кратки правила за навигация.
- След `scenario/index.md` LLM/GM първо чете `scenario/quests/main-quest-01.md`, за да има фокус и цел на играта. Main quest-ът може да не е активен/разкрит от началото; файлът описва условията за появяване/активация, но GM не е длъжен да го "спойлва" на играча преди да стане релевантно.
- По подразбиране GM отваря само файловете, нужни за текущата ситуация: текущата area (по `current_area_id` в canonical state) + релевантните активни quest-ове/части от тях.
- Ако играчът се откаже от текущ quest, GM трябва да прегледа всички активни quest-ове (според canonical state) и да предостави списък, от който играчът да избере нов quest, или да продължи exploration без да избира.
- **Active quests** се пазят в `player-data/runtime/state.json` като масив с обекти:
  ```json
  "active_quests": [
    {"quest_id": "main-quest-01", "status": "active", "progress": 0, "current_step_id": "step-01", "flags": {"met_npc": false}},
    {"quest_id": "side-quest-01", "status": "active", "progress": 0}
  ]
  ```
- **Unlock-нати quest-ове** са в `scenario/quests/available.json`; unlock условия са в `scenario/quests/unlock-triggers.json`.
- GM показва списък с активни quest-ове само при: (a) играч изрично поиска, (b) играч се откаже от текущ quest.
- **Completed quests**: файл `player-data/runtime/completed-quests.json` (или поле в state.json) с `{ quest_id, title, completed_at }`. Списъците към играча са по заглавие, не по ID.
- **Exploration mode**: след края на main quest GM продължава да предлага exploration в рамките на сетинга (държи играча в света; не позволява “Apple Store” в средновековие).
- **Validation при старт**: проверява задължителните файлове (entry, scenario/index, available, unlock-triggers, completed-quests placeholder). Ако липсват нужни файлове/capabilities → грешка.
- **World frame за exploration**: `scenario/world/index.md` (или `.../setting.md`) описва ера/сетинг, допустими технологии/магии, табута/граници и тон. GM при exploration ползва този файл + `current_area_id`, отклонява искания извън рамката и пренасочва към близка допустима опция.
- **Validation (структура + fallback-и):**
  - Проверява наличие/формат: `manifest/entry.json`, `scenario/index.md`, `scenario/quests/available.json`, `scenario/quests/unlock-triggers.json`, `player-data/runtime/state.json` (или placeholder), `player-data/runtime/completed-quests.json` (или празен масив), (по избор) `scenario/world/index.md`.
  - `available.json`: карта/масив `quest_id -> title` (canonical за ID ↔ title).
  - `unlock-triggers.json`: `quest_id -> условие/флаг`.
  - `state.json`: `active_quests` без фиксиран лимит; всеки с `quest_id`, `status`, `progress`, `current_step_id`, `flags`; `title` може да се резолвне от `available.json`.
  - Ако липсва `completed-quests.json` → създава се празен масив `[]`.
- **Error reporting (debug mode):** грешките от валидации се съобщават в чат-а от GM/LLM; в нормален режим се показват само блокиращи (error), а в debug режим се показват info/warn/error. Debug се активира ако при старт GM получи индикация/съобщение “debug” (може да е текст в стартовото съобщение или поле `debug: true` в session-init); GM записва локално, че е в debug (файл/флаг). Формат: `[LEVEL] file:message (suggested fix)` + контекст (quest_id/area ако е релевантно).
- **Exploration log (нови места по искане на играча):** `player-data/runtime/exploration-log.json` (или YAML) пази одобрените от GM нови локации/градове/MCP/странични quest-ове, добавени при свободно exploration; използва същия модел ID ↔ title (играчът вижда title, GM работи с ID). Препоръчани полета: `{ id, title, type ["city","landmark","dungeon","mcp","side-quest-hook","poi"], area_id?, description?, added_at (UTC ISO8601), tags[], origin: "player-request"|"gm-suggested" }`. Не се иска допълнително потвърждение към играча; след одобрение GM директно записва и продължава историята. Файлът е задължителен, ако играта поддържа свободно exploration; ако липсва и се ползва exploration → авто-създава се празен с шаблон.
- **Error reporting (debug mode):** грешките от валидации се съобщават в чат-а от GM/LLM; в нормален режим се показват само блокиращите (error), а в debug режим се показват info/warn/error. Debug се активира ако при старт GM получи индикация/съобщение “debug” (може да е текст в стартовото съобщение или поле `debug: true` в session-init); GM записва локално, че е в debug (файл/флаг). Формат: `[LEVEL] file:message (suggested fix)` + контекст (quest_id/area ако е релевантно).
- **Quest ID ↔ Title:** GM работи с `quest_id`, но към играча показва `title` (резолвнато от `available.json` или от същата canonical карта). При mismatch (липсва title или дублиран title/ID) → error и блокира старт/зареждане; GM предупреждава и ако играчът поиска quest със съществуващо/подобно заглавие.
- **Developer onboarding definition:** за Persona B първият “успешен onboarding” е готова игра с 1 работещ quest, който включва поне една битка и поне едно NPC.
- **Language preference:** при старт GM пита “Which language/style?” (пример EN/DE/BG/Pirate English); изборът се пази в `player-data/session-init.json` като `preferred_language`. Engine не превежда; GM/LLM комуникира на избрания език/стил, дори ако файловете са на друг език. Няма алтернативни индекси/i18n папки във v1.
- **Orphan защити и fallback-и:** ако има `active_quests` без съответен quest файл → GM създава празен шаблон за този quest (но логва error); ако `current_area_id` сочи несъществуваща area → fallback към default area + error. Липсващ exploration-log при включен exploration се авто-създава с шаблон.
- **Samples/празна игра:** engine предоставя примерни шаблони (blank game) без метрики, само с необходимите файлове + инструкции как да се изгради играта по правилата на engine-а.
- **Language persistence:** езикът се записва само на едно място (`preferred_language` в session-init) и GM го обновява при смяна; при рестарт GM чете `preferred_language` и може да потвърди към играча.
- **Метрики (за Step 4 подготовка):** добавени предложените: avg exploration-log entries per session; % sessions с debug enabled; avg retries to pass validation; плюс базовите (time-to-first-active-quest, % успешни откази/превключвания без dead-end, validation pass rate, % sessions с ≥1 completed quest).
- **Blank game (samples/blank-game/):** копируем скелет с валидна структура и инструкции: manifest/entry.json; scenario/index.md; scenario/quests/available.json; scenario/quests/unlock-triggers.json; scenario/areas/default-area.md; player-data/runtime/state.json; completed-quests.json; exploration-log.json; player-data/session-init.json (с preferred_language placeholder); config/capabilities.json; README.md с указания.
- **Orphans auto-remedy:** липсващ quest файл при quest_id в active → GM създава шаблон (id, title от available, summary “auto-created”, steps: []) и логва error; липсваща area за current_area_id → fallback към default-area.md + error; дублирани заглавия в available → ERROR, GM може да предложи rename.
- **Debug semantics:** включва се с “debug” в стартовото съобщение или `debug: true` в session-init; изключва се при нов рестарт или explicit `debug: false`. Формат на WARN/ERROR/INFO: `[LEVEL][CODE] file:message (suggested fix) [ctx]`.
- **Language UX:** стартов prompt “Choose language/style…”; смяна в сесия обновява `preferred_language` (едно място) и GM потвърждава; при рестарт GM чете `preferred_language` и потвърждава.
- **Метрики (детайл):** time-to-first-active-quest (мин от старт до първи active quest); % успешни откази/превключвания без dead-end (валиден списък/стъпка след отказ); validation pass rate (% стартове без критични ERROR-и, с описание на проблема от GM/LLM); % с ≥1 completed quest; avg exploration-log entries per session; % sessions с debug enabled; avg retries to pass validation.
 - **Capabilities (ranges/examples):** defaut examples: health ≤0 → герой приключва → GM пита за load; energy ≥0 (може да е 0). Цел: да има примерни диапазони/ограничения в шаблоните (без фиксирани стойности в blank game).
 - **Capability value guardrails (v1 baseline):**
   | Capability | Допустим диапазон/тип | Обосновка / GM reaction |
   |------------|-----------------------|-------------------------|
   | `health` | `[0, 100]` (min 0, max 100 по подразбиране) | <0 не е позволено → GM маркира `dead` и насочва към load/save. |
   | `energy`, `stamina` | `[0, 100]` | Няма отрицателна стойност; 0 означава изтощен герой → нужда от rest. |
   | `mana` | `[0, 100]` | Не може да падне под 0; ако spell изисква повече mana → GM блокира действието. |
   | `hunger`, `thirst` | `[0, 100]` (0=наситен, 100=критично) | GM следи прагове (напр. >80 → приоритетна задача). |
   | `morale` | `[-100, 100]` | < -20 води до penalty (GM описва страх/паника); > 20 → бонус морал / увереност. |
   | `reputation.*` | `[-100, 100]` | Позволени са отрицателни стойности, но ограничени до трицифрени граници за читимост. |
   | `currency.gold` | `>=0`, без горна граница (Signed 32-bit int препоръка) | Забранени са отрицателни суми; при покупка GM проверява, че остатъкът остава ≥0. |
   | `level` / `skill_ranks` | `>=1` (няма нулев/отрицателен level) | Blank game шаблоните задават `min: 1`; GM валидира при runtime ако dev въведе 0/-1. |
   | `status_effects.*.stack` | `>=0` (integer) | Няма отрицателен stack; 0 = няма ефект. |
   | `date_time` | ISO8601, години ≥0001 | Консистентност при serialization. |
   | `flags.*` | bool | True/false; няма “null” като unlock стойност. |
- **GM validation & messaging:** GM валидира при старт; ако авто-създаде quest шаблон, съобщава пътя и какво да се попълни; при липсващи/дублирани capabilities дава ERROR с предложен fix.
- **Blank game README (LLM-friendly):** съдържа стъпки за LLM/dev: копирай `samples/blank-game/`; попълни `available`, `state`, area; задай `preferred_language`; попълни capabilities; стартирай играта (GM валидация); добавяй quest-ове докато играеш; следвай указанията за фиксове/орфани.
- **Language prompt пример:** “Choose language/style (e.g., English, Bulgarian, Pirate English, sarcastic English).”
- **Capabilities catalog:** engine предоставя master списък (~29 категории, 300+ способности) като база (виж Appendix `docs/analysis/capabilities-catalog.md`); игрите избират подмножество чрез `config/capabilities.json` и могат да добавят собствени.
- **Blank game README:** примерни стъпки + sample `config/capabilities.json` и `state.json` в `docs/analysis/blank-game-README.md` (LLM-friendly инструкции).
- **GM validation checklist (кратко):** при старт проверява задължителните файлове; валидира capabilities (CAP-* errors блокират); форматира съобщения `[LEVEL][CODE] file:message (suggested fix)`; WARN ≠ блокиране, но GM ги съобщава; ако auto-създаде quest/area → логва и казва какво да се попълни.
- **HUD (ui/hud.json) скелет (препоръка):**
  ```json
  {
    "schema_version": "ui.hud.v1",
    "bars": {"health": {"current": 32, "max": 100}, "energy": {"current": 12, "max": 100}, "mana": {"current": 0, "max": 100}},
    "status_effects": [{"id": "poisoned", "stack": 0}, {"id": "stunned", "active": false}],
    "reputation": {"guild": 15, "village": -5},
    "currency": {"gold": 120},
    "needs": {"hunger": 20, "thirst": 10, "fatigue": 5}
  }
  ```

## Step 4 — Metrics

### Primary Metrics (v1)
- **Time-to-first-active-quest**: минути от старт на сесията до първото добавяне в `active_quests`.
- **% успешни откази/превключвания без dead-end**: брой откази/смени, при които GM дава валиден списък/следваща стъпка ÷ общ брой откази/смени.
- **Validation pass rate**: % стартове без критични ERROR-и (GM описва проблема при fail).
- **% с ≥1 completed quest**: дял на сесиите, в които `completed-quests.json` има поне един запис.

### Secondary / Diagnostic
- **Avg exploration-log entries per session**.
- **% sessions с debug enabled**.
- **Avg retries to pass validation**: колко старта/фикса dev прави, преди validation да мине.
- **% стартове с CAP-* errors** (blocking capabilities validation).
- **Avg време до validation pass** (вкл. фиксове за CAP-*).

### Notes
- Validation резултатите се комуникират от GM в чата (в debug режим – подробни info/warn/error).
- Ако validation fail-не → dev може да повтори старт след поправка; метриката “avg retries” измерва този цикъл.
- Exploration-log може да се чете частично (последните ~10), но пълните данни са достъпни при поискване.
- Capabilities diagnostics (CAP-*): telemetry за % стартове с errors и време до fix; подробности в Appendix/README.

### Target users (recap)
- Persona A (GM/LLM facilitator): иска ясни правила, HUD/scene контракт, validation кодове и бързи диагностични сигнали.
- Persona B (game dev): иска минимален scaffolding (blank game), файлови договори, capabilities guide, валидатор с ясни грешки/фиксове, telemetry за “колко бързо минавам валидация”.
- Persona C (player-facing UI dev): чете ui/* read-only; няма backend.
- Persona D (analyst/QA): работи с telemetry/JSON логове и snapshot-и, интересува се от % CAP errors, време до pass, брой warnings по код.

### Capabilities contract (v1)
- `config/capabilities.json` е задължителен; snake_case ключове; `enabled` bool; диапазони с `min/max` или `range` (вместо min/max).
- Runtime в `player-data/runtime/state.json` под `stats`; всички enabled capabilities трябва да имат стойности. CAP-RUNTIME-RANGE е blocking, CAP-UNKNOWN-RUNTIME е warn.

### Metrics wiring (validator → telemetry)
- Валидаторът (tools/validator) изкарва JSON + telemetry log; вика се локално преди release.
- Диагностика: top_codes, errors/warns, CAP error count; snapshot показва New/Resolved кодове между run-ове.
- Препоръчан локален цикъл: `npm run validate -- --path games/<id> --json reports/last.json --append --snapshot reports/last.json --strict --summary`.
- Тълкуване: ако Summary:0/0 и CAP errors:0 → готово; ако snapshot New codes е празно и Resolved съдържа предишните проблеми → чисто.
- Validation резултатите се комуникират от GM в чата (в debug режим – подробни info/warn/error).
- Ако validation fail-не → dev може да повтори старт след поправка; метриката “avg retries” измерва този цикъл.
- Exploration-log може да се чете частично (последните ~10), но пълните данни са достъпни при поискване.
- Capabilities diagnostics (CAP-*): telemetry за % стартове с errors и време до fix; подробности в Appendix/README.

#### Най-нови измервания (22 дек 2025)
| Показател | Стойност | Източник |
|-----------|----------|----------|
| Средно време за run | ~103 ms (150 ms, 17 ms, 143 ms) | `telemetry-history.json` |
| Среден брой предупреждения | 1.67 → сведен до 0 след последния run | `telemetry-history.json` |
| Top codes преди fix | `SCHEMA-NOT-AVAILABLE` (2×), `MANIFEST-FIELD` (1×), `CAP-UNKNOWN-RUNTIME` (1×) | `telemetry-history.json` |
| Definition of Done | 3 последователни run-а с `errors=0`, `warnings=0`, CAP errors = 0 <br> + средно време <200 ms + snapshot `New codes = none` | Настояща практика |

*Бележка:* най-новият run `dev-20251222-1548a` покрива DoD (0 warnings/errors, snapshot clean). Следващите екипи трябва да архивират telemetry, когато се добавят ≥50 записи или след release (@docs/analysis/reports/telemetry-history.json#1-63).
