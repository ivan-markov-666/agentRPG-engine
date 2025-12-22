# Build Focus — Sprint 01 (Validator Reliability)

_Date: 2025-12-22_

## Objective
Засилване на локалния validator/telemetry цикъл, така че DoD да стане автоматично проследим и да покрива всички guardrails за capabilities и runtime state.

## Hypothesis
Ако подсилим validator-а с пълни тестове, схеми за capabilities/state и автоматизирано изчисляване на метриките, dev/QA екипът ще открива проблемите преди GM да стартира сесия и ще спестим поне 1 повторен run на спринт.

## Key Metrics / KPIs
- % run-ове с CAP-* errors (очакване: 0%).
- Средно време за run (цел: <200 ms, вече 103 ms → мониторинг).
- Avg retries до чист run (цел: 1.0 → запазване).
- Автоматично обновяване на `metrics-summary` след всеки batch run.

## In-Scope Backlog Items
| ID | Описание | Забележки |
|----|----------|-----------|
| FR-01 | Validator workflow DoD (комбиниран run, snapshot, telemetry). | Потвърждаваме/задържаме текущия UX, добавяме тестове. |
| FR-04 | Capabilities guardrails | Отразяване на таблицата в schema + runtime checks. |
| FR-07 | Metrics tracking | Скрипт за автоматично обновяване на metrics summary. |
| T-01 | Validator test coverage | Интеграционни тестове за CLI флаговете и telemetry append. |
| T-02 | Capabilities schema extension | Конкретни правила (min/max non-negative). |
| T-03 | Runtime schema alignment | Строги типове за `stats`, nested maps, non-negative числа. |
| T-06 | Metrics automation | Node script, интегриран в npm task. |

_Out of scope:_ UI viewer, exploration log schema, storyboarding (FR-05/06, T-04/05) → следващ спринт.

## Deliverables
1. Обновени JSON schemas + validator checks (capabilities/state).
2. Обновен тестов пакет covering CLI флагове и CAP guardrails.
3. `npm run metrics:report` (пример) → генерира или обновява `docs/analysis/metrics-summary.md` от telemetry history.
4. Документиран процес в README/PRD (кратък раздел "Sprint 01 Build Focus").

## Risks / Mitigations
- **Schema твърдост**: новите правила могат да счупят съществуващи sample игри → осигуряваме opt-in флаг или ясно описание за миграция.
- **Тест runtime**: повече интеграционни тестове може да забавят `npm test` → групираме ги под отделен script (`npm run test:validator`).
- **Telemetry scripts**: автоматичният репорт може да overwrite данни → правим dry-run и архив преди запис.

## Timeline (target)
- Ден 1–2: Схеми + validator code, синхронизиран с demo config.
- Ден 3: Тестове + telemetry metrics script.
- Ден 4: Документация и dry-run (3 чисти run-а, автоматично генериран summary).
- Ден 5: Ретроспекция + план за следващия експеримент (вероятно Exploration log / Viewer UI).
