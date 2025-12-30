# ST-029 — Docs Alignment / MVP Docs Freeze

_Status: ready-for-dev_

## Story Overview
Като dev/QA искам MVP документацията да е в синхрон с реалния код и CLI интерфейси, за да избегнем drift-ове между docs, validator и tooling и да имаме “source of truth” за MVP.

## Acceptance Criteria
- [ ] `docs/analysis/validation-plan.md` е архивиран или обновен да отразява реалния CLI contract:
  - [ ] премахнати са остарели флагове като `--no-telemetry`;
  - [ ] актуални флагове (`--path`, `--run-id`, `--json`, `--append`, `--log`, `--snapshot`, `--ignore`, `--auto-archive`, `--strict`, `--summary`) са описани коректно.
- [ ] `docs/analysis/validator-readme.md` е почиствен от drift-ове:
  - [ ] exploration log примери използват само `type: area|quest|event` (или ясно е отбелязано, че legacy типове се мапнат от CLI към schema);
  - [ ] GitHub Actions CI пример е маркиран като “optional/out of scope” или премахнат, за да е в съответствие с “local-only” NFR.
- [ ] `README.md` (Sprint Metrics Workflow) е уеднаквен за `validate:metrics` usage:
  - [ ] предпочитаният интерфейс е `--game` (както в `tools/scripts/validate-metrics.js`);
  - [ ] ако се поддържа и `--path`, е отбелязано, че `--game` е препоръчителен.
- [ ] Всички промени са направени без да се променя MVP scope или deliverables — само alignment.

## Tasks / Subtasks
- [ ] Архивирай `validation-plan.md` като исторически draft или го обнови до текущия CLI contract.
- [ ] Провери и коригирай exploration type примери в `validator-readme.md`.
- [ ] Провери CI примери и ги маркирай като optional или премахни.
- [ ] Уеднакви `validate:metrics` usage в README.
- [ ] Минимален тест: пусни `npm run validate --help` и провери, че описаните флагове съвпадат.

## Dev Agent Record / File List / Change Log
- `docs/analysis/validation-plan.md`
- `docs/analysis/validator-readme.md`
- `README.md`

## Status
ready-for-dev
