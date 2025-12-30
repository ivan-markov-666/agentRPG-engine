# ST-020 — World Frame Contract (scenario/world)

_Status: ready-for-dev_

## Story Overview
Като GM искам да има формализиран „world frame“ файл (епоха/сетинг/граници), за да може exploration режимът да държи играча в рамка и да има предвидим източник за тон и ограничения.

## Acceptance Criteria
- [ ] Дефиниран е каноничен път за world frame (по подразбиране `scenario/world/index.md` или manifest pointer).
- [ ] Валидаторът проверява ако файлът съществува: не е празен, има H1 заглавие, и е над минимална дължина.
- [ ] Ако world frame е посочен чрез manifest pointer, валидаторът хвърля ERROR при липсващ файл.
- [ ] `samples/blank-game` и `games/demo` съдържат минимален `scenario/world/index.md` (ако е в MVP scope).
- [ ] Има тест за missing/empty world frame при активен pointer.

## Tasks / Subtasks
- [ ] Избери окончателен механизъм: default path vs manifest pointer (напр. `world_index`).
- [ ] Добави validator check (нов или към `files.ts`/`runtime-contracts.ts`).
- [ ] Добави минимален template за `scenario/world/index.md` в sample игрите.
- [ ] Добави тестове.

## Dev Agent Record / File List / Change Log
- (planned) `src/validator/checks/world-frame.ts` (или разширение в `files.ts`)
- (planned) `samples/blank-game/scenario/world/index.md`
- (planned) `games/demo/scenario/world/index.md`
- (planned) `tools/tests/world-frame.test.js`

## Status
ready-for-dev
