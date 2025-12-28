# ST-009 — Metrics Insights Dashboard Doc

_Status: ready-for-dev_

## Story Overview
Като продукт/QA анализатор искам жив документ, който интерпретира KPI от metrics automation и предлага препоръки, за да разбера бързо дали валидаторният цикъл деградира.

## Acceptance Criteria
- [ ] Markdown документ `docs/analysis/metrics-insights.md` с раздели: Summary, KPI Trends, Alerts, Recommended Actions.
- [ ] Документът се обновява автоматично (или полуавтоматично) от `npm run metrics:report --insights` и включва последния timestamp.
- [ ] Поддържа threshold alerts (например CAP error >0%, avg runtime >200ms) и маркира в червено/emoji предупрежденията.
- [ ] README описва как да интерпретираш insights файла.

## Tasks / Subtasks
- [ ] Разшири metrics скрипта с `--insights` флаг, генериращ markdown сегменти.
- [ ] Добави шаблон (handlebars или string template) за секциите.
- [ ] Интегрирай цветовете/emoji за статуси (✅/⚠️/❌).
- [ ] Обнови документацията и добави примерен insights файл в repo.

## Dev Notes
- Insights файлът не е DoD критерий, но служи като „оперативен dashboard“.

## Dev Agent Record / File List / Change Log
_(pending)_

## Status
ready-for-dev
