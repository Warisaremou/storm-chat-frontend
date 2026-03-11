# 🗺️ Storm Chat — Project Plan

## 1. Feature Scope (UI Phase)

> These are the ONLY features to implement. Do not add anything else.

### Auth Features

| #   | Feature                           | Description                          |
| --- | --------------------------------- | ------------------------------------ |
| A1  | Register — Step 1                 | Email, username, password form       |
| A2  | Register — Step 2 (Account Setup) | Display name, optional avatar upload |
| A3  | Login                             | Email OR username + password         |
| A4  | Forgot Password                   | Enter email to receive reset link    |
| A5  | Reset Password                    | New password form (via token in URL) |

### User Features

| #   | Feature              | Description                            |
| --- | -------------------- | -------------------------------------- |
| U1  | View own profile     | Profile settings page                  |
| U2  | Update profile       | Edit display name, status, bio         |
| U3  | Upload/change avatar | With preview and crop option           |
| U4  | Search users         | Search by username                     |
| U5  | Send invitation      | Send a chat invitation to another user |

### Invitation Features

| #   | Feature                   | Description                 |
| --- | ------------------------- | --------------------------- |
| I1  | View received invitations | List of pending invitations |
| I2  | Accept invitation         | Creates a new conversation  |
| I3  | Decline invitation        | Removes invitation          |

### Chat Features

| #   | Feature               | Description                         |
| --- | --------------------- | ----------------------------------- |
| C1  | Conversation list     | Sidebar list of conversations       |
| C2  | Open conversation     | View message thread                 |
| C3  | Send message          | Text message input + send           |
| C4  | View message history  | Scrollable chat history             |
| C5  | View contact profile  | Modal with contact's public profile |
| C6  | Online status display | Show online/offline/away/busy       |

---

## 2. Pages & Routes

### Public Routes (no auth required)

```
/login                    → LoginPage
/register                 → RegisterStep1Page
/register/setup           → RegisterStep2Page (after step 1 completion)
/forgot-password          → ForgotPasswordPage
/reset-password           → ResetPasswordPage  (expects ?token= query param)
```

### Protected Routes (auth required)

```
/chat                     → ChatPage (redirect to first conversation or empty state)
/chat/:conversationId     → ChatPage (with active conversation)
/invitations              → InvitationsPage
/settings/profile         → ProfileSettingsPage
```

### Root redirect

```
/                         → redirect to /chat if authed, else /login
```

---

## 3. Page Breakdown

### `LoginPage`

- Logo + tagline
- Form: identifier (email or username), password
- Forgot password link
- Register link
- Submit button with loading state
- Error display (invalid credentials)

### `RegisterStep1Page`

- Progress indicator (Step 1 of 2)
- Form: email, username, password, confirm password
- Real-time validation
- Login link

### `RegisterStep2Page`

- Progress indicator (Step 2 of 2)
- Form: display_name (required), avatar upload (optional)
- Avatar preview
- "Skip for now" option for avatar
- Finish button

### `ForgotPasswordPage`

- Form: email input
- Success state: confirmation message
- Back to login link

### `ResetPasswordPage`

- Form: new password + confirm password
- Token validation (show error if token invalid/expired)
- Success state: redirect to login

### `ChatPage`

**Layout: 3-column**

- **Column 1 (Sidebar):** App branding, nav links, conversation list, user avatar + status at bottom
- **Column 2 (Conversation list):** Search bar, list of direct message conversations
- **Column 3 (Chat area):** Active conversation header, message list, message input

**Empty state (no conversation selected):**

- Centered illustration + "Select a conversation to start chatting"
- "Find people" CTA button

### `InvitationsPage`

- Tabs: "Received" | "Sent"
- Each invitation card: avatar, username, display name, sent time
- Accept / Decline actions (received tab)
- Cancel action (sent tab)
- Empty states for each tab

### `ProfileSettingsPage`

- Current avatar display with change button
- Form: display_name, status selector (online/away/busy)
- Save button with loading state
- Danger zone: (no delete account in this phase)

---

## 4. Component Architecture

### Layout Components

```
src/components/layout/
├── AppLayout.tsx          # Root layout for authenticated pages
├── AuthLayout.tsx         # Centered layout for auth pages
├── ChatLayout.tsx         # 3-column chat layout
└── Sidebar.tsx            # Left navigation sidebar
```

### UI Components (shadcn-based & custom)

```
src/components/ui/
├── [all shadcn components]
├── UserAvatar.tsx          # Avatar with online status ring
├── StatusBadge.tsx         # online/offline/away/busy indicator
├── MessageBubble.tsx       # Single chat message
├── ConversationItem.tsx    # Conversation list item
├── InvitationCard.tsx      # Invitation list item
├── SearchInput.tsx         # User search input
├── UserProfileModal.tsx    # Contact profile in a dialog
├── AvatarUpload.tsx        # Avatar upload with preview
├── EmptyState.tsx          # Reusable empty state component
└── LoadingSpinner.tsx      # Centered loading spinner
```

### Feature Components

