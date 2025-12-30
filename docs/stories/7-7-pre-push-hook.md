# ST-028 — Pre-push Hook (validate + metrics)

_Status: ready-for-dev_

## Story Overview
Като dev искам опционален git pre-push hook, който да изпълнява `validate:metrics` преди `git push`, за да предотвратя качване на невалиден game package и да поддържам DoD дисциплина.

## Acceptance Criteria
- [ ] Има bash скрипт `scripts/pre-push-validate.sh`, който изпълнява `npm run validate:metrics` с параметри от env vars (`ARPG_GAME`, `ARPG_RUN_ID`, `ARPG_LIMIT`).
- [ ] Има PowerShell еквивалент `scripts/pre-push-validate.ps1` със същото поведение.
- [ ] Hook-ът връща non-zero exit code при fail и блокира push-а.
- [ ] README съдържа инструкции за инсталиране под `.git/hooks/pre-push` (Bash) и Windows/Pwsh вариант.
- [ ] Hook-ът е opt-in (не се инсталира автоматично) и има ясно описани prerequisites.

## Tasks / Subtasks
- [ ] Уточни и фиксирай env vars / default values.
- [ ] Добави smoke test (документен или скриптов) за проверка на exit codes, без да изисква реален git push.

## Dev Agent Record / File List / Change Log
- `scripts/pre-push-validate.sh`
- `scripts/pre-push-validate.ps1`
- `README.md`

## Status
ready-for-dev
