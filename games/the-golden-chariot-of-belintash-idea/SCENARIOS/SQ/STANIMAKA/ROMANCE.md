# СТАНИМАКА · SIDE QUESTS — РОМАНТИКА (#35)

> **Traceability**: SIDE-QUESTS.md §Станимака романтика #35 · SCENARIO-WRITING-PLAN §7.3 · SCENARIO-TRACEABILITY.md §Side Quests

---

## SQ-STA-ROM-35 — "Писмата на Мария"

> **Свързани документи**: SIDE-QUESTS.md §35, LOCATIONS.md §Гръцки квартал, NPCS.md §Мария/Илия, COMMUNICATION.md §Secret letters

Мария се появява зад капандура, както Бай Ганьо зад завеса: „Баща ми не дава да се виждаме с Илия. Прати тези писма, но така, че и стените да не заподозрат.“

> **[ИЗБОР] Как пренасяш писмата?**  
> **А)** Скрито в спици на колела на каруцата към пазара. *(Stealth DC 11; успех → писмата стигат, `affinity.maria +5`; провал → стража намира 1 писмо, tension +5)*  
> **Б)** Чрез песен — вмъкваш кодирани фрази, докато свириш на площада. *(Performance DC 12; успех → `state.loveletters_delivered = true`; провал → бащата разбира, reputation -5)*  
> **В)** Уговаряш калфа от занаятчийския квартал да предава бележки. *(Negotiation DC 11; успех → `network.secret_messengers +1`; провал → калфата иска 3 coins)

> **[ИЗБОР] Финал**  
> **А)** Организираш тайна среща в църковния двор. *(Leadership DC 12; успех → `event.secret_betrothal`; провал → отче ги хваща, tension +10)*  
> **Б)** Убеждаваш бащата, че Илия има бъдеще. *(Persuasion DC 13; успех → `reputation.villagers +5`; провал → duel hook)*  
> **В)** Помагаш на двойката да избяга към Каменица. *(Travel DC 12; успех → unlock side quest „Нова къща в Каменица"; провал → random encounter)*

> **STATE UPDATE**  
> - `quest_flags.stanimaka.romance.maria_letters = outcome (approved, secret, eloped)`  
> - Reward: `karma +1`, `reputation.villagers +5`, `item.love_token` (ползва се за успокоение на NPC при бъдещи спорове).

---

> **Set Bonus:** Ако романтичните куестове в Станимака са завършени (добави следващ сценарий при нужда), `state.stanimaka.heartbeats = true`, което дава +2 morale при разговори със съюзници в града.
