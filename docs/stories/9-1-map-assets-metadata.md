# ST-032 — Map Assets & Metadata Contracts

_Status: ready-for-dev_

## Story Overview
Като Game Designer искам стандартизирана структура за карти (глобална + area) с JSON метаданни и указатели в manifest, за да може GM/LLM да локализира играча, а tooling-ът да валидира консистентно всички изображения, координати и ASCII fallbacks.

## Acceptance Criteria
- [ ] `manifest/entry.json` поддържа нови полета `map_world_index`, `map_assets_dir`, `map_cli` (версиониране + tooling entrypoints) и schema/документация описват кога са задължителни.
- [ ] Директория `maps/` съдържа:
  - [ ] `maps/world/index.json` + `maps/world/world.png` (или .jpg/.svg) с описани региони, area връзки, изисквани пикселни размери и fallback `ascii_preview`.
  - [ ] `maps/areas/<areaId>.json` + съответен image файл за всяка area, които описват hotspots (`id`, `label`, `bounding_box` или `polygon`, `linked_quest_ids`, `notes`).
- [ ] JSON схемите (world + area map) са добавени към инструмента за валидация (`tools/validator/schemas/maps.*.schema.json`) и покриват:
  - [ ] дефинирани coordinate системи (`origin`, `width_px`, `height_px`),
  - [ ] минимум един `hotspot` с човешко име и връзка към quest/area,
  - [ ] `ascii_preview` + `legend` (optional но препоръчителни) с max ширина 64 символа.
- [ ] Документацията (Product Brief addendum + README/записките за blank game) описва структурата на `maps/`, naming conventions (snake-case), поддържани формати (PNG/JPG/SVG) и размери/MAU лимити.
- [ ] Примерни файлове в `samples/blank-game/maps/` демонстрират новия стандарт.

## Tasks / Subtasks
- [ ] Обнови manifest schema + описание в docs (section World/Maps).
- [ ] Създай JSON Schema файлове за world/area maps и ги закачете в validator.
- [ ] Добави примерни данни в `samples/blank-game` + кратък walkthrough в README.
- [ ] Подготви migration note за съществуващи игри (как да добавят новите указатели без да чупят DoD).

## Dev Notes
- Карти могат да бъдат големи изображения → използвай относителни пътища спрямо `games/<id>/`.
- `ascii_preview` трябва да отразява hotspot координатите (например `legend: {"@", "current_location", "#": "quest hub"}`), за да се рециклира от CLI и UI.
- World atlas JSON трябва да държи и списък от региони с bounding boxes, за да е възможно автоматично насочване към area карта.

## Dev Agent Record
### Context Reference
- `docs/stories/9-1-map-assets-metadata.context.xml`

## File List
- `docs/analysis/product-brief-*.md` (секция Location & map system)
- `tools/validator/schemas/maps.world.schema.json`
- `tools/validator/schemas/maps.area.schema.json`
- `samples/blank-game/maps/**/*`
- `manifest/entry.schema.json` (или еквивалентният JSON Schema)

## Change Log
- _pending_

## Status
ready-for-dev
