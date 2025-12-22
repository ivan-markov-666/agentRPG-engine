---
stepsCompleted: [1, 2, 3]
inputDocuments: []
session_topic: 'AgentRPG Engine: как работи engine-ът като платформа и как игрите се добавят/избират като зависимости (capabilities)'
session_goals: 'Да изясним core concepts и dependency/capability модела (вкл. опционални системи като mana), да идентифицираме рискове/unknowns, и да дефинираме следващи стъпки преди Product Brief/PRD'
selected_approach: 'ai-recommended'
techniques_used: ['First Principles Thinking', 'Morphological Analysis', 'Decision Tree Mapping']
ideas_generated: []
context_file: '.bmad/bmm/data/project-context-template.md'
---

# Brainstorming Session Results

**Facilitator:** Master
**Date:** 2025-12-14T16:45:00+02:00

## Session Overview

**Topic:** AgentRPG Engine — как engine-ът работи като платформа и как игрите се добавят към него като независими пакети.

**Goals:**
- Да дефинираме core concepts (термини/абстракции) за engine-а.
- Да изясним dependency/capability модела: engine-ът предлага готови системи (HP/stamina/mana/time/inventory и т.н.), а всяка игра избира кои да използва; ако игра не използва дадена capability (напр. mana), engine-ът трябва да я изключи от UI/състояние/логика за конкретната игра.
- Да идентифицираме ключови рискове и unknowns (новаторско R&D) и да изкараме next steps преди Product Brief/PRD.

## Technique Selection

**Approach:** AI-Recommended Techniques
**Analysis Context:** {{session_topic}} с фокус върху {{session_goals}}

**Recommended Techniques:**
- **First Principles Thinking:** да фиксираме инварианти и дефиниции (capability, game package, contract, state) без да “копираме” познати решения.
- **Morphological Analysis:** да проучим систематично комбинациите на capability модел (optional/disabled/required), ownership на state, UI exposure, versioning, extension points.
- **Decision Tree Mapping:** да превърнем концепциите в ясни decision flows (зареждане на игра, активиране/деактивиране на capabilities, compatibility проверки, обновяване на engine).

**AI Rationale:** Тема с висока неопределеност + комбинаторна сложност. Нужни са (1) ясни инварианти, (2) систематично покриване на варианти, (3) конкретни “ако/тогава” правила за runtime.

## First Principles (Invariants)

- **Game package + предварителна структура:** Играта е пакет/модул, който се интегрира с предварително създадена структура от файлове/документи, описващи логиката, предоставени/наложени от engine-а.
- **Capabilities (готови системи):** Engine-ът предоставя capabilities (напр. `hp`, `stamina`, `mana`, `time`, `inventory`, `equipment` и др.).
- **Избор на capabilities:** Не играта “решава”, а **авторът на играта** (developer-ът) избира кои capabilities да включи/активира за конкретната игра.
- **Disabled capability поведение:** Ако capability не е избрана/активирана за дадена игра (напр. `mana`), engine-ът трябва да я третира като изключена за тази игра (без UI метрика/без логика за нея за тази игра).
- **Backward compatibility:** Обновяванията на engine-а трябва да са backward compatible спрямо публичните contracts към игрите.
- **Pinning/минимални версии:** Всяка игра трябва да може да “pin-не” минимална версия на contract/capabilities, които изисква.
- **State е сериализируем:** Game state трябва да е сериализируем (save/load) и независим от UI.
- **Структуриран UI contract:** LLM/GM output към UI и към gameplay логиката трябва да минава през структуриран contract/schema (не само свободен текст).

## Core Concepts v0 (Locked)

### `Game Package`
- **Решение:** **100% data-driven**.
- **Дефиниция:** Самостоятелен пакет/модул (директория/репо), който съдържа документи/данни на играта и се интегрира със **структура от файлове/документи**, предоставена/наложена от engine-а.
- **Инвариант:** Няма game-side код/плъгини; логиката се описва чрез документи/конфигурации.

### `Capability`
- **Решение:** Да, engine-ът предоставя capabilities; всяка capability се управлява **поотделно** (enabled/disabled/конфиг) за конкретна игра.
- **Дефиниция:** Модулна система/feature на engine-а (напр. `mana`, `inventory`, `time`) със собствен state model, правила/валидатори и UI exposure, която може да бъде включена/изключена per game.

### `Manifest`
- **Решение:** **Един файл**.
- **Дефиниция:** Главен входен документ на играта, който engine чете първи, за да определи идентичност/версия на играта, активирани capabilities и ключови зависимости/пинове.
- **Бележка:** Ако някога стане голям, може да реферира към други документи, но остава “entrypoint”.

### `Contract/Schema` (UI + state)
- **Решение:** **Semi-structured + валидиране**.
- **Дефиниция:** Версионирани договори (schemas), които описват:
  - UI contract (как се описва сцена/HUD/действия)
  - State contract (как изглежда canonical game state за save/load)

