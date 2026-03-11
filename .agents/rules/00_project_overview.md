# ⚡ Storm Chat — Frontend Documentation Index

> **Scope:** UI-only React + Vite frontend. Backend is developed separately. All data is mocked. No real API calls during this phase.

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `01_PROJECT_RULES.md` | Code conventions, ESLint, Prettier, Husky, Git workflow |
| `02_PROJECT_PLAN.md` | Features, pages, routing, component breakdown, implementation phases |
| `03_DESIGN_SYSTEM.md` | Colors, typography, spacing, tokens, component patterns, animations |
| `04_TYPES_AND_INTERFACES.md` | All TypeScript interfaces/types derived from DB modeling |
| `05_FOLDER_STRUCTURE.md` | Complete project folder and file organization |
| `06_MOCK_DATA_STRATEGY.md` | Mock data approach, mock service layer, simulated auth |

---

## 🧠 Key Decisions

- **Framework:** React 19 + Vite 6 + TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Routing:** React Router v7 with lazy-loaded pages
- **HTTP Client:** Axios (cookie-based auth, separated config) — wired but not active yet
- **State:** Zustand for global state (auth, user, UI)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion (minimal, purposeful)
- **Code Quality:** ESLint + Prettier + Husky + lint-staged
- **Mock Layer:** MSW (Mock Service Worker) for realistic API simulation

---

## 🎯 Project Goal

Build a clean, modern, real-time chat application UI. This phase focuses exclusively on:
1. Pixel-perfect UI implementation
2. Correct TypeScript typing (aligned with backend DB models)
3. Full navigation flow (auth → onboarding → chat)
4. Mock data that mirrors the real API contract

The backend team can plug their API in with minimal changes because the Axios config and service layer are already structured correctly.
