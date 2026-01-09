# Post-credit / DLC Hooks — "Златната колесница на Белинташ"

| DLC Hook | Източник в сценария | Основен жанр | Кратко резюме |
|----------|---------------------|--------------|---------------|
| **Пукнатината на Белинташ** | Epilogue IV · `state.hazard.belintash_rocks = "collapse_imminent"` | Co-op dungeon crawl + engineering | Нови герои стабилизират тунелите преди срутване |
| **Следващото поколение пазители** | Epilogue III–IV · `quest_hook.next_generation` | Story-driven RPG / управление | Наследници и ученици поемат ролята на пазители |
| **Balkan Trail / Светлинният лъч** | Epilogue IV сцена 140 · `dlc_hook.balkan_trail` | Expedition sandbox | Експедиция по Балканите в търсене на свързани артефакти |
| **Войнушко селище Лаут** | SIDE-QUESTS #92–93 + WORLD-BIBLE | Tactical defense / alliance sim | Военно DLC с войнушките фамилии и археолози |

---

## DLC-01: „Пукнатината на Белинташ“
- **Timeline / Unlock:** Активира се след епилога чрез content set `belintash-crack` и флаг `state.flags.seal_complete = true`.
- **Setting:** Underbelly hub + нови шахти; engineering + survival gameplay.
- **NPC / Quest arcs:** описани в таблицата по-горе; виж content set blueprint за подробности.

## DLC-02: „Следващото поколение пазители“
- **Unlock:** `content_sets[].id = next-guardians`, condition `quest_hook.next_generation = true`.
- **Loop:** town management + legacy морал; companion skill tree „Heirloom“.

## DLC-03: „Balkan Trail / Светлинният лъч“
- **Unlock:** `content_sets[].id = balkan-trail`, условие `state.flags.final_vision == true` плюс активен `dlc_hook.balkan_trail` (появява се ако DLC-01 focus core = prism или ако DLC-02 trials_result = alliance).
- **Premise:** Експедиционен караван отпътува от Белинташ през Родопите към Солун, следвайки диагонал от рунически лъчи. Играчът управлява supply, дипломатически мисии и artifact hunts, за да извлече втория лъч на колесницата.
- **Loop Pillars:**
  1. **Expedition Map:** region/hex board (`regions.*`), пътуване през „Кричим“, „Пловдив“, „Свети Врач“, „Солун“. Всеки възел има hazard clocks и альтернативни маршрути (covert/diplomatic/military).
  2. **Convoy Management:** ресурси `supply_tokens` (0–6), показател `convoy_morale` (0–100) и `expedition_stage` (planning / underway / finale). Провеждаш downtime сцени, ремонтираш каравани и решаваш кой NPC да поеме водачеството.
  3. **Diplomacy Tracks:** `alliance_track.byzzies`, `.latins`, `.voinuks` – всяка сцена може да дава +/– репутация, отключва подкрепления и определя кой портал може да бъде активиран във финала.
  4. **Artifact Hunt:** събираш `artifact_clues[]` (рунически фрагменти, песни, координати). Комбинацията решава финалния ритуал, а NG+ получава артефакт `sun_eye_fragment`.
- **Quest Blueprint:**
  - **BT-01 „Карта на Светлината“** – стратегическо планиране, избираш първия маршрут, заключваш supply loadout. DLC-01 hooks: ако `focus_core = prism`, получаваш безплатен clue и byzantine trust +10.
  - **BT-02 „Пазители на прохода“** – multi-route мисия (дипломация vs sabotage). DLC-02 hooks: `legacy_rank ≥ 3` → convoy morale +10 и lieutenant NPC. `heir_alignment = wind` дава бонус в дипломатическия route; `earth` – в бойния route.
  - **BT-03 „Лъчът над Солун“** – кулминация, избор с коя фракция да активираш портала. Резултатът записва `trails_resolution = <byzantine|latin|voinuk|solo>` и определя старта на DLC-04/NG+.
- **Runtime State (чернова):**
  ```json
  "content_sets": {
    "balkan-trail": {
      "enabled": false,
      "state": {
        "expedition_stage": "planning",
        "convoy_morale": 60,
        "supply_tokens": 3,
        "alliance_track": {
          "byzantine": 0,
          "latin": 0,
          "voinuk": 0
        },
        "artifact_clues": [],
        "trail_notes": [],
        "trails_resolution": "unknown"
      }
    }
  }
  ```
  Балансиращи полета: `trail_notes[]` за ключови решения, `trails_resolution` за NG+ buff.
- **Capabilities файл:** `CONFIG/balkan-trail.capabilities.json` описва следните тракери:
  - `convoy_morale` (0–100) – morale gating за сцени;
  - `supply_tokens` (0–6) – логистична икономика;
  - `alliance_track_*` (−5..5) – дипломатически репутации;
  - `artifact_clues` / `trail_notes` – прогрес по лов на лъча;
  - `trails_resolution_score` – телеметрия за избраната фракция.
