# ST-014 — Host Adapter Contract (runtime)

_Status: done_

## Story Overview
Като engine dev искам platform-agnostic Host Adapter интерфейс и референтна имплементация, за да може runtime слой да работи с файлове и логване без vendor lock-in.

## Acceptance Criteria
- [x] Дефиниран е `HostAdapter` интерфейс (read/write/list/log).
- [x] Има референтна имплементация `LocalFsHostAdapter`, която работи върху локален файлов път и не позволява escape извън root.
- [x] Има smoke test, който доказва, че loader-ът може да зареди manifest/session-init/state чрез HostAdapter.

## Tasks / Subtasks
- [x] Добави `HostAdapter` тип в shared types.
- [x] Имплементирай `LocalFsHostAdapter`.
- [x] Добави loader + тест.

## Dev Agent Record / File List / Change Log
- `src/types/host-adapter.ts`
- `src/runtime/local-fs-host-adapter.ts`
- `src/runtime/loader.ts`
- `tools/tests/runtime-loader.test.js`

## Status
done
