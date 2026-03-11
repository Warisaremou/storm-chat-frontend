# 🎭 Storm Chat — Mock Data Strategy

> This document explains how to simulate the full app experience without a real backend.
> The approach uses **MSW (Mock Service Worker)** to intercept real HTTP requests at the network level.
> This means the service layer (`src/services/*.service.ts`) works identically in mock and production modes — just swap the base URL and disable MSW.

---

## 1. Why MSW

- Intercepts requests at the browser's Service Worker level (not in JS code)
- The Axios calls in `src/services/` are identical to production calls
- Realistic latency simulation (just add `await delay(400)` in handlers)
- Type-safe handlers that mirror API contract
- Zero production bundle impact — excluded in production builds

---

## 2. Setup

### Install

```bash
npm install -D msw
npx msw init public/ --save
```

### `src/mocks/browser.ts`

```typescript
import { setupWorker } from 'msw/browser';
import { handlers } from './index';

export const worker = setupWorker(...handlers);
```

### `src/mocks/index.ts`

```typescript
import { authHandlers } from './handlers/auth.handlers';
import { usersHandlers } from './handlers/users.handlers';
import { conversationsHandlers } from './handlers/conversations.handlers';
import { messagesHandlers } from './handlers/messages.handlers';
import { invitationsHandlers } from './handlers/invitations.handlers';

export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...conversationsHandlers,
  ...messagesHandlers,
  ...invitationsHandlers,
];
```

### Enabled via env var

```env
VITE_ENABLE_MSW=true
```

In `src/main.tsx`, MSW is only started if `VITE_ENABLE_MSW === 'true'`.

---

## 3. Mock Data Fixtures

### `src/mocks/data/users.data.ts`

```typescript
import type { AuthUser, UserProfile, UserPreview } from '@/types';

export const MOCK_CURRENT_USER: AuthUser = {
  id: 1,
  email: 'charlie@example.com',
  username: 'charlie_dev',
  created_at: '2025-01-10T10:00:00Z',
  updated_at: '2025-01-10T10:00:00Z',
};

export const MOCK_CURRENT_PROFILE: UserProfile = {
  user_id: 1,
  display_name: 'Charlie Dev',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
  status: 'online',
  created_at: '2025-01-10T10:00:00Z',
  updated_at: '2025-01-10T10:00:00Z',
};

export const MOCK_USERS: UserPreview[] = [
  {
    id: 2,
    username: 'alex_storm',
    display_name: 'Alex Storm',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    status: 'online',
  },
  {
    id: 3,
    username: 'maya_ui',
    display_name: 'Maya Chen',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
    status: 'away',
  },
  {
    id: 4,
    username: 'jordan_k',
    display_name: 'Jordan Kowalski',
    avatar_url: null,
    status: 'offline',
  },
  {
    id: 5,
    username: 'priya_dev',
    display_name: 'Priya Sharma',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    status: 'busy',
  },
  {
    id: 6,
    username: 'luca_design',
    display_name: 'Luca Romano',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luca',
    status: 'online',
  },
];
```

### `src/mocks/data/conversations.data.ts`

