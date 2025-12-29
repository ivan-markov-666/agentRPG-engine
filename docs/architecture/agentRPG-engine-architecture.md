# AgentRPG Engine — Architecture Blueprint (v1)

_Last updated: 2025-12-28_

## 1. Purpose & Scope
Този документ дефинира системната архитектура на AgentRPG Engine за Sprint 01 и следващите цикли. Основната цел е да опише слоевете, интеграциите и артефактите, нужни за локален GM/LLM контрол, валидаторския pipeline и guardrails за capabilities/state.

## 2. Context & Constraints
- **Field type:** Greenfield, локален runtime без външни услуги.
- **Primary actors:**
  - Dev/QA екип (стартира CLI команди, поддържа schemas и тестове).
  - GM LLM агент (консумира "GM context bundle" от файлове).
  - Tooling/Validator процеси (npm scripts, telemetry, metrics).
- **Non-functional изисквания:** BG документация, локално съхранение, telemetry privacy, extensibility чрез manifest `engine_layers`.

## 3. High-Level View
```
+----------------------+        +--------------------+        +----------------------+
| Content Packages     |----->  | Validation Layer   |----->  | GM Runtime Orchestr. |
| (quests, configs)    |        | (CLI + schemas)    |        | (LLM GM, scenarios)   |
+----------------------+        +--------------------+        +----------------------+
        |                               |                               |
        v                               v                               v
  Docs / Analysis                Telemetry & Metrics             Game Session Outputs
```

## 4. Subsystems
1. **Content & Contracts**
   - Файлова структура (YAML/MD/JSON) под `games/` и `docs/analysis`.
   - Manifest описва входните точки (scenario index, quest registry, capabilities catalog).
   - Guardrails таблици се държат синхронизирани между Product Brief и `games/demo/config/capabilities.json`.

2. **Validation & Tooling**
   - `npm run validate` → orchestrates JSON schema validation (capabilities, state, quests), telemetry logging и snapshot comparisons.
   - CLI флагове (FR-01) гарантират repeatability (`--run-id`, `--summary`, др.).
   - Telemetry history + metrics automation (FR-07) поддържат DoD метриките.

3. **State & Runtime Contracts**
   - Runtime state се пази отделно от статичния content; schema гарантира non-negative стойности и типове.
   - Exploration logging и scenario/quest contracts (FR-05/06) описват синхронизацията между `scenario/index.md`, `available.json`, `unlock-triggers.json` и quest файловете.

4. **Observability & Reporting**
   - Telemetry артефакти: `telemetry-history.json`, архиви (`docs/analysis/reports/archive/`).
   - Metrics summary автоматично се обновява чрез `npm run metrics:report` (ST-003).
   - Sprint артефакти (build focus, sprint plan) живеят под `docs/sprint-artifacts`.

## 5. Data Flow
1. Dev обновява content/schema → пуска `npm run validate`.
2. Validator:
   - зарежда capabilities/state schemas;
   - проверява quests + scenario contracts;
   - генерира telemetry + snapshot + summary.
3. Telemetry попада в history и trigger-ва metrics скрипта.
4. GM runtime получава валидиран bundle (content + state) и изпълнява игровата сесия.

## 6. Technology Stack
- **Runtime:** Node.js/npm скриптове (локално), JSON/YAML документи, AJV (или екв. schema validator).
- **Scripting:** PowerShell/Bash helpers (`scripts/run-id.*`, архивиране).
- **Documentation:** Markdown каталози в `docs/analysis`, `docs/architecture`, `docs/stories`.
- **TypeScript Strategy (EP-004):**
  1. **Tooling Bootstrap (ST-010):** Въведени са `tsconfig.json` (strict, Node16, alias `@types/*`), `tsconfig.build.json` (declaration/source maps към `dist/`), ESLint + Prettier конфигурации и npm скриптове `typecheck`, `build:ts`, `lint:ts`. Shared типове живеят в `src/types/` и се експортират чрез barrel `src/types/index.ts`.
  2. **Core Type Definitions (ST-011):** Типовете `CapabilityRanges`, `RuntimeState`, `QuestDefinition`, `UnlockTrigger`, `ExplorationLogEntry` се поддържат от един източник и се експортират към validator/CLI.
  3. **Validator CLI Migration (ST-012):** CLI логиката преминава към TS (`src/cli/validate.ts` → `dist/cli/validate.js`), за да използва строгите типове и да гарантира безопасни DoD run-ове.
  4. **Adoption Flow:** JS файловете се мигрират story по story; сборният TS build остава задължителен gate преди release. Документацията описва как да се добавят нови типове при промени в schema.

## 7. Security & Guardrails
- Няма външни заявки → focus върху consistency.
- Capabilities guardrails → schema enforced + validator warnings.
- Telemetry privacy → всички логове локално, архивация преди споделяне.

## 8. Open Items & Future Enhancements
1. UI layer / viewer (out-of-scope за Sprint 01) → ще изисква UX workflow.
2. Exploration log schema & viewer (FR-06, T-05) → предстоящо.
3. Automation hooks (CI-like) за валидаторските тестове, макар проектът да е локален.

---
Този blueprint служи като изход за `create-architecture` workflow и осигурява база за implementation-readiness.
