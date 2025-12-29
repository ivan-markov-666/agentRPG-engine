# ST-008 — Exploration Logging Enforcement

_Status: in-progress_

## Story Overview
Като дизайнер и QA искам валидиран exploration log (когато е активиран), за да гарантирам, че всяка explorative сесия има структуриран запис, който validator може да анализира.

## Acceptance Criteria
- [ ] Създаден е JSON schema за `exploration-log.json` (id, title, type, timestamp, optional notes).
- [ ] Validator изисква лог, когато exploration mode е включен в config и хвърля грешка при липса или невалидна схема.
- [ ] README описва как да активираш exploration logging и къде се съхраняват файлoветe.
- [ ] Тестовете покриват валидни/невалидни логове и конфигурации.

## Tasks / Subtasks
- [ ] Добави schema в `tools/validator/schemas/exploration-log.schema.json`.
- [ ] Обнови validator pipeline да проверява присъствието на лог файла при включен флаг.
- [ ] Разшири demo config с примерен exploration log.
- [ ] Напиши unit тестове и документация.

## Dev Notes
- Timestamp → ISO 8601; „type“ може да е enum (`area`, `quest`, `event`).

## Dev Agent Record / File List / Change Log
_(pending)_

## Status
in-progress
