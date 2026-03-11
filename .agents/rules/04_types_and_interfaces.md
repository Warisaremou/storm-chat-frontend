# 🔷 Storm Chat — TypeScript Types & Interfaces

> All interfaces are derived directly from the database models in `FINAL_DATABASE_MODELING.md`.
> These are the **frontend representations** of the backend data — field names match the API response contract.
> The backend is in Go/GORM but returns JSON with snake_case field names. Axios responses are used as-is.

---

## 1. Enums & Literal Types

```typescript
// src/types/enums.ts

export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export type RoomType = 'public' | 'private';

export type RoomMemberRole = 'owner' | 'admin' | 'member';

export type MessageDeliveryStatus = 'sent' | 'delivered' | 'read';

export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export type Theme = 'light' | 'dark';
```

---

## 2. Auth & User Types

> Derived from `auth_users_db`: `users`, `profiles`, `refresh_tokens` tables

```typescript
// src/types/user.types.ts

import type { UserStatus } from './enums';

// --- auth_users_db.users ---
export interface AuthUser {
  id: number;
  email: string;
  username: string;
  created_at: string;    // ISO 8601 datetime
  updated_at: string;
  // password is NEVER returned by the API
}

// --- auth_users_db.profiles ---
export interface UserProfile {
  user_id: number;
  display_name: string | null;
  avatar_url: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

// Combined view (user + profile together)
// This is what the frontend works with in most places
export interface UserWithProfile extends AuthUser {
  profile: UserProfile;
}

// Minimal user info for lists and previews (search results, invitation cards, etc.)
export interface UserPreview {
  id: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  status: UserStatus;
}
```

---

## 3. Auth Request/Response Types

```typescript
// src/types/auth.types.ts

// --- Register Step 1 ---
export interface RegisterStep1Payload {
  email: string;
  username: string;
  password: string;
}

// --- Register Step 2 (Account Setup) ---
export interface RegisterStep2Payload {
  display_name: string;
  avatar?: File;    // Optional — multipart/form-data if present
}

// --- Login ---
export interface LoginPayload {
  identifier: string;   // Can be email OR username (backend resolves)
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  profile: UserProfile;
  // Auth token is set as an HTTP-only cookie — not in this response body
}

// --- Forgot Password ---
export interface ForgotPasswordPayload {
  email: string;
}

// --- Reset Password ---
export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

// --- Update Profile ---
export interface UpdateProfilePayload {
  display_name?: string;
  status?: UserStatus;
  avatar?: File;        // Optional — multipart/form-data if present
}
```

---

## 4. Room Types

> Derived from `rooms_db`: `rooms`, `room_members` tables
> 
> ⚠️ NOTE: For the current feature scope (1-to-1 DM only), rooms are used as conversation containers.
> A "conversation" in the UI maps to a `Room` with `type: 'private'`.

```typescript
// src/types/room.types.ts

import type { RoomType, RoomMemberRole } from './enums';
import type { UserPreview } from './user.types';

// --- rooms_db.rooms ---
export interface Room {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: RoomType;
  avatar_url: string | null;
  creator_id: number;
  created_at: string;
  updated_at: string;
}

// --- rooms_db.room_members ---
export interface RoomMember {
  room_id: number;
  user_id: number;
  role: RoomMemberRole;
  joined_at: string;
}

// Frontend "Conversation" view
// A private room between two users, enriched with the other participant's info
export interface Conversation {
  id: number;                    // = Room.id
  room: Room;
  otherParticipant: UserPreview; // The other user (not the current user)
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
}
```

---

## 5. Message Types

> Derived from `messages_db` (ScyllaDB): `messages` table

```typescript
// src/types/message.types.ts

import type { MessageDeliveryStatus } from './enums';

// --- messages_db.messages ---
export interface Message {
  id: string;                          // UUID
  room_id: number;
  sender_id: number;
  content: string;
  delivery_status: MessageDeliveryStatus;
  is_read: boolean;
  created_at: string;                  // ISO 8601 datetime (sorted DESC in DB)
}

// Message enriched with sender info (for display in UI)
export interface MessageWithSender extends Message {
  sender: {
    id: number;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

// Payload to send a new message
export interface SendMessagePayload {
  room_id: number;
  content: string;
}
```

---

## 6. Invitation Types

