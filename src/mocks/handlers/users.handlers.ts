import { http, HttpResponse, delay } from 'msw';
import { MOCK_USERS } from '../data/users.data';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export const usersHandlers = [
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

  http.get(`${BASE}/users/:id`, async ({ params }) => {
    await delay(300);
    const user = MOCK_USERS.find((u) => u.id === Number(params.id));
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: user });
  }),

  http.patch(`${BASE}/users/me/profile`, async () => {
    await delay(500);
    return HttpResponse.json({ data: {}, message: 'Profile updated' });
  }),
];
