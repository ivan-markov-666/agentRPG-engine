# “The Golden Chariot of Belintash” · Epilogue Overview & NG+ Hooks

## 1. Епилози в хронологичен ред
| Епилог | Сцени | Основни събития | Активни state hooks |
| --- | --- | --- | --- |
| **Епилог I — Гласът на Ванга (`main-quest-11`)** | 121–125 | Черен екран → пророчество → археолозите от 70-те → гробището при Белинташ → шепот | `state.epilogue.vanga_message`, `state.epilogue.archaeologists`, `state.epilogue.cemetery` |
| **Епилог II — Писмата и наследниците (`main-quest-12`)** | 126–130 | Писмото е намерено → песента → писмата на археолога → пактът на наследниците → финален кадър на Забърдо | `state.epilogue.heir`, `state.epilogue.song_theme`, `state.epilogue.museum_response`, `state.epilogue.pact` |
| **Епилог III — Гласът на археолозите (`main-quest-13`)** | 131–135 | Броячът на жертвите → скок към 2020-те → избор на лидер на експедицията → отваряне на тунела → осмата жертва | `state.epilogue.counter_style`, `world_state.timeline="2020s_modern_day"`, `state.epilogue.expedition_lead`, `quest_flags.belintash_tunnel_opened` |
| **Епилог IV — Следите от златото (`main-quest-14`)** | 136–140 | Амулетът се пробужда → надписът → съдбата на тайната → гласът зад кадър → финален кадър | `state.epilogue.amulet_status`, `state.epilogue.inscription`, `state.epilogue.outcome`, `state.epilogue.narration`, `credits.config.ending` |

## 2. Ending Summary
| Ending id | Условие | Ефект |
| --- | --- | --- |
| `secret_exposed` | Епилог IV, Step 3A (пресконференция / livestream) | `reputation.common_folk +15`, отключва storyline “Modern Archive Disputes”, `belintash-modern-camp` става публичен музей |
| `legacy_kept` | Step 3B (тайно досие за наследниците) или Епилог III избор А | `reputation.bulgarian_court +10`, `quest_hook.next_generation` остава активен, `belintash-amulet-vault` достъпен само за пазители |
| `silence_enforced` | Step 3C (симулирана катастрофа) или провал на Engineering checks | `state.hazard.belintash_rocks = "collapse_imminent"`, кампаниите следват „Silent Keepers“, тунелът се запечатва |

## 3. NG+ / DLC Hooks
| Hook | Отключва се | Какво означава |
| --- | --- | --- |
| `quest_hook.next_generation` | Епилог II (пакт “train new guardians”) или Ending 140B | Campaign+ с наследниците/учениците на героите |
| `dlc_hook.balkan_trail` | Епилог IV финал “стрела от светлина” (Step 5C) | DLC, водещо към други светилища в Родопите/Балканите |
| `world_bible.pending_case = "belintash_monograph"` | Епилог I, ако археолозите вземат монета | Side quest за модерната публикация и последиците |
| `state.hazard.belintash_rocks = "collapse_imminent"` | Епилог III (капани) или Епилог IV fail state | Survival/repair мисии; без стабилизация NG+ започва с вип-хазард |
| `state.epilogue.pact = "public_letters"` | Епилог II опция В | Urban intrigue кампания във Филипопол |

## 4. Инструкции за GM / Dev
1. **Избор на начално NG+ състояние**  
   - Задай `state.main_quest.current = "post_epilogue"` и избери ending според таблицата.  
   - Ако гоним DLC hook, включи съответните content sets или допълнителни quests.

2. **Документация за ending логовете**  
   - Приключи `player-data/runtime/exploration-log` със събитията `epilogue-final-shot` и `epilogue-narrator-tone` (вече добавени).  
   - Запиши финален summary в `content_sets.base-campaign.notes`, за да показва последната сцена.

3. **Използване на hooks**  
   - NG+ кампании могат да започнат от [[belintash-modern-camp]] или [[zabyrdo]] в зависимост от ending.  
   - DLC сюжетите трябва да проверят `state.epilogue.outcome`, `state.epilogue.heir`, `state.epilogue.expedition_lead`.

4. **QA/Validation**  
   - Финалният валидатор (run-id `dev-55ca2c10-ff33-4ad8-ac83-f4b650d6f0ec`) е чист. При промяна на ending hooks пускай `npm run validate -- --path games/the-golden-chariot-of-belintash`.

## 5. Файлове за бърз reference
- Епилози: `scenario/quests/main-quest-11..14.md`, `scenario/areas/epilogue-*.md`, `scenario/areas/belintash-*.md`
- Runtime snapshot: `player-data/runtime/state.json`
- Exploration history: `player-data/runtime/exploration-log.json`
- Тази бележка: `docs/epilogue-overview.md`
