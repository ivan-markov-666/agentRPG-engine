# ST-028 — Pre-push Hook (validate + metrics)

_Status: done_

## Story Overview
Като dev искам опционален git pre-push hook, който да изпълнява `validate:metrics` преди `git push`, за да предотвратя качване на невалиден game package и да поддържам DoD дисциплина.

## Acceptance Criteria
- [x] Има bash скрипт `scripts/pre-push-validate.sh`, който изпълнява `npm run validate:metrics` с параметри от env vars (`ARPG_GAME`, `ARPG_RUN_ID`, `ARPG_LIMIT`).
- [x] Има PowerShell еквивалент `scripts/pre-push-validate.ps1` със същото поведение.
- [x] Hook-ът връща non-zero exit code при fail и блокира push-а.
- [x] README съдържа инструкции за инсталиране под `.git/hooks/pre-push` (Bash) и Windows/Pwsh вариант.
- [x] Hook-ът е opt-in (не се инсталира автоматично) и има ясно описани prerequisites.

## Tasks / Subtasks
- [x] Уточни и фиксирай env vars / default values.
- [x] Добави smoke test (документен или скриптов) за проверка на exit codes, без да изисква реален git push. (README описва командите `ARPG_RUN_ID=test scripts/pre-push-validate.sh` и PowerShell еквивалент за локална проверка.)

## Dev Agent Record / File List / Change Log
- ✅ `scripts/pre-push-validate.sh` — Bash hook, който чете `ARPG_*` env променливи, дефолт `ARPG_AUTO_ARCHIVE=50`, формира `validate:metrics` аргументи и доверява exit кода.
- ✅ `scripts/pre-push-validate.ps1` — PowerShell еквивалент със същите env fallbacks и git-root детекция.
- ✅ `README.md` — “Git hook (pre-push validate + metrics)” блок с инструкции за инсталация, opt-in забележки и smoke тест стъпки.

## Status
done
