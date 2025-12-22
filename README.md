# Alert!!! Under Active Development

# AgentRPG Engine — Workspace Guide

## Основни документи
- Product brief: `docs/analysis/product-brief-A RPG game engine for LLM models.-2025-12-19.md`
- Capabilities каталог: `docs/analysis/capabilities-catalog.md`
- Blank game README (шаблон за игра): `docs/analysis/blank-game-README.md`
- Валидатор (CLI) README: `docs/analysis/validator-readme.md`

## Валидатор (CLI)
- Пускане директно: `node tools/validator/index.js --path games/<gameId> [--json out.json] [--debug]`
- NPM script: `npm run validate -- --path games/<gameId> [--json out.json] [--debug]`
- Проверява: задължителни файлове, CAP-* правила, orphans (quests/areas), quest ID↔title; опционален JSON репорт.
- Локален pre-release run: `npm run validate -- --path games/<gameId> --json reports/last.json --append --snapshot reports/last.json --strict --summary`
- Alias примери:
  - PowerShell (в `$PROFILE`):
    ```powershell
    function arpg-validate {
      param([string]$game = "demo")
      npm run validate -- --path "games/$game" --json reports/last.json --append --snapshot reports/last.json --strict --summary
    }
    ```
- Примерни артефакти (docs/analysis/reports):
  - `snapshot-example.json` – демо за `--snapshot` (три поредни run-а).
  - `telemetry-example.json` – история на run-ове за `--log`.
- Живи файлове:
  - `latest-run.json` – последният JSON отчет от валидатора (overwrite при следващ run).
  - `telemetry-history.json` – апенднат telemetry лог (`--log ... --run-id ... --append`).
- Архивиране: `npm run archive:telemetry -- --label release-rc` (копира telemetry-history в `docs/analysis/reports/archive/<timestamp>-<label>.json` и нулира текущия файл).
- Run ID helper-и:
  - PowerShell profile (пример за `$PROFILE`):
    ```powershell
    Import-Module "$PSScriptRoot/../scripts/run-id.ps1"
    function arpg-run-id {
      param([string]$persona = "dev", [switch]$branch)
      New-AgentRPGRunId -Persona $persona -IncludeBranch:$branch
    }
    ```
    Изпълнение: `npm run validate -- --run-id (arpg-run-id -persona gm -branch)`
  - Bash `~/.bashrc`:
    ```bash
    source ~/Projects/LLMEngine/scripts/run-id.sh
    arpg_run_id() { run_id "${1:-dev}" "${2:-true}"; }
    ```
    Изпълнение: `npm run validate -- --run-id "$(arpg_run_id gm true)" ...`
- Комбиниран task (snapshot → telemetry → summary):
  - PowerShell: `npm run validate -- --path games/demo --json ".\\docs\\analysis\\reports\\latest-run.json" --log ".\\docs\\analysis\\reports\\telemetry-history.json" --run-id dev-001 --append --snapshot ".\\docs\\analysis\\reports\\snapshot-example.json" --strict --summary`
  - Bash: `npm run validate -- --path games/demo --json ./docs/analysis/reports/latest-run.json --log ./docs/analysis/reports/telemetry-history.json --run-id dev-001 --append --snapshot ./docs/analysis/reports/snapshot-example.json --strict --summary`
  - Bash/Zsh:
    ```bash
  arpg_validate() {
    game=${1:-demo}
    npm run validate -- --path "games/$game" --json reports/last.json --append --snapshot reports/last.json --strict --summary
  }
  ```

### Telemetry baseline (22 дек 2025)
| Показател | Стойност | Източник |
|-----------|----------|----------|
| Средно време за run | ~103 ms (150 ms, 17 ms, 143 ms) | `docs/analysis/reports/telemetry-history.json` |
| Среден брой предупреждения | 1.67 → 0 след финалния run `dev-20251222-1548a` | `telemetry-history.json`, `latest-run.json` |
| Най-чести кодове преди fix | `SCHEMA-NOT-AVAILABLE`, `MANIFEST-FIELD`, `CAP-UNKNOWN-RUNTIME` | `telemetry-history.json` |
| Definition of Done | ≥3 поредни run-а с `errors=0`, `warnings=0`, `CAP errors=0`, snapshot `New codes = none`, средно време <200 ms | Product brief Step 4 |

> Напомняне: при ≥50 run-а или преди release – пусни `npm run archive:telemetry -- --label <tag>` и рестартирай `telemetry-history.json`.

## Sprint 01 — Validator Reliability
- **Schema guardrails:** `config/capabilities.*` и `player-data/runtime/state.json` вече се валидират чрез JSON Schema + Ajv (вкл. `ajv-formats`). Валидацията следи вложени стойности (`reputation.*`, `currency.*`, `status_effects.*.stack>=0`) и връща `CAP-RUNTIME-RANGE` / `CAP-STATUS-STACK` при отклонения.
- **Unit & integration tests:** `tools/validator/tests/validator.test.js` покрива SCHEMA guardrails, YAML fallback, snapshot/ignore сценарий и изисква чист `scenario/index.md`.
- **Telemetry отчети:** пусни `npm run metrics:report` (по избор с `--history <file> --out <file> --limit <N>`), за да регенерираш `docs/analysis/metrics-summary.md` от `docs/analysis/reports/telemetry-history.json`.
- **DoD reminder:** ≥3 последователни чисти run-а (`errors=0`, `warnings=0`, `CAP errors=0`, snapshot `New codes = none`, средно време <200 ms). Документ: `docs/analysis/build-focus-2025-12-sprint01.md`.

## Къде са изходните файлове
- Валидатор код: `tools/validator/` (checks, reporters, utils).
- Конфигурации/документи: `docs/analysis/`.

## Отговорности (dev vs GM)
| Роля | Какво прави | Кога |
|------|-------------|------|
| Dev (feature branch) | Стартира `npm run validate ... --run-id dev-XX` преди push; поддържа `latest-run.json` чист. | Преди всеки PR / merge. |
| Dev (release candidate) | Пуска комбинирания task + `npm run archive:telemetry -- --label rc-<номер>`, ако историята надхвърля 50 run-а. | При смяна на спринт/RC. |
| GM / Facilitator | Чете telemetry-history, изисква архив преди major session; проверява snapshot (New codes = none). | Преди GM session и след финална QA проверка. |
| Analyst / QA | Изнася архивите (`docs/analysis/reports/archive/*.json`) към хранилище; анализира avg retries / mean time to green. | Седмична ретроспекция или при инцидент. |

## Забележка за UI
Engine-ът е file-first и няма UI; `ui/*.json` са read-only контракти за бъдещ viewer/framework.
