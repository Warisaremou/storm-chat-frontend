import { http, HttpResponse } from 'msw';
import { MOCK_CONVERSATIONS } from '../data/conversations.data';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export const conversationsHandlers = [
  // Get all conversations for the current user
  http.get(`${BASE}/rooms`, () => {
    return HttpResponse.json(MOCK_CONVERSATIONS);
  }),

  // Get a single conversation by ID
  http.get(`${BASE}/rooms/:id`, ({ params }) => {
    const id = Number(params.id);
    const conversation = MOCK_CONVERSATIONS.find((c) => c.id === id);

    if (!conversation) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(conversation);
  }),
];