```typescript
import type { Conversation } from '@/types';
import { MOCK_USERS } from './users.data';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 101,
    room: {
      id: 101,
      name: 'alex_storm-charlie_dev',
      slug: 'alex_storm-charlie_dev',
      description: null,
      type: 'private',
      avatar_url: null,
      creator_id: 1,
      created_at: '2025-01-15T08:00:00Z',
      updated_at: '2025-06-10T14:32:00Z',
    },
    otherParticipant: MOCK_USERS[0], // Alex Storm
    lastMessage: {
      id: 'uuid-last-1',
      room_id: 101,
      sender_id: 2,
      content: 'Sure, see you in the standup!',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T14:32:00Z',
    },
    unreadCount: 0,
    updatedAt: '2025-06-10T14:32:00Z',
  },
  {
    id: 102,
    room: {
      id: 102,
      name: 'maya_ui-charlie_dev',
      slug: 'maya_ui-charlie_dev',
      description: null,
      type: 'private',
      avatar_url: null,
      creator_id: 3,
      created_at: '2025-02-01T11:00:00Z',
      updated_at: '2025-06-10T09:18:00Z',
    },
    otherParticipant: MOCK_USERS[1], // Maya Chen
    lastMessage: {
      id: 'uuid-last-2',
      room_id: 102,
      sender_id: 3,
      content: 'I pushed the new component designs, can you review?',
      delivery_status: 'delivered',
      is_read: false,
      created_at: '2025-06-10T09:18:00Z',
    },
    unreadCount: 3,
    updatedAt: '2025-06-10T09:18:00Z',
  },
  {
    id: 103,
    room: {
      id: 103,
      name: 'priya_dev-charlie_dev',
      slug: 'priya_dev-charlie_dev',
      description: null,
      type: 'private',
      avatar_url: null,
      creator_id: 5,
      created_at: '2025-03-05T15:00:00Z',
      updated_at: '2025-06-09T20:45:00Z',
    },
    otherParticipant: MOCK_USERS[3], // Priya Sharma
    lastMessage: {
      id: 'uuid-last-3',
      room_id: 103,
      sender_id: 1,
      content: 'Thanks for the help!',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-09T20:45:00Z',
    },
    unreadCount: 0,
    updatedAt: '2025-06-09T20:45:00Z',
  },
];
```

### `src/mocks/data/messages.data.ts`

```typescript
import type { Message } from '@/types';

export const MOCK_MESSAGES: Record<number, Message[]> = {
  101: [
    {
      id: 'msg-101-1',
      room_id: 101,
      sender_id: 2,
      content: 'Hey! Are you joining the team sync today?',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T14:20:00Z',
    },
    {
      id: 'msg-101-2',
      room_id: 101,
      sender_id: 1,
      content: "Yes, I'll be there in 10 minutes.",
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T14:25:00Z',
    },
    {
      id: 'msg-101-3',
      room_id: 101,
      sender_id: 2,
      content: 'Sure, see you in the standup!',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T14:32:00Z',
    },
  ],
  102: [
    {
      id: 'msg-102-1',
      room_id: 102,
      sender_id: 1,
      content: 'Hey Maya, did you finish the new designs?',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T09:00:00Z',
    },
    {
      id: 'msg-102-2',
      room_id: 102,
      sender_id: 3,
      content: 'Almost done! Just finishing the mobile states.',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T09:05:00Z',
    },
    {
      id: 'msg-102-3',
      room_id: 102,
      sender_id: 3,
      content: 'I pushed the new component designs, can you review?',
      delivery_status: 'delivered',
      is_read: false,
      created_at: '2025-06-10T09:18:00Z',
    },
  ],
};
```

### `src/mocks/data/invitations.data.ts`

```typescript
import type { InvitationWithUsers } from '@/types';
import { MOCK_USERS } from './users.data';

export const MOCK_RECEIVED_INVITATIONS: InvitationWithUsers[] = [
  {
    id: 1,
    sender_id: 6,
    receiver_id: 1,
    status: 'pending',
    created_at: '2025-06-09T10:00:00Z',
    updated_at: '2025-06-09T10:00:00Z',
    sender: MOCK_USERS[4], // Luca Romano
    receiver: {
      id: 1,
      username: 'charlie_dev',
      display_name: 'Charlie Dev',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      status: 'online',
    },
  },
];

export const MOCK_SENT_INVITATIONS: InvitationWithUsers[] = [
  {
    id: 2,
    sender_id: 1,
    receiver_id: 4,
    status: 'pending',
    created_at: '2025-06-08T15:30:00Z',
    updated_at: '2025-06-08T15:30:00Z',
    sender: {
      id: 1,
      username: 'charlie_dev',
      display_name: 'Charlie Dev',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      status: 'online',
    },
    receiver: MOCK_USERS[2], // Jordan Kowalski
  },
];
```

---

## 4. MSW Handlers

### `src/mocks/handlers/auth.handlers.ts`

