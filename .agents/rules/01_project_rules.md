# 📏 Storm Chat — Project Rules & Code Standards

## 1. Tech Stack (Locked)

| Tool                  | Version      | Purpose                           |
| --------------------- | ------------ | --------------------------------- |
| React                 | 19.x         | UI framework                      |
| Vite                  | 6.x          | Build tool & dev server           |
| TypeScript            | 5.x (strict) | Type safety                       |
| Tailwind CSS          | v4           | Utility-first styling             |
| shadcn/ui             | latest       | Component library                 |
| React Router          | v7           | Client-side routing (lazy pages)  |
| Zustand               | 5.x          | Global state management           |
| React Hook Form       | 7.x          | Form state & validation           |
| Zod                   | 3.x          | Schema validation                 |
| Axios                 | 1.x          | HTTP client (cookie-based)        |
| Framer Motion         | 11.x         | Animations                        |
| MSW                   | 2.x          | Mock Service Worker (API mocking) |
| Lucide React          | latest       | Icon library                      |
| date-fns              | 4.x          | Date formatting                   |
| clsx + tailwind-merge | latest       | Class utilities                   |

---

## 2. TypeScript Rules

- **Strict mode is mandatory.** `tsconfig.json` must have `"strict": true`.
- **No `any`.** Use `unknown` and narrow types explicitly.
- **No implicit `any`.** All function parameters and return types must be typed.
- **No type assertions (`as`)** unless absolutely necessary and commented.
- **Prefer `interface` for object shapes**, `type` for unions, intersections, and aliases.
- **Export types from their domain** (e.g., `src/types/user.types.ts`).
- **Zod schemas are the source of truth for form/API validation** — infer types from schemas with `z.infer<typeof schema>`.

```typescript
// ✅ Good
interface UserProfile {
  id: number;
  displayName: string;
  avatarUrl: string | null;
  status: UserStatus;
}

// ❌ Bad
const user: any = fetchUser();
```

---

## 3. Component Rules

### File Naming

- **Pages:** `PascalCase.tsx` → `LoginPage.tsx`
- **Components:** `PascalCase.tsx` → `UserAvatar.tsx`
- **Hooks:** `camelCase.ts` prefixed with `use` → `useAuth.ts`
- **Types:** `camelCase.types.ts` → `user.types.ts`
- **Services:** `camelCase.service.ts` → `auth.service.ts`
- **Stores:** `camelCase.store.ts` → `auth.store.ts`
- **Utils:** `camelCase.utils.ts` → `date.utils.ts`

### Component Structure (order inside file)

```typescript
// 1. Imports (external → internal → types → styles)
import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserAvatar } from '@/components/ui/UserAvatar';
import type { User } from '@/types/user.types';

// 2. Types/interfaces local to this component
interface Props {
  user: User;
  onSelect: (userId: number) => void;
}

// 3. Constants (if needed)
const ANIMATION_DURATION = 0.2;

// 4. Component
export function UserCard({ user, onSelect }: Props) {
  // 4a. Hooks
  // 4b. Derived state
  // 4c. Handlers
  // 4d. JSX return
}
```

### Rules

- **One component per file.**
- **No default exports** except for lazy-loaded pages (required by React.lazy).
- **Named exports everywhere else.**
- **Props must be typed** — never use implicit props.
- **No inline styles** — use Tailwind classes only. Use CSS variables for dynamic values.
- **Max component length: 200 lines.** If longer, split into sub-components.

---

## 4. Folder & Import Rules

- **Use path aliases.** Configure `@/` as `src/`.
- **No relative imports crossing feature boundaries.** `../../` chains are forbidden between feature folders.
- **Barrel files (`index.ts`)** are allowed inside feature folders for clean imports but not required at every level.

```typescript
// ✅ Good
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

// ❌ Bad
import { useAuth } from '../../../features/auth/hooks/useAuth';
```

---

## 5. State Management Rules

- **Zustand for global state** (auth session, user profile, active conversation, UI overlays).
- **Local `useState`/`useReducer` for component-local state** (form inputs, toggles, hover states).
- **No prop drilling beyond 2 levels.** Use Zustand or React Context for deeper state.
- **Zustand stores must be typed.** Define the store interface separately.
- **Selectors must be used** — don't subscribe to the whole store.

```typescript
// ✅ Good
const currentUser = useAuthStore((state) => state.user);

// ❌ Bad
const { user, logout, isLoading } = useAuthStore();
```

---

## 6. Routing Rules

