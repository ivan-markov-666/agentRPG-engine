# ST-010 — TypeScript Tooling Bootstrap

_Status: ready-for-dev_

## Story Overview
Като техничен лидер искам да въведем TypeScript toolchain (tsconfig, build scripts, shared типове), за да подготвим engine-а за типизирани контракти и бъдещи TS истории.

## Acceptance Criteria
- [ ] Добавени са `tsconfig.json`, `tsconfig.build.json` (или аналог) с настройки за strict mode и path aliases.
- [ ] Настроен е build процес (`npm run build:ts`) и lint/format hooks (ESLint + Prettier за TS).
- [ ] Създаден е `src/types/` пакет с базови типове (CapabilitiesConfig, ScenarioContract, TelemetryEntry) и export barrel.
- [ ] README/Architecture документ описва стратегията за TS (включително миграция на съществуващ JS код).
- [ ] Тестван е build + type-check pipeline (CI или локален скрипт).

## Tasks / Subtasks
- [ ] Инсталирай TypeScript + типове за Node/ajv и други зависимости.
- [ ] Конфигурирай `tsconfig` с outDir `dist/` (или `build/`) и strict правила.
- [ ] Добави ESLint конфигурация (ако няма) или разширение с TS плъгини.
- [ ] Създай базовите shared типове (interfaces) и експорти.
- [ ] Обнови документацията (Architecture Blueprint, README) със секция за TS adoption strategy.

## Dev Notes
- JS → TS миграция ще се случва story по story; засега е важно tooling-ът да е готов.
- Акцентирай върху съвместимост с текущия validator/CLI build.

## Dev Agent Record / File List / Change Log
_(pending)_

## Status
ready-for-dev