```
src/features/
├── auth/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterStep1Form.tsx
│   │   ├── RegisterStep2Form.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── ResetPasswordForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── schemas/
│       └── auth.schemas.ts
│
├── chat/
│   ├── components/
│   │   ├── ConversationList.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   └── ConversationHeader.tsx
│   ├── hooks/
│   │   ├── useConversations.ts
│   │   └── useMessages.ts
│   └── mock/
│       └── chat.mock.ts
│
├── invitations/
│   ├── components/
│   │   ├── ReceivedInvitations.tsx
│   │   └── SentInvitations.tsx
│   ├── hooks/
│   │   └── useInvitations.ts
│   └── mock/
│       └── invitations.mock.ts
│
├── users/
│   ├── components/
│   │   ├── UserSearch.tsx
│   │   └── UserProfileModal.tsx
│   ├── hooks/
│   │   └── useUserSearch.ts
│   └── mock/
│       └── users.mock.ts
│
└── profile/
    ├── components/
    │   └── ProfileForm.tsx
    └── hooks/
        └── useProfile.ts
```

---

## 5. Global State (Zustand Stores)

### `authStore`

```typescript
interface AuthState {
  user: AuthUser | null; // From users table
  profile: UserProfile | null; // From profiles table
  isAuthenticated: boolean;
  isLoading: boolean;
  // Actions
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser, profile: UserProfile) => void;
}
```

### `uiStore`

```typescript
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  activeModal: 'userProfile' | 'search' | null;
  modalData: unknown;
  // Actions
  toggleSidebar: () => void;
  toggleTheme: () => void;
  openModal: (modal: UIState['activeModal'], data?: unknown) => void;
  closeModal: () => void;
}
```

### `chatStore`

```typescript
interface ChatState {
  activeConversationId: number | null;
  conversations: Conversation[];
  messages: Record<number, Message[]>; // conversationId → messages
  // Actions
  setActiveConversation: (id: number) => void;
  addMessage: (conversationId: number, message: Message) => void;
}
```

---

## 6. Implementation Phases

### Phase 1 — Project Setup

- [ ] Init Vite + React + TypeScript
- [ ] Configure Tailwind CSS v4
- [ ] Install and configure shadcn/ui
- [ ] Setup ESLint + Prettier + Husky + lint-staged
- [ ] Configure path aliases (`@/`)
- [ ] Setup React Router with lazy loading
- [ ] Setup Axios instance
- [ ] Setup MSW with initial handlers
- [ ] Setup Zustand stores (empty)
- [ ] Define all TypeScript types/interfaces
- [ ] Create `globals.css` with design tokens

### Phase 2 — Auth Pages

- [ ] AuthLayout component
- [ ] LoginPage
- [ ] RegisterStep1Page
- [ ] RegisterStep2Page (with avatar upload)
- [ ] ForgotPasswordPage
- [ ] ResetPasswordPage
- [ ] Route protection (AuthGuard, GuestGuard)
- [ ] Mock auth service (MSW)
- [ ] authStore implementation

### Phase 3 — App Shell

- [ ] AppLayout (sidebar + main)
- [ ] Sidebar component (nav links, user info)
- [ ] ChatLayout (3-column)
- [ ] Responsive sidebar (collapsible on mobile)
- [ ] Theme toggle (light/dark)
- [ ] uiStore implementation

### Phase 4 — Chat Feature

- [ ] ConversationList component
- [ ] ChatPage (empty state)
- [ ] MessageList component
- [ ] MessageInput component
- [ ] ConversationHeader component
- [ ] UserProfileModal component
- [ ] Mock chat data
- [ ] chatStore implementation

### Phase 5 — Invitations Feature

- [ ] InvitationsPage
- [ ] ReceivedInvitations component
- [ ] SentInvitations component
- [ ] InvitationCard component
- [ ] UserSearch component (for sending invitations)
- [ ] Mock invitations data

### Phase 6 — Profile Settings

- [ ] ProfileSettingsPage
- [ ] AvatarUpload component (with local preview)
- [ ] ProfileForm component
- [ ] StatusSelector component

### Phase 7 — Polish & QA

- [ ] All loading states
- [ ] All error states
- [ ] All empty states
- [ ] Responsive layout audit (mobile, tablet, desktop)
- [ ] Animation pass (Framer Motion)
- [ ] Accessibility audit
- [ ] Dark mode audit

---

## 7. Key UX Flows

### Registration Flow

```
/register → fill email/username/password → submit
  → redirect to /register/setup
  → fill display_name, optional avatar
  → submit → redirect to /chat
```

### Login Flow

```
/login → fill identifier + password → submit
  → success → redirect to /chat
  → fail → show inline error
```

### Sending an Invitation

```
Chat page → click "Find people" (or search icon)
  → search modal opens → type username
  → results appear → click "Invite" on a user
  → success toast: "Invitation sent!"
```

### Accepting an Invitation

```
/invitations → Received tab
  → click "Accept" on invitation card
  → conversation is created
  → redirect to /chat/:newConversationId
```

### Opening a Profile

```
Chat area → click on contact avatar/name in header
  → UserProfileModal opens (slide in from right)
  → shows: avatar, display_name, username, status
  → close button or click outside to dismiss
```