- **Cross-DLC Links:**
  - DLC-01 `support_nodes` → отварят shortcut тунели (намаляват hazard DC).
  - DLC-02 `structures` → tower/library дават съответно recon или lore advantage; ward → защита от магически бури.
  - DLC-02 `trials_result = alliance` → стартов `alliance_track.byzzies = 2`.
  - DLC-03 финалната фракция влияе на DLC-04: byzantine alliance → магически ward, voinuk → heavy infantry, latin → supply airships, solo → stealth opener.

## DLC-04: „Лаут — войнушкото селище“
- **Unlock:** content set `laut-stronghold`, условие `state.laut.alliance >= trusted` (или `dlc_hook.voinuk_ward` от DLC-03 финала).
- **Premise:** Играчът води воинушки семейства и археолози, за да укрепят селището Лаут срещу османски и наемнически отряди. Укрепленията крият древни ward-ове; трябва да балансираш между тактическа отбрана, археологически разкопки и шпионска война.
- **Loop Pillars:**
  1. **Stronghold Defense:** `stronghold_integrity` (0–100) + `defense_phase` (scouting / siege / aftermath). Всяка седмица избираш кои стени да подсилиш, кой NPC да води прикритите патрули и как да реагираш на кризисни карти.
  2. **Archaeology & Wards:** `ward_power` (0–5) и `artifact_insight[]` – отключват нови защитни ритуали. Копаеш тунели, решаваш загадки, рискът от cave-ins добавя `hazard_tokens`.
  3. **Espionage & Diplomacy:** `woinuk_morale`, `alliance_track.voinuk_clans[]`, `espionage_alert` (0–5). Трябва да откриваш предатели, да пазиш тайната на ward-овете и да договаряш помощ от DLC-02 героите.
- **Quest Blueprint:**
  - **LS-01 „Сенки над Лаут“** – разузнаване + дипломатически преговори с изолираните фамилии. Резултати: `woinuk_morale`, `espionage_alert`.
  - **LS-02 „Обсадата на Трите стени“** – multi-phase тактическа карта; дефинираш rota за защитата и тригернеш ward ритуал. Влияе върху `stronghold_integrity`, `ward_power`.
  - **LS-03 „Клетвата към лъча“** – кулминация: активираш нов beam nexus или евакуираш artefact конвоя. Писва `oath_resolution` (ward / evacuation / betrayal).
- **Runtime State (чернова):**
  ```json
  "content_sets": {
    "laut-stronghold": {
      "enabled": false,
      "state": {
        "defense_phase": "scouting",
        "stronghold_integrity": 80,
        "ward_power": 2,
        "woinuk_morale": 60,
        "espionage_alert": 1,
        "artifact_insight": ["ward_pillar_alpha"],
        "safehouses": ["clan_ivash"],
        "oath_resolution": "pending"
      }
    }
  }
  ```
- **Cross-DLC Hooks:**
  - DLC-02 `structures` влияят върху стартовите fortifications (например `ward` → +1 ward_power).
  - DLC-03 `trails_resolution` определя кой beam faction се появява като guest NPC (и unlock-ва специални defenses).
  - `state.hero.roster` решава кой protagonist командва отбраната (основен герой, наследник или воинушки капитан).
  - **Validator gate:** Laut unlock-ът вече изисква `balkan-trail.trails_resolution` ≠ `unknown` и Next Guardians да са записали поне една ключова структура (`tower`/`library`/`ward`) + валиден `trials_result`. В противен случай `CONTENT-SET-LAUT-TRAILS` и `CONTENT-SET-LAUT-GUARDIANS` предупреждават, че cross-DLC състоянията липсват.

---

## DLC-01 „Пукнатината на Белинташ“ — Production Backlog

