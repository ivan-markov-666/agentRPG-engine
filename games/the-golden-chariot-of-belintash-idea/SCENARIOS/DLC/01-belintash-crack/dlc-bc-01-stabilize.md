# DLC-BC-01 · "Стабилизиране на свода"

> **Quest type:** Engineering / Hazard control
> **State hooks:** `dlc.belintash_collapse_stage`, `dlc.belintash.support_nodes`

## Сцена A — Лагерът над пукнатината
- **Set dressing:** палатки, парни котли, рунни маяци.
- **Диалог:** Брат Теодосий (ritual lead), Воевода Калоян (security) и Ана Комнина (engineering). Играчът избира кой да води операцията:
  1. Теодосий → ритуални проверки -2 DC, engineering +2 DC.
  2. Калоян → hazard spike тригерира по-бавно, но социалните избори са по-трудни.
  3. Ана → engineering -2 DC, unlock special option за brace kit.
- `collapse_stage` се инициализира на 1, `dlc.belintash.support_nodes = []`.
- **State hook:** запиши `state.content_sets["belintash-crack"].state.lead = <chosen_npc>`.

## Сцена B — Парните шахти
- **Encounter loop:** за всяка шахта (север, юг, център) избери инструмент:
  - *Engineering Check DC 12* (използвай Ана/brace kit). Успех → `collapse_stage -= 1`, запис `support_nodes.push("steam:<dir>")`.
  - *Ritual Check DC 10* (Теодосий). Успех → стабилизира парата без ресурс.
  - *Brute force* (Калоян) → tension +5, но временно задържа таймера (без промяна).
- **Провал** на проверка → `collapse_stage += 1` и `hazard_timer = "spike"`.
- Ако имаш spare parts от основната кампания → craft `item.brace_kit` (1/мисия), запис в state.

## Сцена C — Подпорите
- Три критични колони: *Магическа*, *Механична*, *Срутена галерия*.
- За всяка:
  - **Магическа:** Ritual DC 13 (с бонус ако Теодосий води). Провал → `collapse_stage += 1`.
  - **Механична:** Engineering DC 11 (бонус от Ана). Успех → unlock permanent `brace_kit` употреби.
  - **Галерия:** Leadership DC 12, ангажирай Калоян за координация. Успех → `support_nodes.push("gallery")` → Rescue quest получава допълнителен вход.
- `state.content_sets["belintash-crack"].state.completed_supports` пази списък.

## Outcomes
- Ако `collapse_stage <= 1`, те награждават с blueprint за `spell.calcify`.
- Ако `collapse_stage >= 3`, тунелът затваря част от маршрутите (ще усложни спасителната мисия).
- Присъди: morale boost за лагера, journal entry „DLC-BC-01 Stabilized“ + cross-hook към DLC-02 (unlock „engineer trainees“ ако Ана води).
