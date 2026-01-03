# ST-035 — UI & World Atlas Integration

_Status: ready-for-dev_

## Story Overview
Като UI/experience designer искам World Atlas изглед и HUD миникарта, които използват map JSON/PNG данните, за да може GM/LLM ясно да показва позицията на играча, да превключва между глобален и локален изглед и да дава текстови fallback-и при липса на изображение.

## Acceptance Criteria
- [ ] `ui/index.json` описва нови ресурси:
  - [ ] `ui/map.world.json` (структура за World Atlas) и `ui/map.area.json` за текущата area.
  - [ ] HUD mini-map секция в `ui/hud.json` (`"mini_map": {...}`) включва ASCII preview + сегашен marker (`"player_icon": "@", "legend": {...}`).
- [ ] Runtime CLI (`npm run runtime -- --debug`) визуализира World Atlas при заявка “show map” (използва JSON + ASCII fallback).
- [ ] README / UI договор описва JSON структурата за atlas view: `{ "world_map": {"image": "...", "regions": [...]}, "current_area": {...}, "visited": [...] }`.
- [ ] Документацията за GM/LLM указва кога да показва World Atlas (напр. команда `show world map`, автоматично при сменена area).
- [ ] Увери се, че blank-game примерите съдържат минимална HUD mini-map конфигурация.

## Tasks / Subtasks
- [ ] Разшири UI schemas (hud + новите map JSON).
- [ ] Обнови runtime renderer за нови секции и fallback ASCII.
- [ ] Документирай UX flow (“World Atlas” и “mini map”) в `docs/analysis/blank-game-README.md` и `docs/analysis/how-to-create-a-new-game.md`.
- [ ] Добави GM instructions (как да отговаря на player requests за карта).

## Dev Notes
- Mini-map може да използва същия `ascii_preview` от area map JSON (без копиране).
- World Atlas трябва да показва marker за `state.current_area_id` (региони в world JSON имат reference към area id).
- UI JSON трябва да остане в рамките на съществуващите schema версии; ако е нужно, bump на `schema_version`.

## Dev Agent Record
### Context Reference
- `docs/stories/9-4-ui-world-atlas.context.xml`

## File List
- `ui/hud.schema.json`, `ui/map.world.schema.json`, `ui/map.area.schema.json`
- `src/runtime/ui/*` (рендеринг)
- `docs/analysis/how-to-create-a-new-game.md`, `docs/analysis/blank-game-README.md`
- `samples/blank-game/ui/*`

## Change Log
- _pending_

## Status
ready-for-dev