- **All page components are lazy-loaded** using `React.lazy` + `Suspense`.
- **Routes are defined in a single file:** `src/routes/index.tsx`.
- **Route paths are constants** defined in `src/routes/paths.ts`.
- **Protected routes** wrap pages that require authentication.
- **Public routes** redirect authenticated users away from auth pages.

```typescript
// src/routes/paths.ts
export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_SETUP: '/register/setup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  CHAT: '/chat',
  CHAT_CONVERSATION: '/chat/:conversationId',
  INVITATIONS: '/invitations',
  PROFILE_SETTINGS: '/settings/profile',
} as const;
```

---

## 7. API & Service Layer Rules

- **All Axios calls are in service files** in `src/services/`. No API calls in components or stores.
- **The Axios instance is centralized** in `src/lib/axios.ts`.
- **Cookies are used for auth** — `withCredentials: true` on the Axios instance.
- **Responses are typed** — every service function has a typed return.
- **Error handling is done in services** — throw normalized errors using a custom `ApiError` class.
- **During mock phase:** Services call MSW handlers, not the real API. The base URL in `src/lib/axios.ts` points to the dev server but MSW intercepts requests.

```typescript
// src/lib/axios.ts — Never change this structure
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Required for cookie-based auth
  headers: { 'Content-Type': 'application/json' },
});
```

---

## 8. Styling Rules

- **Tailwind utility classes are the primary styling method.**
- **Use `cn()` utility** (clsx + tailwind-merge) for conditional classes.
- **CSS variables for design tokens** (colors, radius, spacing) — defined in `src/styles/globals.css`.
- **No inline `style` attribute** unless absolutely necessary (dynamic values that Tailwind can't handle).
- **Responsive design is mobile-first.** Start with mobile, add `md:` and `lg:` breakpoints.
- **Dark mode:** Implement from the start using Tailwind's `dark:` variant. The app supports light/dark themes.
- **shadcn/ui components** are the base for all interactive elements (Button, Input, Dialog, etc.).

---

## 9. Form Rules

- **All forms use React Hook Form.**
- **All validation schemas are Zod.**
- **Types are inferred from schemas** — never duplicate type definitions for forms.
- **Error messages are user-friendly** — no technical jargon.
- **Loading states are shown on submit buttons** during async operations.

---

## 10. Animation Rules

- **Use Framer Motion for all animations.**
- **Keep animations subtle and fast** (100–300ms for micro-interactions, 300–500ms for page transitions).
- **Respect `prefers-reduced-motion`:**

```typescript
// src/hooks/useReducedMotion.ts
import { useReducedMotion } from 'framer-motion';
// Always check this before animating
```

- **Allowed animations:**
  - Page transitions (fade + slight slide)
  - Sidebar open/close
  - Modal enter/exit
  - Toast notifications
  - Message appear in conversation
  - Online status indicator pulse
  - Button hover/press micro-interactions
- **Not allowed:** Looping animations, excessive bounce, anything that moves content unexpectedly.

---

## 11. ESLint Configuration

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/consistent-type-imports": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "jsx-a11y/anchor-is-valid": "off"
  }
}
```

---

## 12. Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 13. Husky + lint-staged Configuration

```json
// package.json (scripts section)
{
  "scripts": {
    "prepare": "husky"
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

```json
// .lintstagedrc.json
{
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
}
```

**Pre-commit hooks run:**

1. ESLint with auto-fix
2. Prettier formatting
3. TypeScript type-check (`tsc --noEmit`)

---

## 14. Environment Variables

```env
# .env.example (commit this, NOT .env)
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_ENABLE_MSW=true
VITE_APP_NAME=Storm Chat
```

- All env vars must be prefixed with `VITE_` to be accessible in the browser.
- Never commit `.env` — only `.env.example`.
- Access via `import.meta.env.VITE_*`.

---

## 15. Git Conventions

### Branch Naming

```
feature/short-description
fix/short-description
chore/short-description
```

### Commit Messages (Conventional Commits)

```
feat: add user invitation flow
fix: correct avatar upload validation
chore: update dependencies
style: fix button hover state
refactor: extract useConversation hook
docs: update design system tokens
```

### Pull Request Rules

- PRs must pass all lint checks.
- PRs must have a clear description of what changed.
- No WIP commits in main branch.

---

## 16. Accessibility Rules

- All interactive elements must have accessible names (aria-label or visible text).
- Color contrast must meet WCAG AA (4.5:1 for text).
- Keyboard navigation must work for all flows.
- Focus indicators must be visible.
- Images must have alt text.
- Forms must have properly associated labels.