> Invitations are a frontend-layer concept built on top of room membership logic.
> They trigger the creation of a private room upon acceptance.
> 
> The exact invitation table structure will be confirmed by the backend team.
> This is a reasonable assumption based on the feature spec.

```typescript
// src/types/invitation.types.ts

import type { InvitationStatus } from './enums';
import type { UserPreview } from './user.types';

export interface Invitation {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: InvitationStatus;
  created_at: string;
  updated_at: string;
}

// Enriched invitation for display
export interface InvitationWithUsers extends Invitation {
  sender: UserPreview;
  receiver: UserPreview;
}

// Payload to send an invitation
export interface SendInvitationPayload {
  receiver_id: number;
}

// Payload to respond to an invitation
export interface RespondToInvitationPayload {
  invitation_id: number;
  action: 'accept' | 'decline';
}
```

---

## 7. API Response Wrapper

```typescript
// src/types/api.types.ts

// Standard API response envelope (assumed from backend conventions)
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// API Error (normalized in service layer)
export interface ApiError {
  message: string;
  status: number;
  code?: string;   // e.g., 'INVALID_CREDENTIALS', 'USER_NOT_FOUND'
  field?: string;  // For field-level validation errors
}
```

---

## 8. Form Types (Zod Schemas → Types)

```typescript
// src/features/auth/schemas/auth.schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginFormData = z.infer<typeof loginSchema>;


export const registerStep1Schema = z.object({
  email: z.string().email('Please enter a valid email'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(100, 'Username must be less than 100 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[0-9]/, 'Must include at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
export type RegisterStep1FormData = z.infer<typeof registerStep1Schema>;


export const registerStep2Schema = z.object({
  display_name: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(255, 'Display name is too long'),
  avatar: z.instanceof(File).optional().nullable(),
});
export type RegisterStep2FormData = z.infer<typeof registerStep2Schema>;


export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;


export const resetPasswordSchema = z.object({
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must include at least one uppercase letter')
    .regex(/[0-9]/, 'Must include at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.new_password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;


// src/features/profile/schemas/profile.schemas.ts
export const updateProfileSchema = z.object({
  display_name: z.string().min(2).max(255).optional(),
  status: z.enum(['online', 'away', 'busy', 'offline']).optional(),
});
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
```

---

## 9. Store Types

```typescript
// src/stores/auth.store.ts — interface definition

import type { AuthUser, UserProfile } from '@/types/user.types';
import type { LoginPayload } from '@/types/auth.types';

export interface AuthStoreState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthStoreActions {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: AuthUser, profile: UserProfile) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;


// src/stores/ui.store.ts — interface definition

import type { Theme } from '@/types/enums';

export interface UIStoreState {
  theme: Theme;
  sidebarOpen: boolean;
  activeModal: 'userProfile' | 'userSearch' | null;
  modalPayload: unknown;
}

export interface UIStoreActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openModal: (modal: UIStoreState['activeModal'], payload?: unknown) => void;
  closeModal: () => void;
}

export type UIStore = UIStoreState & UIStoreActions;


// src/stores/chat.store.ts — interface definition

import type { Conversation, Message } from '@/types';

export interface ChatStoreState {
  activeConversationId: number | null;
  conversations: Conversation[];
  messages: Record<number, Message[]>;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
}

export interface ChatStoreActions {
  setActiveConversation: (id: number | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  addMessage: (conversationId: number, message: Message) => void;
  setMessages: (conversationId: number, messages: Message[]) => void;
  markConversationRead: (conversationId: number) => void;
}

export type ChatStore = ChatStoreState & ChatStoreActions;
```

---

## 10. Re-export Barrel

```typescript
// src/types/index.ts
export type { UserStatus, RoomType, RoomMemberRole, MessageDeliveryStatus, InvitationStatus, Theme } from './enums';
export type { AuthUser, UserProfile, UserWithProfile, UserPreview } from './user.types';
export type { RegisterStep1Payload, RegisterStep2Payload, LoginPayload, LoginResponse, ForgotPasswordPayload, ResetPasswordPayload, UpdateProfilePayload } from './auth.types';
export type { Room, RoomMember, Conversation } from './room.types';
export type { Message, MessageWithSender, SendMessagePayload } from './message.types';
export type { Invitation, InvitationWithUsers, SendInvitationPayload, RespondToInvitationPayload } from './invitation.types';
export type { ApiResponse, PaginatedResponse, ApiError } from './api.types';
```
