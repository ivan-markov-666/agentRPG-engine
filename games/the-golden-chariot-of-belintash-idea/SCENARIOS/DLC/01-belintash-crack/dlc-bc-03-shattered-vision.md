# DLC-BC-03 · "Счупената визия"

> **Quest type:** Ritual / Moral dilemma
> **State hooks:** `dlc.belintash.focus_core`, `dlc.belintash.collapse_stage`, `dlc.belintash.resolution`

## Сцена A — Камерата на визията
- Камерата е осветена от пукнатата монета, стените вибрират. `collapse_stage` автоматично се качва до 4, ако не си задържал спасените архивисти като хор.
- Играчът избира кой NPC води ритуала (Брат Теодосий, Ана, Воевода Калоян):
  1. **Теодосий** → Ritual DC намалява с 2, но Engineering DC +2.
  2. **Ана** → Engineering DC намалява с 2, unlock опция да пренасочиш енергия към подпорите.
  3. **Калоян** → Може да жертва охраната за да намали `collapse_stage` с 1 (но tension +10).
- Ако архивистите са останали като хор, получаваш бонус „Cohesion Chant“ (Ritual DC -2).

## Сцена B — Търсене на фокус-камък
- Три странични стаи (можеш да посетиш максимум две):
  - **Древен кехлибар:** зад духовна бариера (Willpower DC 13). `focus_core = "amber"` → поддържа традиционната магия, усилва DLC-02.
  - **Лазерна призма:** изисква tech ресурси (Engineering DC 12 + item.filter_mask). `focus_core = "prism"` → свързва се с Balkan Trail DLC.
  - **Амулетът на героя:** ако го жертваш, `focus_core = "amulet"`, но губиш buff от основната кампания; unlock уникален ending.
- Всяка стая има hazard риск: провал → `collapse_stage += 1` и запис в `state.notes`.

## Сцена C — Решение на хазард кризата
- Финален ритуал: комбинирай Ritual DC 14 и Engineering DC 12 (в зависимост от лидера и focus_core). Можеш да похарчиш `item.brace_kit` за reroll.
- Успех → `collapse_stage = 0`, тунелът става безопасен, journal запис „Seal stabilized“.
- Провал → тунелът частично се срутва, но героите оцеляват; `collapse_stage = 4`, unlock „Cracked Legacy“.
- Морален избор:
  1. **Seal for guardians** (`resolution = "seal_stable"`) → дава boon към DLC-02 (legacy training).
  2. **Share with state** (`resolution = "shared_power"`) → репутация +10, но DLC-03 започва с tension.
  3. **Sacrifice** (`resolution = "sacrifice"`) → унищожава източника, но дава artifact на героя.

## Outcomes
- `dlc.belintash.resolution = {seal_stable|shared_power|sacrifice}` → влияе на DLC-02 и DLC-03.
- Ако `rescued_archivists` < 2, получаваш писмо с вина и по-нисък reputation бонус.
- Допълнително поле `dlc.belintash.focus_core` определя кой quest chain се отключва (например `amber` → наследници, `prism` → Balkan Trail).
- Log telemetry: `dlc1.collapse_stage_final`, `dlc1.resolution`.