```typescript
import { http, HttpResponse, delay } from 'msw';
import { MOCK_CURRENT_USER, MOCK_CURRENT_PROFILE } from '../data/users.data';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const authHandlers = [
  // POST /auth/login
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { identifier: string; password: string };

    if (
      (body.identifier === 'charlie@example.com' || body.identifier === 'charlie_dev') &&
      body.password === 'Password1'
    ) {
      return HttpResponse.json({
        data: {
          user: MOCK_CURRENT_USER,
          profile: MOCK_CURRENT_PROFILE,
        },
        message: 'Login successful',
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      { status: 401 },
    );
  }),

  // POST /auth/register
  http.post(`${BASE}/auth/register`, async () => {
    await delay(600);
    return HttpResponse.json(
      { data: { user: MOCK_CURRENT_USER }, message: 'Account created' },
      { status: 201 },
    );
  }),

  // POST /auth/setup
  http.post(`${BASE}/auth/setup`, async () => {
    await delay(400);
    return HttpResponse.json({
      data: { profile: MOCK_CURRENT_PROFILE },
      message: 'Profile setup complete',
    });
  }),

  // POST /auth/forgot-password
  http.post(`${BASE}/auth/forgot-password`, async () => {
    await delay(800);
    return HttpResponse.json({ message: 'Reset email sent' });
  }),

  // POST /auth/reset-password
  http.post(`${BASE}/auth/reset-password`, async () => {
    await delay(600);
    return HttpResponse.json({ message: 'Password reset successful' });
  }),

  // POST /auth/logout
  http.post(`${BASE}/auth/logout`, async () => {
    await delay(200);
    return HttpResponse.json({ message: 'Logged out' });
  }),

  // GET /auth/me
  http.get(`${BASE}/auth/me`, async () => {
    await delay(300);
    return HttpResponse.json({
      data: {
        user: MOCK_CURRENT_USER,
        profile: MOCK_CURRENT_PROFILE,
      },
    });
  }),
];
```

### `src/mocks/handlers/users.handlers.ts`

```typescript
import { http, HttpResponse, delay } from 'msw';
import { MOCK_USERS } from '../data/users.data';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const usersHandlers = [
  // GET /users/search?q=...
  http.get(`${BASE}/users/search`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() ?? '';

    const results = MOCK_USERS.filter(
      (u) =>
        u.username.toLowerCase().includes(query) || u.display_name?.toLowerCase().includes(query),
    );

    return HttpResponse.json({ data: results });
  }),

  // GET /users/:id
  http.get(`${BASE}/users/:id`, async ({ params }) => {
    await delay(300);
    const user = MOCK_USERS.find((u) => u.id === Number(params.id));
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: user });
  }),

  // PATCH /users/me/profile
  http.patch(`${BASE}/users/me/profile`, async () => {
    await delay(500);
    return HttpResponse.json({ data: {}, message: 'Profile updated' });
  }),
];
```

---

## 5. Simulated Auth State

Since cookies cannot be set by MSW in all scenarios, the auth state is persisted in `localStorage` (only in mock mode) to survive page refreshes.

```typescript
// src/stores/auth.store.ts (mock-aware)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore } from './auth.store.types';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, profile) => set({ user, profile, isAuthenticated: true, error: null }),

      clearAuth: () => set({ user: null, profile: null, isAuthenticated: false }),

      // ... other actions
    }),
    {
      name: 'storm-chat-auth', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
```

**⚠️ Important:** When the real backend is integrated, remove the `persist` middleware from the auth store. Auth state should come from the server session via `/auth/me` on app load.

---

## 6. Demo Credentials

For development and testing:

| Field    | Value                 |
| -------- | --------------------- |
| Email    | `charlie@example.com` |
| Username | `charlie_dev`         |
| Password | `Password1`           |

---

## 7. Removing Mock Layer (Production Handoff)

When the backend is ready:

1. Set `VITE_ENABLE_MSW=false` in `.env.production`
2. Update `VITE_API_URL` to the real API URL
3. Remove `persist` from `useAuthStore`
4. Remove `src/mocks/` directory (optional, keep for testing)
5. The `src/services/` files need zero changes — they already call the correct endpoints

The service layer is the contract. MSW just fills it in during development.
