import { http, HttpResponse, delay } from 'msw';
import { MOCK_USERS } from '../data/users.data';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export const usersHandlers = [
  // GET /search?q= — recherche par email ou username
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

  // GET /users/:id — récupère un utilisateur par ID
  http.get(`${BASE}/users/:id`, async ({ params }) => {
    await delay(300);
    const user = MOCK_USERS.find((u) => u.id === String(params.id));
    if (!user) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return HttpResponse.json({ data: user });
  }),

  // PATCH /users/me/profile — mise à jour du profil
  http.patch(`${BASE}/users/me/profile`, async ({ request }) => {
    await delay(500);
    const body = await request.json().catch(() => ({}));
    return HttpResponse.json({ data: body, message: 'Profile updated' });
  }),
];
