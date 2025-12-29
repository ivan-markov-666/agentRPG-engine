# ST-009 — Metrics Insights Dashboard Doc

_Status: done_

## Story Overview
Като продукт/QA анализатор искам жив документ, който интерпретира KPI от metrics automation и предлага препоръки, за да разбера бързо дали валидаторният цикъл деградира.

## Acceptance Criteria
- [x] Markdown документ `docs/analysis/metrics-insights.md` с раздели: Summary, KPI Trends, Alerts, Recommended Actions.
- [x] Документът се обновява автоматично (или полуавтоматично) от `npm run metrics:report --insights` и включва последния timestamp.
- [x] Поддържа threshold alerts (например CAP error >0%, avg runtime >200ms) и маркира в червено/emoji предупрежденията.
- [x] README описва как да интерпретираш insights файла.

## Tasks / Subtasks
- [x] Разшири metrics скрипта с `--insights` флаг, генериращ markdown сегменти.
- [x] Добави шаблон (handlebars или string template) за секциите.
- [x] Интегрирай цветовете/emoji за статуси (✅/⚠️/❌).
- [x] Обнови документацията и добави примерен insights файл в repo.

## Dev Notes
- Insights файлът не е DoD критерий, но служи като „оперативен dashboard“.

## Dev Agent Record / File List / Change Log
- `tools/metrics/report.js` — нов `--insights` флаг, KPI шаблон с емоджи статуси и автоматично генериране на alerts/recommended actions.
- `docs/analysis/metrics-insights.md` — генериран insights документ (Summary, KPI Trends, Alerts, Recommended Actions).
- `tools/tests/metrics-report.test.js` + `package.json` — smoke тест за summary+insights output в `npm test`.
- `README.md` — секция „Metrics Insights Dashboard“ с инструкции за генериране и интерпретация.

## Status
done
