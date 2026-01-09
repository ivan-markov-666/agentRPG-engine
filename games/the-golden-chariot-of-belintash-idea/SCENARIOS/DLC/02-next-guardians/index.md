# DLC-02 · "Следващото поколение пазители"

> **Hook:** Активира се след `quest_hook.next_generation = true` когато наследниците в Забърдо получат право да изградят новия лагер.
>
> **Active content set:** `next-guardians`

| # | Quest ID | Име | Кратко резюме | Основни state ефекти |
|---|----------|-----|----------------|-----------------------|
| 1 | `dlc-ng-01-initiation` | "Инициации и наследства" | Провеждаш изпити за новите пазители и задаваш техните роли | Инициализира `legacy_rank`, `heir_alignment`, journal hook |
| 2 | `dlc-ng-02-built-citadel` | "Изграждане на цитаделата" | Управляваш ресурси, цикли сезони, строиш ward-ове | Попълва `structures[]`, управлява `town_morale`, отключва съюзи |
| 3 | `dlc-ng-03-legacy-trials` | "Заветните изпитания" | Финален щурм/обсада, която тества решенията ти за учениците | Заключва `trials_result`, експортира cross-DLC флагове |

## Core Systems
- **Legacy Rank:** `legacy_rank` расте според успехите в изпитите; влияе на town morale и buffs в NG+.
- **Town Management:** структури (`structure.*`) определят bonuses (tower, library, wards). Решенията седят в `state.content_sets["next-guardians"].state`.
- **Heir Alignment:** изборите на близначките + Стоян II водят до alignment, което се предава на DLC-03 diplomacy и DLC-04 army helpers.

## Scene Outline
1. **Quest 1:** Инициации, избор на наследници, установяване на morale.
2. **Quest 2:** Изграждане/управление – цикъл пролет/есен, resource dilemmas, town events.
3. **Quest 3:** Legacy Trials – дали пазителите успяват сами, или търсят помощ отвън.

### State Exports
- `content_sets.next-guardians.state.legacy_rank` (0–5) – влияе на morale, DLC-03 дипломатическите DC и NG+ buff.
- `content_sets.next-guardians.state.structures` – списък от `tower`, `library`, `ward`, `training_yard`, `ritual_grove`.
- `content_sets.next-guardians.state.heir_alignment` – `wind`, `earth`, `idealistic`, `pragmatic`.
- `content_sets.next-guardians.state.town_morale` – 0–100, синхронизиран с общото `dlc_state.next_guardians.morale`.
- `content_sets.next-guardians.state.trials_result` – `victory`, `alliance`, `evacuated`.

### Rewards & Cross Hooks
1. **Engineer trainees** (ако ANA водеше DLC-01) дават `advantage` при tower build checks.
2. **Plovdiv alliance** от Quest 2 активира опцията за дипломатически reinforcement в Quest 3 и DLC-03.
3. **Voinuk drills** → unlock `perk.voinuk_guard` в NG+ и buff към DLC-04 stealth missions.

> Тези стойности се записват в `docs/analysis/post-credit-hooks.md` и се използват от validator tooling за да гарантира наличието на всички сцени.

> TODO: добави подробни сцени, конкретни DC и state update формати след като наративът се финализира.