| Track | Task | Notes / Files |
|-------|------|---------------|
| Manifest | Добави `content_sets[].id = "belintash-crack"` в `games/<campaign>/manifest/entry.json`. | `scenario_index`: `SCENARIOS/DLC/01-belintash-crack/index.md`; `capabilities_file`: `CONFIG/belintash-crack.capabilities.json`; `state_namespace`: `belintash_crack`; `unlock_condition`: `state.flags.seal_complete == true`. |
| Runtime state | Разшири `player-data/runtime/state.json` с `content_sets.belintash-crack`. | Полета: `enabled`, `collapse_stage`, `rescued_archivists`, `hazard_timer`, `notes`. |
| Narrative scaffolding | Създай следните markdown-и: 1) `SCENARIOS/DLC/01-belintash-crack/index.md` (overview, quest table). 2) Куест файлове `dlc-bc-01-stabilize.md`, `dlc-bc-02-rescue.md`, `dlc-bc-03-shattered-vision.md`. 3) Area описания `areas/dlc/belintash-*.md`. | Използвай content-set tooling за базов scaffolding, после попълни куестите. |
| Capabilities & items | Добави entries в `CONFIG/belintash-crack.capabilities.json`: `item.brace_kit`, `spell.calcify`, `hazard.collapse_stage`. | Изисква нови skill checks (engineering, ritual). |
| Mechanics hooks | Опиши logic за hazard timer (`collapse_stage` 1..4) + co-op роли. | Секция в `GAME-CAPABILITIES.md` и `docs/systems/hazard-timers.md`. |
| Unlock UX | Добави пост-епилог меню entry „Пукнатината на Белинташ“. | В `UI/post-epilogue.md` и runtime CLI release notes. |
| Validator / tests | Правило: ако content set `belintash-crack` е в manifest → файловете по-горе трябва да съществуват. | Добави check в `src/validator/checks/files.ts` или dedicated DLC rule + unit test. |
| Telemetry (optional) | Логни `dlc1.collapse_stage` и `dlc1.success`. | Update `telemetry/events.md`. |

---

### Cross-DLC state влияния
- `state.content_sets["belintash-crack"].state.collapse_stage_final` → ако е 0, DLC-02 стартира с бонус „engineer trainees“ (по-ниски DC за строежи). Ако е ≥3, town management сцените започват с допълнителен hazard track.
- `state.content_sets["belintash-crack"].state.rescued_archivists` → ≥3 отключва ново заклинание в DLC-02 („Archivist chorus“). По-малко от 2 дава „guilt letter“ и ограничава companion morale.
- `state.content_sets["belintash-crack"].state.focus_core`:
  - `amber` → DLC-02 получава традиционни ритуали; DLC-03 NPC монасите започват с доверие +10.
  - `prism` → DLC-03 (Balkan Trail) стартира с unlocked tech route и `dlc_hook.balkan_trail` става активен без допълнителен флаг.
  - `amulet` → основният герой губи buff, но DLC-04 получава артефакт quest.
- `state.content_sets["belintash-crack"].state.resolution`:
  - `seal_stable` → добавя `quest_hook.next_generation` (улеснява DLC-02 unlock).
  - `shared_power` → DLC-03 започва с `world_state.reputation.modern_team = high` и tension +10.
  - `sacrifice` → unlock `artifact.sun_eye_fragment` за основния save и влияе на NG+.
- Бележка: стойностите се експортират в `dlc_state.belintash.*`, за да могат други инструменти/telemetry да ги четат.

- `state.content_sets["next-guardians"].state.legacy_rank` → ≥3 дава временно morale buff и unlock-ва „Heirloom formations“ в DLC-04; <2 прави DLC-03 дипломатическите мисии по-трудни (tension +5).
- `state.content_sets["next-guardians"].state.structures` → наличието на `tower`, `library`, `ward` добавя съответно: стремеж към обсада в DLC-03, extra lore events, или защити в DLC-04. Липсата им отключва мисии по възстановяване.
- `state.content_sets["next-guardians"].state.heir_alignment`:
  - `wind` → DLC-03 започва с bonus към византийските магове, но латинците са подозрителни.
  - `earth` → DLC-04 получава по-силни ward-ове и buff за войнушките формации.
  - `idealistic` / `pragmatic` → влияят на NPC loyalty и NG+ narrative.
- `state.content_sets["next-guardians"].state.trials_result`:
  - `victory` → дава `dlc_hook.guardian_legacy` и morale boost в NG+.
  - `alliance` → DLC-03 стартира с unlocked diplomacy route + съкратен travel setup.
  - `evacuated` → DLC-04 получава stealth mission hook, но town morale пада в основната кампания.
- Всички стойности се синхронизират в `dlc_state.next_guardians.*` за telemetry/CLI.

---

### Unlock & Save Flow Proposal
1. **Post-Epilogue Hub:** След `state.main_quest.current = "act_v_epilogue_setup"` се отваря ново меню „Допълнителни истории“ с проверка на ключовите флагове.
2. **Multiple Protagonists:** Въвеждаме `hero.roster` – списък от налични герои (оригинал, наследник, воинушко). DLC стартира с избор кой save state да използва. Ако първият герой е загинал, системата предлага pre-defined successor с наследени способности според дневника/монетите.
3. **State Export:** Всеки DLC записва отделни `dlc_state.*` полета (например `dlc1.progress`, `dlc2.legacy_rank`). При завършване връща rewards към основния save (нови артефакти, buff-ове).
4. **Cross-DLC Hooks:** Решенията от DLC-01 (дали спасихме архива) влияят на DLC-02 (достъпни заклинания) и DLC-03 (репутация с монасите). Това поддържа една обща timeline.

> *Бележка:* Тези структури позволяват всяко DLC да се играе самостоятелно (отделен entry point) или като част от последователна пост-game кампания.
