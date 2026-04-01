import { http, HttpResponse, delay } from 'msw';
import { MOCK_USERS } from '../data/users.data';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export const usersHandlers = [
  // legacy path used by some mocks
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

  // public search at service root (/search)
  http.get(`${BASE}/search`, async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const query = url.searchParams.get('q')?.toLowerCase() ?? '';

    const results = MOCK_USERS.filter(
      (u) => u.username.toLowerCase().includes(query) || u.display_name?.toLowerCase().includes(query),
    );

    return HttpResponse.json({ data: results });
  }),

  http.get(`${BASE}/users/:id`, async ({ params }) => {
    await delay(300);
    const user = MOCK_USERS.find((u) => u.id === String(params.id));
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: user });
  }),

  // patch for profile under root (/me/profile)
  http.patch(`${BASE}/me/profile`, async ({ request }) => {
    await delay(500);
    // for simplicity, echo back body
    const body = await request.json().catch(() => ({}));
    return HttpResponse.json({ data: body, message: 'Profile updated' });
  }),
];
