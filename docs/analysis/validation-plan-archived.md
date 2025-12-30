# Validation & Telemetry Plan (archived draft)

> **Archived:** This document is a historical draft. Current CLI contract is documented in `docs/analysis/validator-readme.md` and the real implementation in `src/cli/validate.ts`.

---

# Validation & Telemetry Plan (draft)

## Goal
CLI валидатор за игри върху AgentRPG Engine: проверка на файлови договори + CAP-* правила, плюс telemetry summary за метрики.

## Scope (v0)
- Read-only CLI (Node) без зависимост от UI.
- Работи върху `games/<gameId>/` път.
- Изход: текстови лог в консола + JSON summary (опция).

## Input
- Път към игра (`--path games/<gameId>`).
- Опции: `--json <file>` (запис на summary), `--no-telemetry` (прескача telemetry), `--debug` (info/warn/error).

## Checks (минимум)
1) Файлове: `manifest/entry.json`, `scenario/index.md`, `scenario/quests/available.json`, `scenario/quests/unlock-triggers.json`, `player-data/runtime/state.json`, `player-data/runtime/completed-quests.json` (или празен), `player-data/runtime/exploration-log.json` (ако exploration се ползва), `config/capabilities.json`.
2) Capabilities (CAP-*): missing, dup, range, runtime липси, unused.
3) Orphans: active quest без файл; area липсва за current_area_id.
4) Quest ID↔title mismatch: `available.json` vs quest файлове.
5) Formats: JSON parse; YAML е optional (ако detect-нем .yml/.yaml).

## Output формат
- Конзола: `[LEVEL][CODE] file:message (suggested fix)` (LEVEL: ERROR/WARN/INFO).
- Exit code: 0 ако няма ERROR; 1 ако има.
- JSON summary (пример):
```json
{
  "errors": 2,
  "warnings": 3,
  "cap_errors": 1,
  "duration_ms": 120,
  "issues": [
    {"level": "ERROR", "code": "CAP-MISSING", "file": "config/capabilities.json", "message": "add key 'mana'"}
  ]
}
```

## Telemetry (диагностични метрики)
- `% стартове с CAP-* errors` (от count/total).
- `avg време до validation pass` (може да се логне timestamp на pass/run_id в отделен лог файл).
- `avg retries` (дял run_id преди pass), ако е наличен лог.

## CLI usage (предложение)
- `npx agentrpg-validate --path games/demo`
- `npx agentrpg-validate --path games/demo --json validation-report.json --debug`

## File layout (предложение)
- `tools/validator/index.js` (CLI entry)
- `tools/validator/checks/files.js`
- `tools/validator/checks/capabilities.js`
- `tools/validator/checks/orphans.js`
- `tools/validator/checks/quests.js`
- `tools/validator/reporters/console.js`
- `tools/validator/reporters/json.js`

## Minimal pseudo
```
run(path, opts):
  load files; collect issues = []
  issues += checkRequiredFiles(path)
  issues += checkCapabilities(path)
  issues += checkOrphans(path)
  issues += checkQuestTitles(path)
  print/report(issues)
  exit code = 1 if any ERROR else 0
```

## Next steps
- Скелет на CLI (Node) с горния layout.
- Имплементация на checks с референция към CAP-* дефинициите в каталога.
- Опционален JSON изход за telemetry pipeline.
