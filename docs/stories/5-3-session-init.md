# ST-015 — Session Init Contract (language + debug)

_Status: done_

## Story Overview
Като engine dev искам schema и типов договор за `player-data/session-init.json`, за да е ясно как се задава предпочитан език/стил и debug режим при старт.

## Acceptance Criteria
- [x] Има TypeScript тип `SessionInit`.
- [x] Има JSON schema за `player-data/session-init.json`.
- [x] Валидаторът валидира файла по schema, ако файлът съществува.

## Tasks / Subtasks
- [x] Добави `SessionInit` тип.
- [x] Добави `session-init.schema.json`.
- [x] Включи schema-та в validator schema pipeline.

## Dev Agent Record / File List / Change Log
- `src/types/session-init.ts`
- `tools/validator/schemas/session-init.schema.json`
- `src/validator/checks/schema.ts`

## Status
done
