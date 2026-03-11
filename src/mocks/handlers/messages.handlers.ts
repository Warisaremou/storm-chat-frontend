import { http, HttpResponse } from 'msw';
import { MOCK_MESSAGES } from '../data/messages.data';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export const messagesHandlers = [
  // Get messages for a specific room
  http.get(`${BASE}/rooms/:roomId/messages`, ({ params }) => {
    const roomId = Number(params.roomId);
    const messages = MOCK_MESSAGES[roomId] || [];

    return HttpResponse.json(messages);
  }),

  // Send a new message
  http.post(`${BASE}/rooms/:roomId/messages`, async ({ params, request }) => {
    const roomId = Number(params.roomId);
    const body = (await request.json()) as { content: string };

    const newMessage = {
      id: `msg-${Date.now()}`,
      room_id: roomId,
      sender_id: 1, // Assume current user is ID 1
      content: body.content,
      delivery_status: 'sent' as const,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    return HttpResponse.json(newMessage, { status: 201 });
  }),
];
