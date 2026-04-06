import { http, HttpResponse, delay } from 'msw';
import { MOCK_CURRENT_USER, MOCK_CURRENT_PROFILE } from '../data/users.data';
import type { AuthUser, UserProfile } from '@/types';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

// In-memory store for newly registered users during the session
// Note: This resets on browser refresh or dev server restart
const REGISTERED_USERS: { user: AuthUser; profile: UserProfile; password: string }[] = [];
let CURRENT_USER_ID: string | null = null;

export const authHandlers = [
  http.post(`${BASE}/users/auth/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as {
      identifier?: string;
      identity?: string;
      password: string;
    };
    const identity = body.identity ?? body.identifier;

    // 1. Check default mock user
    if (
      (identity === 'charlie@example.com' || identity === 'charlie_dev') &&
      body.password === 'Password1'
    ) {
      CURRENT_USER_ID = MOCK_CURRENT_USER.id;
      return HttpResponse.json({
        data: {
          user: MOCK_CURRENT_USER,
          profile: MOCK_CURRENT_PROFILE,
        },
        message: 'Login successful',
      });
    }

    // 2. Check in-memory session users
    const sessionUser = REGISTERED_USERS.find(
      (u) =>
        (u.user.email === identity || u.user.username === identity) && u.password === body.password,
    );

    if (sessionUser) {
      CURRENT_USER_ID = sessionUser.user.id;
      return HttpResponse.json({
        data: {
          user: sessionUser.user,
          profile: sessionUser.profile,
        },
        message: 'Login successful',
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' },
      { status: 401 },
    );
  }),

  http.post(`${BASE}/users/auth/register`, async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { email: string; username: string; password: string };

    const newUser: AuthUser = {
      id: String(Date.now()),
      email: body.email,
      username: body.username,
      role: 'user',
      created_at: new Date().toISOString(),
    };

    const newProfile: UserProfile = {
      user_id: newUser.id,
      display_name: body.username,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.username}`,
      status: 'online',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    REGISTERED_USERS.push({ user: newUser, profile: newProfile, password: body.password });

    return HttpResponse.json(
      { data: { user: newUser }, message: 'Account created' },
      { status: 201 },
    );
  }),

  http.post(`${BASE}/users/auth/forgot-password`, async () => {
    await delay(800);
    return HttpResponse.json({ message: 'Reset email sent' });
  }),

  http.post(`${BASE}/users/auth/reset-password`, async () => {
    await delay(600);
    return HttpResponse.json({ message: 'Password reset successful' });
  }),

  http.post(`${BASE}/users/auth/logout`, async () => {
    await delay(200);
    CURRENT_USER_ID = null;
    return HttpResponse.json({ message: 'Logged out' });
  }),

  http.post(`${BASE}/users/auth/refresh`, async () => {
    await delay(200);
    if (!CURRENT_USER_ID) {
      return HttpResponse.json({ message: 'No active session' }, { status: 401 });
    }
    return HttpResponse.json({ message: 'token refreshed successfully' });
  }),

  // also expose /me at service root to match backend
  http.get(`${BASE}/users/me`, async () => {
    await delay(300);
    if (!CURRENT_USER_ID) {
      return HttpResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }

    if (CURRENT_USER_ID === MOCK_CURRENT_USER.id) {
      return HttpResponse.json({
        data: { user: MOCK_CURRENT_USER, profile: MOCK_CURRENT_PROFILE },
      });
    }

    const sessionUser = REGISTERED_USERS.find((u) => u.user.id === CURRENT_USER_ID);
    if (sessionUser) {
      return HttpResponse.json({ data: { user: sessionUser.user, profile: sessionUser.profile } });
    }

    return HttpResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }),
];