### `Engine Core` vs `Game Logic`
- **Решение:** Да, разграничението е валидно; играта може да има custom правила, но **не може да нарушава** правилата/ограниченията на engine-а.
- **Engine Core:** runtime, loader, capability registry, валидиране, save/load, compatibility checks, UI адаптер.
- **Game Logic:** документи/конфигурации (data-driven), които параметризират и “инстанцират” правилата за конкретната игра.

### `Rules/Systems`
- **Решение:** По-скоро **играта носи rules**, а engine предоставя framework.
- **Дефиниция:** Правила/системи, описани data-driven от играта (в рамките на engine framework), които управляват промени в state при събития/действия.

## Open Questions (затворени)

- **Custom capabilities (решение):** Capabilities са **само engine-provided**; играта само ги включва/изключва и конфигурира.
- **Валидиране на schema (решение):** Валидиране със **JSON Schema**.

## Morphological Analysis (Capability Model)

### Заключени решения (от контекста)
- **Activation timing:** Capabilities се определят **статично** при зареждане на играта (manifest/package-time).
- **Runtime toggles:** **Няма** динамично включване/изключване по време на игра.

### Morphological matrix (оси → опции)

| Ос (Dimension) | Опции (Options) | Избор |
| --- | --- | --- |
| Capability presence per game | required / optional / forbidden | optional |
| Configuration surface | none / minimal (defaults) / full (per-game config) | full |
| State lifecycle | created-on-load / lazy-init / derived-only | created-on-load |
| Persistence | persisted (save/load) / transient / derived (recomputable) | persisted (default; exceptions per capability) |
| UI exposure | hidden / minimal / full | minimal (default; can be configured to full at load) |
| State ownership | engine core / capability module (engine-owned) | capability module (engine-owned) |
| Version compatibility policy | strict pin / semver range / latest compatible | semver range |
| Migration strategy | none (break) / engine provides migrators / per-capability migrators | per-capability migrators |

**Notes:**
- **Persistence exceptions:** Някои capabilities могат да са `transient` или `derived`, но това е изрично решение на capability-то (и се валидира спрямо schema/contract).
- **UI exposure overrides:** Default е `minimal`, но game manifest/config може статично при load да “вдигне” дадена capability до `full`.

## Decision Tree Mapping

### Decision Flow A: Load Game (package-time, статично)

1. **Input:** `game_package_path`
2. **Read:** `manifest`
  - IF `manifest` липсва/невалиден → **Fail: InvalidGamePackage**
3. **Resolve engine + contract versions**
  - IF `manifest` изисква версии извън **semver range** (несъвместимо) → **Fail: IncompatibleEngineOrContracts**
4. **Resolve capability set (engine-provided only)**
  - capability_presence = `optional`
  - IF `manifest` реферира неизвестна capability → **Fail: UnknownCapability**
  - IF `manifest` включва capability, маркирана като `forbidden` за играта → **Fail: ForbiddenCapability**
5. **Load per-capability configuration (configuration surface = full)**
  - IF config за capability не минава валидиране → **Fail: InvalidCapabilityConfig**
6. **Build schema bundle (JSON Schema)**
  - UI contract schema
  - State contract schema
  - Per-capability schemas
7. **Initialize state (created-on-load)**
  - For each enabled capability:
    - allocate state slice
    - set defaults from config
    - IF initial state invalid по schema/validators → **Fail: InvalidInitialState**
8. **UI exposure plan**
  - Default UI = `minimal`
  - IF manifest/config задава `full` за capability → expose full UI за нея
9. **Output:** `game_runtime` = {resolved_manifest, capability_registry, state_store, schema_bundle, ui_exposure_plan}

### Decision Flow B: Load Save / Resume

1. **Input:** `save_blob`
2. **Validate save header**
  - game id/version
  - engine/contracts versions
3. **Compatibility check (semver range)**
  - IF несъвместимо → **Fail: IncompatibleSave**
4. **Migrate save (per-capability migrators)**
  - For each capability state slice in save:
    - IF migrator missing for required migration step → **Fail: MissingMigrator**
    - else apply migrations to target schema/version
5. **Validate migrated state (JSON Schema)**
  - IF invalid → **Fail: InvalidSaveState**
6. **Instantiate runtime**
  - capability set се определя статично от manifest (както в Flow A)
  - IF save съдържа state за capability, която е disabled в manifest →
    - policy: **warn + preserve (cold storage)**
7. **Output:** `game_runtime` (resumed)

### Decision Flow C: Save Game

1. **Input:** `game_runtime`
2. **Collect persisted state slices**
  - persistence default = `persisted`
  - IF capability е `transient`/`derived` → не се сериализира
3. **Validate save payload (JSON Schema)**
  - IF invalid → **Fail: CannotSaveInvalidState**
4. **Write:** `save_blob` (вкл. versions + capability set + state)

## Decisions (Locked)

- **Load Save, disabled capability state (решение):** **warn + preserve (cold storage)**
