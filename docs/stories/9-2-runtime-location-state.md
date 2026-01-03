# ST-033 — Runtime State & Telemetry Updates

_Status: ready-for-dev_

## Story Overview
Като runtime engineer искам състоянието на играча да пази текуща локация, история на посещенията и координати на картата, за да можем да визуализираме реално движение, да измерваме exploration telemetry и да предотвратяваме невалидни позиции.

## Acceptance Criteria
- [ ] `player-data/runtime/state.json` включва нов обект `current_location` с полета `area_id`, `hotspot_id`, `coordinates {x,y}`, `map_ref` (път към JSON), както и масив `visited_locations[]` със записи `{ area_id, hotspot_id, first_visited_at }`.
- [ ] JSON schema за state (`tools/validator/schemas/state.schema.json`) е обновено с новите структури + guardrails (валидни ID pattern-и, `coordinates` >=0, `hotspot_id` задължителен при наличие на карта).
- [ ] Telemetry (`telemetry-history.json`) записва метрики за движение: `location_updates`, `new_locations_unlocked`, `map_warnings`.
- [ ] Validator добавя кодове `MAP-LOCATION-UNKNOWN`, `MAP-HOTSPOT-MISMATCH`, `MAP-COORD-OUTSIDE` и WARN-ва, ако позицията не съвпада с hotspot от JSON метаданните.
- [ ] README / developer docs описват как GM/LLM трябва да актуализира `current_location` след движение и как се логват посещения.

## Tasks / Subtasks
- [ ] Обнови state schema + типовете в `src/types` / `tools/validator`.
- [ ] Добави helper функции в runtime/CLI за запис на `current_location`.
- [ ] Добави telemetry hooks (в CLI или runtime) за броене на location updates.
- [ ] Обнови примерите (samples/blank-game state.json + telemetry README).

## Dev Notes
- Използвай integer координати (px) спрямо размерите от map JSON (`origin: top-left`).
- `visited_locations` трябва да пази най-много 256 записа (validator WARN, ако надвишим).
- Ако няма карта за area-то → `hotspot_id` може да е `null`, но validator изисква `area_id` + предупреждение да се добави карта.

## Dev Agent Record
### Context Reference
- `docs/stories/9-2-runtime-location-state.context.xml`

## File List
- `player-data/runtime/state.json` (samples + docs)
- `tools/validator/schemas/state.schema.json`
- `src/types/state.ts` (или екв.)
- `docs/analysis/validator-readme.md`
- `docs/analysis/metrics-summary.md` (нови telemetry полета)

## Change Log
- _pending_

## Status
ready-for-dev
