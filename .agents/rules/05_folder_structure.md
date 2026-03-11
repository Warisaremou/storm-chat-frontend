# 📁 Storm Chat — Project Folder Structure

> Based on the Bulletproof React architecture pattern.
> Features are self-contained. Shared code lives in `components/`, `lib/`, `hooks/`, and `types/`.
> No feature imports from another feature directly — go through shared layers.

---

```
storm-chat/
│
├── public/
│   ├── favicon.ico
│   └── logo.svg
│
├── src/
│   │
│   ├── assets/                          # Static assets
│   │   └── images/
│   │       └── empty-state-chat.svg
│   │
│   ├── components/                      # Shared, reusable components
│   │   ├── ui/                          # shadcn/ui components (auto-generated + custom)
│   │   │   ├── button.tsx               # shadcn
│   │   │   ├── input.tsx                # shadcn
│   │   │   ├── dialog.tsx               # shadcn
│   │   │   ├── dropdown-menu.tsx        # shadcn
│   │   │   ├── avatar.tsx               # shadcn
│   │   │   ├── badge.tsx                # shadcn
│   │   │   ├── separator.tsx            # shadcn
│   │   │   ├── skeleton.tsx             # shadcn
│   │   │   ├── toast.tsx                # shadcn
│   │   │   ├── toaster.tsx              # shadcn
│   │   │   ├── tooltip.tsx              # shadcn
│   │   │   ├── tabs.tsx                 # shadcn
│   │   │   ├── scroll-area.tsx          # shadcn
│   │   │   └── form.tsx                 # shadcn
│   │   │
│   │   ├── shared/                      # Custom shared components
│   │   │   ├── UserAvatar.tsx           # Avatar + status ring
│   │   │   ├── StatusBadge.tsx          # online/offline/away/busy dot
│   │   │   ├── EmptyState.tsx           # Reusable empty state
│   │   │   ├── LoadingSpinner.tsx       # Centered spinner
│   │   │   ├── PageLoader.tsx           # Full-page loading (lazy pages)
│   │   │   └── ThemeToggle.tsx          # Light/dark toggle button
│   │   │
│   │   └── layout/                      # Layout wrapper components
│   │       ├── AppLayout.tsx            # Authenticated app shell
│   │       ├── AuthLayout.tsx           # Centered auth card layout
│   │       └── ChatLayout.tsx           # 3-column chat layout
│   │
│   ├── features/                        # Feature modules (self-contained)
│   │   │
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterStep1Form.tsx
│   │   │   │   ├── RegisterStep2Form.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   └── ResetPasswordForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   ├── schemas/
│   │   │   │   └── auth.schemas.ts
│   │   │   └── guards/
│   │   │       ├── AuthGuard.tsx        # Redirect to /login if not authed
│   │   │       └── GuestGuard.tsx       # Redirect to /chat if authed
│   │   │
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── ConversationList.tsx
│   │   │   │   ├── ConversationItem.tsx
│   │   │   │   ├── ConversationSearch.tsx
│   │   │   │   ├── MessageList.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── MessageInput.tsx
│   │   │   │   ├── ConversationHeader.tsx
│   │   │   │   └── ChatEmptyState.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useConversations.ts
│   │   │   │   └── useMessages.ts
│   │   │   └── mock/
│   │   │       └── chat.mock.ts
│   │   │
│   │   ├── invitations/
│   │   │   ├── components/
│   │   │   │   ├── ReceivedInvitations.tsx
│   │   │   │   ├── SentInvitations.tsx
│   │   │   │   └── InvitationCard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useInvitations.ts
│   │   │   └── mock/
│   │   │       └── invitations.mock.ts
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── UserSearch.tsx
│   │   │   │   └── UserProfileModal.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useUserSearch.ts
│   │   │   └── mock/
│   │   │       └── users.mock.ts
│   │   │
│   │   └── profile/
│   │       ├── components/
│   │       │   ├── ProfileForm.tsx
│   │       │   ├── AvatarUpload.tsx
│   │       │   └── StatusSelector.tsx
│   │       ├── hooks/
│   │       │   └── useProfile.ts
│   │       └── schemas/
│   │           └── profile.schemas.ts
│   │
│   ├── hooks/                           # Shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   └── useClickOutside.ts
│   │
│   ├── lib/                             # Third-party configurations
│   │   ├── axios.ts                     # Axios instance (cookie-based auth)
│   │   ├── animations.ts                # Framer Motion animation configs
│   │   └── utils.ts                     # cn() utility + helpers
│   │
│   ├── mocks/                           # MSW mock service worker
│   │   ├── browser.ts                   # MSW browser setup
│   │   ├── handlers/
│   │   │   ├── auth.handlers.ts
│   │   │   ├── users.handlers.ts
│   │   │   ├── conversations.handlers.ts
│   │   │   ├── messages.handlers.ts
│   │   │   └── invitations.handlers.ts
│   │   ├── data/
│   │   │   ├── users.data.ts            # Mock user records
│   │   │   ├── conversations.data.ts    # Mock conversations
│   │   │   ├── messages.data.ts         # Mock messages per conversation
│   │   │   └── invitations.data.ts      # Mock invitations
│   │   └── index.ts                     # Export all handlers
│   │
│   ├── pages/                           # Page components (lazy loaded)
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterStep1Page.tsx
│   │   │   ├── RegisterStep2Page.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── ResetPasswordPage.tsx
│   │   ├── app/
│   │   │   ├── ChatPage.tsx
│   │   │   ├── InvitationsPage.tsx
│   │   │   └── ProfileSettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── routes/
│   │   ├── index.tsx                    # Route definitions + lazy imports
│   │   └── paths.ts                     # Route path constants
│   │
│   ├── services/                        # API service layer (Axios calls)
│   │   ├── auth.service.ts
│   │   ├── users.service.ts
│   │   ├── conversations.service.ts
│   │   ├── messages.service.ts
│   │   └── invitations.service.ts
│   │
│   ├── stores/                          # Zustand state stores
│   │   ├── auth.store.ts
│   │   ├── ui.store.ts
│   │   └── chat.store.ts
│   │
│   ├── styles/
│   │   └── globals.css                  # CSS variables + base styles
│   │
│   ├── types/                           # Global TypeScript types
│   │   ├── index.ts                     # Re-export barrel
│   │   ├── enums.ts
│   │   ├── user.types.ts
│   │   ├── auth.types.ts
│   │   ├── room.types.ts
│   │   ├── message.types.ts
│   │   ├── invitation.types.ts
│   │   └── api.types.ts
│   │
│   ├── main.tsx                         # App entry point (MSW setup)
│   └── App.tsx                          # Root component (Router + Providers)
│
├── .env.example
├── .eslintrc.json
├── .gitignore
├── .husky/
│   └── pre-commit
├── .lintstagedrc.json
├── .prettierrc
├── components.json                      # shadcn/ui config
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Key File Starters

### `src/main.tsx`

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') return;
  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
```

