









Ок, връщаме се към FR‑06/FR‑07. Предлагам следната разбивка (кажи ако искаш промени):

1. **FR‑06 – Exploration logging допълнения**
   - Guardrail за минимален `description`/`tags` брой и cross-check спрямо summary?
   - Допълнителни CLI usage примери (area linking, auto preview update).
   - Telemetry флаг за exploration (напр. брой добавени записи per run).

2. **FR‑07 – Metrics tracking**
   - Авто-генериране на “avg retries”, “clean run streak”, “top codes” (частично в report.js, но можем да добавим още KPI).
   - README/metrics-summary.md обновления с последни резултати.
   - (По избор) CLI опция `--limit`/`--since` за `npm run metrics:report`.

Потвърди кои от тези подточки са приоритети и започвам веднага.