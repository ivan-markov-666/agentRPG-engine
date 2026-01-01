# ST-029 — Docs Alignment / MVP Docs Freeze

_Status: done_

## Story Overview
Като dev/QA искам MVP документацията да е в синхрон с реалния код и CLI интерфейси, за да избегнем drift-ове между docs, validator и tooling и да имаме “source of truth” за MVP.

## Acceptance Criteria
- [x] `docs/analysis/validation-plan.md` отразява реалния CLI contract (`--path`, `--run-id`, `--json`, `--append`, `--log`, `--snapshot`, `--ignore`, `--auto-archive`, `--strict`, `--summary`, `--debug`) и отбелязва, че `--no-telemetry` е депрекиран.
- [x] `docs/analysis/validator-readme.md` е синхронизиран:
  - [x] exploration log секцията и примерите използват само schema типовете `area|quest|event`, като е пояснено как legacy aliases се мапват.
  - [x] CI секцията е маркирана като optional/out of scope за MVP local-only режима.
- [x] `README.md` описва `validate:metrics` с предпочитан `--game` интерфейс и актуализира Git hook / exploration guardrails със същата терминология.
- [x] Промените не разширяват MVP scope — само документационен alignment.

## Tasks / Subtasks
- [x] Обнови `validation-plan.md` с текущия contract и explicit deprecation note.
- [x] Коригирай exploration type референциите в `validator-readme.md`, добави бележка за legacy aliases и маркирай CI примерите като optional.
- [x] Уеднакви `validate:metrics` usage и hook описанията в `README.md`, включително новата env променлива `ARPG_AUTO_ARCHIVE`.
- [x] Smoke тест: `npm run validate -- --help` за валидация на поддържаните флагове.


## Dev Agent Record / File List / Change Log
- `docs/analysis/validation-plan.md` — обновен с актуалните задължителни/опционални флагове и препратка към validate:metrics workflow.
- `docs/analysis/validator-readme.md` — синхронизиран exploration раздел + CI секцията маркирана като optional.
- `README.md` — Git hook и Sprint Metrics описанията вече съвпадат с реалния validate:metrics contract.
- Smoke тест: `npm run validate -- --help`.

## Status
done
