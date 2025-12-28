# Sprint Plan — Sprint 02 (Guardrails + TS Execution)

_Last updated: 2025-12-28_

## Objective
Да изпълним основните stories от EP-001..EP-004 (валидатор, guardrails, observability, TypeScript) и да подготвим release-ready guardrails.

## Candidate Stories
- ST-001, ST-002, ST-003, ST-004, ST-005 (Validator & telemetry core)
- ST-006, ST-007, ST-008 (Guardrails/quests)
- ST-009 (Observability insights)
- ST-010, ST-011, ST-012 (TS adoption)

## Proposed Iteration Flow
1. TS Tooling bootstrap (ST-010) → shared types (ST-011) → CLI migration (ST-012).
2. Паралелно: Validator DoD stories (ST-001…ST-005) за да поддържат DoD.
3. Завършваме guardrails (ST-006…ST-008) и metrics insights (ST-009).

## Risks / Notes
- TS migration може да изисква refactor — планирай буфер.
- Guardrail stories имат зависимости (schema → validator → docs) → изпълнявай в този ред.

_Този документ служи като чернова за следващия sprint planning cycle._
