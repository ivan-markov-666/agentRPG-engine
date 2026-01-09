## UI Dashboard · The Golden Chariot of Belintash

> Frontend location: `games/the-golden-chariot-of-belintash/ui-dashboard`

### 1. Start / Dev Workflow
1. **Install deps** (first run or when `package.json` changes)
   ```bash
   npm install
   ```
2. **Start dev server**
   ```bash
   npm run dev
   ```
   - Default port: 3000. If busy, Next.js auto-picks 3001/3002 (check terminal).
3. **Open** http://localhost:3000 (или избрания порт).
4. **Stop** с `Ctrl+C`.

> ⚠️ UI-то чете директно файловете от `games/the-golden-chariot-of-belintash/**`. Няма API сървър – просто редактирай JSON/markdown файловете и рефрешни страницата.

### 2. Как GM го използва
- **Player onboarding**: панел „Профил на играча“ показва текущите стойности от `player-data/session-init.json`. Преди сесия обнови файла според `docs/player-onboarding.md`, след това рефрешни UI-то.
- **Световно състояние**: „Състояние на света“ отразява `player-data/runtime/state.json > world_state` + активни content sets.
- **Capabilities & Stats**: всеки capability от `config/capabilities.json` има бар + описание. Ако стойност липсва в `state.json`, се показва „—“ и подсказка да я добавиш.
- **Telemetry & Validator**: данни от `reports/run-YYYYMMDD-full.json` (по подразбиране `run-20260109-full.json`). Стартирай `npm run validate -- --path games/the-golden-chariot-of-belintash --summary --json reports/<ново>.json`, после обнови UI файла, за да отрази последния run.
- **Exploration timeline**: чете последните записи от `player-data/runtime/exploration-log.json`.
- **Mini map & World map**:
  - Mini map показва `maps/areas/<current_area_id>.png/json` според `state.world_state.location.area_id` (fall back: `state.current_area_id` → `default-area`). За всяка локация подготви JSON + PNG и просто ги замени.
  - Link „Виж пълната карта →“ отваря `/map`, където GM вижда голямата карта (`maps/world/world.png`) и същия mini map.

### 3. Как LLM/GM обновява UI-то
- **Еднократни стъпки** (LLM или GM):
  1. Променя някой от следните файлове:
     - `player-data/session-init.json` (име/език/пол)
     - `player-data/runtime/state.json` (stats, world_state, current_area_id)
     - `config/capabilities.json` (описания, диапазони)
     - `maps/world/index.json` + `maps/world/world.png`
     - `maps/areas/<area>.json` + `maps/areas/<area>.png`
     - `player-data/runtime/exploration-log.json`
     - `reports/run-*.json` (ако се смени telemetry файлът, актуализирай пътя в `lib/gameData.ts`)
  2. Записва файла.
  3. Рефрешва браузъра → Next.js server component зарежда новото съдържание.

- **Процес по време на сесия**:
  - GM може да редактира state/exploration логове в реално време; UI-то отразява промяната при следващия refresh.
  - Няма нужда от допълнителни build стъпки, стига dev сървърът да работи.

### 4. Структура на папката
```
ui-dashboard/
├─ app/
│  ├─ page.tsx          # главна конзола
│  ├─ map/page.tsx      # пълна карта
│  └─ layout.tsx + globals.css
├─ lib/
│  └─ gameData.ts       # зарежда JSON/PNG файловете от играта
├─ public/              # (по избор) статични assets
├─ package.json
└─ tsconfig.json
```

### 5. Често задавани въпроси
- **Може ли да сменя картата?** Да. Смени PNG файла и, ако трябва, JSON метаданните. UI-то не кешира – просто рефреш.
- **Може ли Mini map да е различен за всяка локация?** Да, достатъчно е в `maps/areas/<areaId>.json` да сочиш към съответната PNG и да поставиш `<areaId>.png` в `maps/areas/`.
- **Може ли да добавя още панели?** Да, просто обнови React компонентите в `app/page.tsx`; UI-то е напълно в границите на game папката и не изисква engine промени.
