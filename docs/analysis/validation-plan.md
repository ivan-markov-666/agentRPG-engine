# Validation & Telemetry Plan (MVP-aligned)

> This document reflects the **current** validator CLI contract that ships with the MVP toolchain.  
> For the historical proposal, see `docs/analysis/validation-plan-archived.md`.

## CLI target
- Entry point: `npm run validate -- --path games/<gameId> --run-id <tag>`
- Dev shortcut (no build): `npm run validate:dev -- --path games/<gameId> --run-id <tag>`

## Required flags
| Flag | Description |
|------|-------------|
| `--path`, `-p` | Absolute или относителен път до `games/<gameId>` (валидаторът работи само върху конкретна игра). |
| `--run-id` | Идентификатор на run-а (напр. `dev-20260101-1300`). Скриптът отпада с `[ERROR][RUN-ID]` ако липсва. |

## Optional flags (current contract)
| Flag | Purpose |
|------|---------|
| `--json <file>` | Пише последния run като JSON. |
| `--append` | В комбинация с `--json` апендва към масив вместо overwrite. |
| `--log <file>` | Записва telemetry history (изисква `--run-id`). |
| `--auto-archive <N>` | При `--log` архивира telemetry историята, когато дължината ѝ ≥ N. |
| `--snapshot <file>` | Сравнява текущия run с предишен JSON (показва New/Resolved codes). |
| `--ignore CODE1,CODE2` | Временно игнорира изброените кодове (само локално). |
| `--strict` | Ескалира WARN до ERROR. |
| `--summary` | Показва само обобщение в конзолата. |
| `--debug` | Показва INFO лога от чековете. |

> ⚠️ Остарели флагове като `--no-telemetry` вече не се поддържат. Guardrail-ите за telemetry се конфигурират чрез `--log` + `--auto-archive`.

## Validate + Metrics workflow
1. `npm run validate:metrics -- --game <gameId> --run-id <tag>` е препоръчителният wrapper. Той извиква валидатора, telemetry логване и `metrics:report`.  
2. Може да подадеш и `--path games/<gameId>`, но `--game` е canonical интерфейс (същия, който използва `tools/scripts/validate-metrics.ts`).  
3. Допълнителни флагове (`--limit`, `--history`, `--auto-archive`, `--dry-run`) са описани в README → Sprint Metrics Workflow.

## Source of truth
- **Logic**: `src/cli/validate.ts`
- **Docs**: `docs/analysis/validator-readme.md`
- **Helper scripts**: `tools/scripts/run-id.(ps1|sh)`, `scripts/pre-push-validate.(sh|ps1)`

Този документ служи като кратък reference sheet за QA/Dev екипа, за да избегнем drift между code и документация.
