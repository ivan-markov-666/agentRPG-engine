# ST-010 — TypeScript Tooling Bootstrap

_Status: done_

## Story Overview
Като техничен лидер искам да въведем TypeScript toolchain (tsconfig, build scripts, shared типове), за да подготвим engine-а за типизирани контракти и бъдещи TS истории.

## Acceptance Criteria
- [x] Добавени са `tsconfig.json`, `tsconfig.build.json` (или аналог) с настройки за strict mode и path aliases.
- [x] Настроен е build процес (`npm run build:ts`) и lint/format hooks (ESLint + Prettier за TS).
- [x] Създаден е `src/types/` пакет с базови типове (CapabilitiesConfig, ScenarioContract, TelemetryEntry) и export barrel.
- [x] README/Architecture документ описва стратегията за TS (включително миграция на съществуващ JS код).
- [x] Тестван е build + type-check pipeline (CI или локален скрипт).

## Tasks / Subtasks
- [x] Инсталирай TypeScript + типове за Node/ajv и други зависимости.
- [x] Конфигурирай `tsconfig` с outDir `dist/` (или `build/`) и strict правила.
- [x] Добави ESLint конфигурация (ако няма) или разширение с TS плъгини.
- [x] Създай базовите shared типове (interfaces) и експорти.
- [x] Обнови документацията (Architecture Blueprint, README) със секция за TS adoption strategy.

## Dev Notes
- JS → TS миграция ще се случва story по story; засега е важно tooling-ът да е готов.
- Акцентирай върху съвместимост с текущия validator/CLI build.

## Dev Agent Record / File List / Change Log
- `tsconfig.json`, `tsconfig.build.json` — strict Node16 настройка, outDir `dist/`, declarations/source maps.
- `package.json` — добавени скриптове `typecheck`, `build:ts`, `lint:ts` + devDependencies (TypeScript, ts-node, ESLint + TS плъгини, Prettier, @types пакети).
- `.eslintrc.cjs`, `.prettierrc.cjs` — lint/format настройка за TS.
- `src/types/{capabilities,scenario,telemetry}.ts`, `src/types/index.ts` — базовите shared типове за capabilities, scenario контракти и telemetry.
- README + Architecture blueprint — нова секция „TypeScript Tooling (EP-004)“ и обновени бележки за EP-004 стратегията.

## Status
done
