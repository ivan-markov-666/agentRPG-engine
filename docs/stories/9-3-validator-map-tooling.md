# ST-034 — Map Validator Rules & Tooling

_Status: ready-for-dev_

## Story Overview
Като инструментист искам validator-ът и CLI-то да поддържат карти (map scaffolder, ASCII генератор, консистентни указатели), за да предотвратя счупени референции между state, manifest и map файловете и да ускоря authoring-а.

## Acceptance Criteria
- [ ] Новый CLI `npm run map:add -- --game <id> --area <areaId> --image maps/areas/<areaId>.png`:
  - [ ] създава `maps/areas/<areaId>.json` от шаблон, приема опционални hotspots (`--hotspot id:label:x1,y1,x2,y2`), генерира `ascii_preview`.
  - [ ] валидации: няма overwrite без `--force`, проверка че image файлът съществува (или scaffolding placeholder).
- [ ] Validator кодове:
  - [ ] `MAP-FILE-MISSING` за липсващи JSON/изображения, когато manifest/state ги очакват.
  - [ ] `MAP-HOTSPOT-UNKNOWN` когато `state.current_location.hotspot_id` не съществува в съответния map JSON.
  - [ ] `MAP-ASCII-DRIFT` ако ASCII preview не съответства на размерите/legend шаблона (optional WARN).
- [ ] CLI команда `npm run map:minimap -- --game <id> --area <areaId>` генерира миникарта (ASCII + marker за current_location) и я записва в `ui/hud.json` или stdout.
- [ ] Документацията описва новите CLI-та + как validator кодовете се интерпретират.

## Tasks / Subtasks
- [ ] Имплементирай `tools/maps/add-map.ts` + тестове.
- [ ] Добави validator checks в `src/validator/checks/maps.ts` (или аналог).
- [ ] Създай `map:minimap` helper (може да използва същите JSON metadata).
- [ ] Обнови `docs/analysis/validator-readme.md` и `README.md` (section tooling).

## Dev Notes
- ASCII генераторът може да използва Bresenham/scanline за маркиране на hotspot карти, но първа версия може да е правоъгълници -> grid.
- Запази същия error код naming convention (`MAP-*`).

## Dev Agent Record
### Context Reference
- `docs/stories/9-3-validator-map-tooling.context.xml`

## File List
- `tools/maps/add-map.ts`, `tools/maps/minimap.ts`
- `npm` scripts + tests
- `src/validator/checks/maps.ts`
- `docs/analysis/validator-readme.md`

## Change Log
- _pending_

## Status
ready-for-dev
