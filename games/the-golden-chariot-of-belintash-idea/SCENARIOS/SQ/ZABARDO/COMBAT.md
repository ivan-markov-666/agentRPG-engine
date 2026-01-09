# ЧУДНИ МОСТОВЕ / ЗАБЪРДО · SIDE QUESTS — БОЙ (#53–55)

> **Traceability**: SIDE-QUESTS.md §Чудни мостове/Забърдо бой #53–55 · SCENARIO-WRITING-PLAN §7.6 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-ZAB-CBT-53 — "Синовете на Змея"

> **Свързани документи**: SIDE-QUESTS.md §53, MAIN-QUEST-OUTLINE.md §Act IV, BESTIARY.md §Cultists, LORE-CARDS.md §Dragon Sons

В пещерите под Чудните мостове култът строи олтар от кости и прахан. Водачът им ръси змийска кръв и говори като оратор на нечестив парламент: „Змейовете ще се върнат, а ние ще сме им данъчните инспектори.“

> **[ИЗБОР] Тактика срещу култа**  
> **А)** Фронтален удар през главния вход. *(Combat DC 15; успех → morale +10; провал → капани, health -15)*  
> **Б)** Инfiltration чрез горната арка и въжета. *(Stealth DC 13; успех → изненадваш жреца; провал → падане, tension +10)*  
> **В)** Подпалваш праханените им складове. *(Engineering DC 14; успех → cult HP -15 at start; провал → тунел обрушва, escape check)*

> **Encounter:** High Priest HP 110 (spell „Serpent Lash") + 4 Cult Fanatics HP 45. Ако стои companion Стоян → доплнителен morale buff. Победа → `item.dragon_sigil`, `reputation.brotherhood +50`, `moneta_key_hook`.

> **STATE UPDATE**  
> - `quest_flags.zabardo.combat.dragon_sons = defeated`  
> - Unlock main quest progression (`state.sons_of_dragon_base = cleared`).

---

## SQ-ZAB-CBT-54 — "Спасяване на жертви"

> **Свързани документи**: SIDE-QUESTS.md §54, LOCATIONS.md §Подножие на мостовете, NPCS.md §Слави Овчаря, WORLD-BIBLE.md §Captives

Въжетата над пропастта висят като незавършени бюрократични формуляри. Слави Овчаря сочи към клетките: „Живи хора висят там като звънци. Ако паднат, култът печели.“

> **[ИЗБОР] План за спасение**  
> **А)** Режеш въжетата и ги прехвърляш на импровизирани мостове. *(Athletics DC 13; успех → спасяваш 3 пленници; провал → един пада, karma -1)*  
> **Б)** Организираш отвличащ бой, докато други освобождават клетките. *(Leadership DC 12; успех → villagers help; провал → villagers ran, tension +5)*  
> **В)** Използваш магически ветрове/бури да снишиш клетките. *(Arcana DC 14; успех → zero casualties; провал → клетките се блъскат, health -10 пленник)*

> **Encounter:** Wave of cult guards (HP 40) + archers на скалите. Времева лента: 3 рунда за спасение. Ако успееш -> `karma +2`, `reputation.villagers +15`, `ally.rescued_mage` (възможна доп сцена).

> **STATE UPDATE**  
> - `quest_flags.zabardo.combat.rescue = survivors_count`  
> - Unlock `event.grateful_families` (morale +10 camp scene).

---

## SQ-ZAB-CBT-55 — "Мечката-пазител"

> **Свързани документи**: SIDE-QUESTS.md §55, BESTIARY.md §Spirit Bear, MAGIC-SPELLS.md §Animal diplomacy, LOCATIONS.md §Вход към пещерите

На път към последния вход стои мечка с козина като каменна арка. Очите ѝ светят синьо; пази прага от „недостойни като данъчна проверка след избори“.

> **[ИЗБОР] Подход**  
> **А)** Честен бой с копие и факли. *(Combat DC 15; мечка HP 120, swipe 25 dmg; успех → loot „guardian hide"; провал → wound -20 HP)*  
> **Б)** Дипломация чрез древна песен (изисква `spell.protection_from_beasts`). *(Spirit DC 14; успех → мечката става съюзник за 1 encounter; провал → я ядосваш, +rage)*  
> **В)** Хитрост – пускаш ехо от змейов рев, за да я изплашиш. *(Performance/Engineering DC 13; успех → мечката отстъпва; провал → тя се дразни, initiative -5)*

> **STATE UPDATE**  
> - `quest_flags.zabardo.combat.guardian_bear = {slain, allied, bypassed}`  
> - Rewards: (slain) `item.guardian_talisman`; (allied) `summon.guardian_bear`; (bypassed) `access.secret_path`.

---

> **Set Bonus:** Всички бойни куестове в региона → `state.zabardo.warfront = stabilized`, което дава -3 DC за навигация към Белинташ и отключва сцена „Пастирският съвет под мостовете“ (foreshadow за финала).
