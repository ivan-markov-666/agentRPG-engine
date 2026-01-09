# DLC-BT-01 · "Карта на Светлината"

> **Quest type:** Expedition planning / Strategy council
> **State hooks:** `content_sets.balkan-trail.state.expedition_stage`, `supply_tokens`, `artifact_clues`, `alliance_track.*`

## Сцена A — Видението над Белинташ
- Set dressing: рунически прожекции над плочата, NPC: Ана Комнина, Елена, войнушки разузнавачи.
- Играчът преглежда журнал от DLC-01/02 (focus core, legacy rank). Избира кой лидер да води експедицията (Елена / Стоян II / Войнушко капитан / Архивист Калиста).
- **State updates:**
  - `convoy_morale = 60 (+10 ако legacy_rank ≥ 3)`
  - `lead_commander = <npc>` → влияе на checks по-късно.

## Сцена B — Маршрутни дилеми
- Табло с три маршрута: "Кричимски водопади" (hazard), "Пловдивската лаборатория" (diplomacy), "Черноломското дефиле" (stealth).
- Играчът избира основен и резервен route. Всеки дава bonus/penalty и unlock event deck карти.
- Checks: Logistics DC 11, Cartography DC 12, Insight DC 10 за да откриеш скрити заплахи.
- **Consequences:**
  - Успешни проверки → `supply_tokens += 1` и `artifact_clues.push("route:<id>")`.
  - Провал → `hazard_timer.route += 1`, `convoy_morale -5`.

## Сцена C — Мрежата от лъчи
- Ритуал за синхронизиране на фокусните точки. Ако DLC-01 `focus_core = prism` → получаваш auto-success и `artifact_clues.push("prism_resonance")`.
- Играчът решава кои съюзници да покани:
  1. **Byzantine envoys** (requires next-guardians `heir_alignment = wind` или `trials_result = alliance`). Дава `alliance_track.byzzies += 1`.
  2. **Latin engineers** (requires DLC-01 `support_nodes` ≥2). Дава `alliance_track.latins += 1`, unlock rigging tech.
  3. **Voinuk scouts** (requires ward/training yard). Дава `alliance_track.voinuk += 1`, stealth bonus.
- Решенията записват кои фракции ще имат agenda в Quest 2.

## Outcomes
- `expedition_stage = "underway"` и `act_hook.dlc_bt_pass_open = true`.
- `artifact_clues` съдържа минимум 1 елемент, иначе Quest 2 започва с дефект (трябва да спечелиш clue на терен).
- Journal entry: "Map of Light plotted".