### `src/App.tsx`

```typescript
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { router } from '@/routes';
import { useUIStore } from '@/stores/ui.store';
import { useEffect } from 'react';

export default function App() {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
```

### `src/routes/index.tsx`

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PATHS } from './paths';
import { AuthGuard } from '@/features/auth/guards/AuthGuard';
import { GuestGuard } from '@/features/auth/guards/GuestGuard';
import { PageLoader } from '@/components/shared/PageLoader';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';

const LoginPage           = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterStep1Page   = lazy(() => import('@/pages/auth/RegisterStep1Page'));
const RegisterStep2Page   = lazy(() => import('@/pages/auth/RegisterStep2Page'));
const ForgotPasswordPage  = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage   = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const ChatPage            = lazy(() => import('@/pages/app/ChatPage'));
const InvitationsPage     = lazy(() => import('@/pages/app/InvitationsPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/app/ProfileSettingsPage'));
const NotFoundPage        = lazy(() => import('@/pages/NotFoundPage'));

const wrap = (el: JSX.Element) => <Suspense fallback={<PageLoader />}>{el}</Suspense>;

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={PATHS.CHAT} replace /> },
  {
    element: <GuestGuard><AuthLayout /></GuestGuard>,
    children: [
      { path: PATHS.LOGIN,            element: wrap(<LoginPage />) },
      { path: PATHS.REGISTER,         element: wrap(<RegisterStep1Page />) },
      { path: PATHS.REGISTER_SETUP,   element: wrap(<RegisterStep2Page />) },
      { path: PATHS.FORGOT_PASSWORD,  element: wrap(<ForgotPasswordPage />) },
      { path: PATHS.RESET_PASSWORD,   element: wrap(<ResetPasswordPage />) },
    ],
  },
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { path: PATHS.CHAT,                element: wrap(<ChatPage />) },
      { path: PATHS.CHAT_CONVERSATION,   element: wrap(<ChatPage />) },
      { path: PATHS.INVITATIONS,         element: wrap(<InvitationsPage />) },
      { path: PATHS.PROFILE_SETTINGS,    element: wrap(<ProfileSettingsPage />) },
    ],
  },
  { path: '*', element: wrap(<NotFoundPage />) },
]);
```

### `src/lib/axios.ts`

```typescript
import axios from 'axios';
import type { ApiError } from '@/types/api.types';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10_000,
});

// Request interceptor — can add auth headers here if needed
apiClient.interceptors.request.use((config) => {
  return config;
});

// Response interceptor — normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'An unexpected error occurred',
      status: error.response?.status ?? 0,
      code: error.response?.data?.code,
      field: error.response?.data?.field,
    };
    return Promise.reject(apiError);
  },
);
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```
