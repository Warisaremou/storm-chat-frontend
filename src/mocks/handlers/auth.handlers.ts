import { http, HttpResponse, delay } from 'msw';
import { MOCK_CURRENT_USER, MOCK_CURRENT_PROFILE } from '../data/users.data';
import type { AuthUser, UserProfile } from '@/types';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

// In-memory store for newly registered users during the session
// Note: This resets on browser refresh or dev server restart
const REGISTERED_USERS: { user: AuthUser; profile: UserProfile; password: string }[] = [];
let CURRENT_USER_ID: number | null = null;

export const authHandlers = [
  http.post(`${BASE}/auth/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { identifier: string; password: string };

    // 1. Check default mock user
    if (
      (body.identifier === 'charlie@example.com' || body.identifier === 'charlie_dev') &&
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
        (u.user.email === body.identifier || u.user.username === body.identifier) &&
        u.password === body.password,
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

  http.post(`${BASE}/auth/register`, async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { email: string; username: string; password: string };

    const newUser: AuthUser = {
      id: Date.now(), // Dynamic ID
      email: body.email,
      username: body.username,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newProfile: UserProfile = {
      user_id: newUser.id,
      display_name: body.username, // Default to username until setup
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${body.username}`,
      status: 'online',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store in memory for login
    REGISTERED_USERS.push({
      user: newUser,
      profile: newProfile,
      password: body.password,
    });

    // For simplicity, we can set them as the current user right away if registration logs them in
    // But currently the frontend redirects to a setup page that is under GuestGuard.
    // So we don't set CURRENT_USER_ID here to avoid navigating away from Setup.

    return HttpResponse.json(
      { data: { user: newUser }, message: 'Account created' },
      { status: 201 },
    );
  }),

  http.post(`${BASE}/auth/setup`, async ({ request }) => {
    await delay(400);
    const formData = await request.formData();
    const displayName = formData.get('display_name') as string;

    // Find the user we are setting up
    // Since we are likely in a flow where the user JUST registered, they might not be "logged in" yet in the mock's CURRENT_USER_ID
    // Let's assume the setup is for the most recent registration if not logged in.
    const userToUpdate =
      REGISTERED_USERS.find((u) => u.user.id === CURRENT_USER_ID) ||
      REGISTERED_USERS[REGISTERED_USERS.length - 1];

    if (userToUpdate) {
      userToUpdate.profile.display_name = displayName || userToUpdate.profile.display_name;
      return HttpResponse.json({
        data: { profile: userToUpdate.profile },
        message: 'Profile setup complete',
      });
    }

    // Fallback to Charlie if nothing else
    const updatedProfile = {
      ...MOCK_CURRENT_PROFILE,
      display_name: displayName || MOCK_CURRENT_PROFILE.display_name,
    };

    return HttpResponse.json({
      data: { profile: updatedProfile },
      message: 'Profile setup complete',
    });
  }),

  http.post(`${BASE}/auth/forgot-password`, async () => {
    await delay(800);
    return HttpResponse.json({ message: 'Reset email sent' });
  }),

  http.post(`${BASE}/auth/reset-password`, async () => {
    await delay(600);
    return HttpResponse.json({ message: 'Password reset successful' });
  }),

  http.post(`${BASE}/auth/logout`, async () => {
    await delay(200);
    CURRENT_USER_ID = null;
    return HttpResponse.json({ message: 'Logged out' });
  }),

  http.get(`${BASE}/auth/me`, async () => {
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
      return HttpResponse.json({
        data: { user: sessionUser.user, profile: sessionUser.profile },
      });
    }

    return HttpResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }),
];
