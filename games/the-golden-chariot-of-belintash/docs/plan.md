# Build Plan & Traceability — The Golden Chariot of Belintash

## 0. Context
- **Source idea folder:** `games/the-golden-chariot-of-belintash-idea/`
- **Target canonical folder:** `games/the-golden-chariot-of-belintash/`
- **Personas:** Ivan (game content), Desi (engine). This plan is for Ivan work only.
- **Goal:** migrate/author all required files so the new game is validator-clean and feature-complete per Product Brief v1.

## 1. High-Level Phases
1. **World Frame & Acts** (world bible, act outlines, post-credit hooks)
2. **Areas & Navigation** (locations, travel system, area markdowns)
3. **Quests & Choices** (main + side quests, available/unlock JSONs, dialogue hooks)
4. **Capabilities, Economy, Systems** (capabilities configs, currency rules, items/companions)
5. **Runtime & Telemetry** (state presets, exploration logs, telemetry templates)
6. **UI / Contracts / Compliance** (UI JSONs, saves/history configs, validator/test suite)

## 2. Traceability Matrix (source → target → status)
| Phase | Source idea files | Target canonical files | Status |
| --- | --- | --- | --- |
| World & Acts | `WORLD-BIBLE.md`, `MAIN-QUEST-OUTLINE.md`, `ENDINGS.md`, `post-credit-hooks.md` | `scenario/world/index.md`, `scenario/index.md` (acts table), optional `scenario/world/world-bible.md` | ✅ Complete (world primer + act roadmap @scenario/world/index.md & scenario/index.md) |
| Areas & Navigation | `LOCATIONS.md`, `TRAVEL-SYSTEM.md`, `SCENARIOS/ACT-*/` | `scenario/areas/*.md`, area backlinks, map notes | ✅ Complete (Каменица x2, Мостово, Врата, Горнослав, Забърдо @scenario/areas/*) |
| Quests & Choices | `SCENARIO-WRITING-PLAN.md`, `SIDE-QUESTS.md`, `DIALOGUES.md`, `SCENARIOS/` quest files | `scenario/quests/*.md`, `scenario/quests/available.json`, `scenario/quests/unlock-triggers.json`, dialogue references | ⚠️ In progress (main-quest-01.md expanded; next quests pending) |
| Capabilities & Economy | `GAME-CAPABILITIES.md`, `CURRENCY-SYSTEM.md`, `ITEMS.md`, `COMPANIONS.md` | `CONFIG/*.capabilities.json`, `player-data/runtime/state.json`, item/NPC docs as needed | Pending |
| Runtime & Telemetry | `SCENARIO-TRACEABILITY.md`, `TRAVEL-SYSTEM.md`, telemetry notes if any | `player-data/runtime/*.json`, `telemetry/kpi.json`, `telemetry/history.json`, validate/publish scripts config | Pending |
| UI / Contracts / Compliance | Any UI concepts, saves/history requirements | `manifest/entry.json`, `ui/*.json`, `player-data/saves/index.json`, `player-data/runtime/history.full.jsonl`, README/tests | Pending |

> Update the Status column after each phase (e.g., ✅ Complete, ⚠️ In progress, 🕒 Blocked) and cite the commit/command that achieved it.

## 3. Execution Steps
1. **Confirm authoring language + tone (World pass #2)**
   - Questions: authoritative language for quests/UI, taboo list, educational beats.
   - Deliverables: updated `scenario/world/index.md`, world snapshot in `docs/intake.md`.
2. **Acts & Post-Credit Hooks**
   - Map each act from `MAIN-QUEST-OUTLINE.md` to sections in `scenario/index.md`.
   - Note DLC hooks for manifest content_sets.
3. **Areas batch**
   - For each major location (Belintash plateau, Laut Stronghold, etc.) import summary → `scenario/areas/<id>.md`.
   - Ensure backlinks to quests, travel routes, exploration hooks.
4. **Quest ingestion loop**
   - For each quest set (main, side, DLC), run: idea notes → canonical MD via `quest:add`/manual editing → update JSONs → regenerate `scenario/index.md`.
   - Track coverage in Traceability table.
5. **Systems sync**
   - Capabilities: confirm resources, ranges, and runtime usage align with `GAME-CAPABILITIES.md`.
   - Economy/Items/Companions: add docs or JSON as needed (e.g., `scenario/items/`, `scenario/companions/`).
6. **Runtime presets & telemetry**
   - Build smoke state, exploration log, telemetry KPI from templates + idea KPIs.
   - Run `npm run validate -- --summary` + telemetry scripts.
7. **UI / Saves / Compliance**
   - Update manifest contracts, `ui/*.json`, saves/history files per Product Brief.
   - Run `npm run test:validator` + `npm run test`.

## 4. Tracking
- Use `docs/intake.md` to note pass statuses per domain.
- Update this plan’s table whenever a phase is finished or blocked.
- Record validator/CLI runs (command + result) in a short log at the bottom of this file if helpful.

## 5. Next Immediate Actions
1. Phase 3 wrap-up — author още main/side quests (Act I) и поддържай quest JSON-ите + backlink-ите актуални.
2. Phase 4 prep — синхронизирай capabilities/state:
   - Прегледай `config/capabilities.json` и `player-data/runtime/state.json` срещу `GAME-CAPABILITIES.md`.
   - Потвърди, че всички активни capability stats имат runtime стойности и обратно (без orphan stats).
   - Добави economy hooks (valuta, items, companions) в отделни markdown-и, ако са описани в idea docs.
   - Провери exploration: ако ще е активен в Act I, добави entries в `player-data/runtime/exploration-log.json` + tags.
   - Подготви checklist за telemetry (`docs/analysis/...`) преди Phase 5.
3. Phase 5 предварителна бележка — когато системите са синхронизирани, планирай UI/saves contract (manifest.ui_index, ui/*, saves index).
