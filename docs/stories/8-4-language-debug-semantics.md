# ST-034 — Language Preference & Debug Messaging Semantics

_Status: done_

## Story Overview
Като GM/runtime facilitator искам езиковите предпочитания и debug режимът да имат ясни договори (session-init + runtime state), за да може GM/LLM да спазва избрания стил на играча и да изкарва диагностични съобщения в консистентен формат.

## Acceptance Criteria
- [x] `player-data/session-init.json` съдържа задължително поле `preferred_language` (string) и опционално `debug: true|false`; schema/validator enforce-ват тези правила.
- [x] Runtime (GM scripts или helper) записва/обновява `preferred_language` при смяна и го потвърждава при рестарт; съществува sample flow в docs.
- [x] Debug flag се активира при `debug: true` или при стартов prompt "debug"; runtime записва локален флаг и formatter-ът изкарва съобщения във формат `[LEVEL][CODE] file:message (suggested fix) [ctx]`.
- [x] Validator/runtime CLI имат switch за debug и показват WARN/INFO само когато е активен.
- [x] Документацията съдържа препоръчителен prompt ("Choose language/style") и примери за debug output.
- [x] Добавени са тестове (session-init schema tests + runtime/unit) за промяна на език и за debug formatting.

## Tasks / Subtasks
- [x] Обнови `tools/validator/schemas/session-init.schema.json` (или екв.) за `preferred_language`/`debug` полета.
- [x] Обнови runtime loader/CLI, за да чете/записва `preferred_language` и debug флага.
- [x] Имплементирай formatter helper за `[LEVEL][CODE] file:message (suggested fix) [ctx]` и го използвай в validator/runtime логове.
- [x] Добави sample session-init файл и README инструкции (language selection flow).
- [x] Добави unit/integration tests.

## Dev Agent Record / File List / Change Log
- `tools/validator/schemas/session-init.schema.json`
- `src/types/session.ts`, `src/runtime/cli-options.ts`
- `src/runtime/logging.ts` (debug formatter)
- `tools/tests/session-init.test.ts`, `tools/tests/debug-format.test.ts`
- `docs/analysis/validator-readme.md`, `README.md`

## Status
done
