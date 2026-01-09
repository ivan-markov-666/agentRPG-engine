# DLC-04 · „Лаут — войнушкото селище“

| # | Quest | Summary | Core State Hooks |
|---|-------|---------|------------------|
| 1 | [[dlc-ls-01-shadows]] | Разузнаване и дипломация между воинушките фамилии; откриване на шпионска мрежа. | `defense_phase="scouting"`, `woinuk_morale`, `espionage_alert`, `safehouses[]` |
| 2 | [[dlc-ls-02-three-walls]] | Три последователни линии на защита + ward ритуал в тунелите. | `defense_phase="siege"`, `stronghold_integrity`, `ward_power`, `hazard_tokens` |
| 3 | [[dlc-ls-03-oath]] | Финалната клетва към лъча – избор между ward, евакуация или предателство. | `defense_phase="aftermath"`, `oath_resolution`, `artifact_insight[]` |

## Системи и Loop
- **Stronghold Defense:** Всеки ден разпределяш NPC-командири, ремонтираш секции и избираш как да реагираш на кризисни карти (`stronghold_integrity`, `hazard_tokens`).
- **Archaeology & Wards:** Разкопки в старите хранилища отключват `artifact_insight[]` и зареждат `ward_power` за масови ритуали.
- **Espionage:** Трябва да следиш `espionage_alert` и кой safehouse държи loyalty. Провал води до саботаж или „отворени“ порти.
- **Cross-DLC:** Резултатите от DLC-02 структури дават стартови бонуси (tower/library/ward). `trails_resolution` от DLC-03 определя кой beam faction доставя подкрепления.

## NPC / Factions
- **Капитан Ана-Лаут** – лидер на защитниците; управлява morale checks.
- **Археолог Инна** – unlock-ва ward puzzles и lore сцени.
- **Шпионът „Тъмната струя“** – скрит антагонист в quest 1–2.
- **Beam envoy** – зависи от DLC-03 финала (byzantine/latin/voinuk/solo).

## Reward Hooks
- `artifact.sun_eye_fragment_ii`
- `dlc_state.laut.blessing = ward|airlift|infantry|stealth`
- Unlock на NG+ опция „Stronghold Commander“.
