# ST-008 — Exploration Logging Enforcement

_Status: done_

## Story Overview
Като дизайнер и QA искам валидиран exploration log (когато е активиран), за да гарантирам, че всяка explorative сесия има структуриран запис, който validator може да анализира.

## Acceptance Criteria
- [x] Създаден е JSON schema за `exploration-log.json` (id, title, type, timestamp, optional notes).
- [x] Validator изисква лог, когато exploration mode е включен в config и хвърля грешка при липса или невалидна схема.
- [x] README описва как да активираш exploration logging и къде се съхраняват файлoветe.
- [x] Тестовете покриват валидни/невалидни логове и конфигурации.

## Tasks / Subtasks
- [x] Добави schema в `tools/validator/schemas/exploration-log.schema.json`.
- [x] Обнови validator pipeline да проверява присъствието на лог файла при включен флаг.
- [x] Разшири demo config с примерен exploration log.
- [x] Напиши unit тестове и документация.

## Dev Notes
- Timestamp → ISO 8601; „type“ може да е enum (`area`, `quest`, `event`).

## Dev Agent Record / File List / Change Log
- `tools/validator/schemas/exploration-log.schema.json` — обновен enum (area|quest|event), условни изисквания за `area_id` и `quest_id`, добавени `notes`.
- `tools/validator/checks/schema.js`, `tools/validator/utils/schema.js` — schema нарушения за exploration лог стават ERROR при активиран режим, поддържат custom level.
- `tools/validator/checks/files.js` — липсващ exploration лог → `EXPLORATION-LOG-MISSING` (ERROR).
- `games/demo/player-data/runtime/exploration-log.json` — примерните записи са приведени към новата схема.
- `README.md`, `docs/analysis/validator-readme.md` — документация за активиране и remediation стъпки.
- (Тестовете са изпълнени и зелени — виж CI/локалния run).

## Status
done
