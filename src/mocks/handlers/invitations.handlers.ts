import { http, HttpResponse } from 'msw';
import { MOCK_RECEIVED_INVITATIONS, MOCK_SENT_INVITATIONS } from '../data/invitations.data';

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000';

export const invitationsHandlers = [
  // Get all invitations (received and sent)
  http.get(`${BASE}/invitations`, () => {
    return HttpResponse.json({
      received: MOCK_RECEIVED_INVITATIONS,
      sent: MOCK_SENT_INVITATIONS,
    });
  }),

  // Accept an invitation
  http.post(`${BASE}/invitations/:id/accept`, ({ params }) => {
    const id = Number(params.id);
    const invitation = MOCK_RECEIVED_INVITATIONS.find((inv) => inv.id === id);

    if (!invitation) {
      return new HttpResponse(null, { status: 404 });
    }

    // In a real app, this would also create a room. For mock, we just return success.
    return HttpResponse.json({ message: 'Invitation accepted', roomId: 101 }, { status: 200 });
  }),

  // Decline an invitation
  http.post(`${BASE}/invitations/:id/decline`, ({ params }) => {
    const id = Number(params.id);
    const invitation = MOCK_RECEIVED_INVITATIONS.find((inv) => inv.id === id);

    if (!invitation) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ message: 'Invitation declined' }, { status: 200 });
  }),

  // Cancel a sent invitation
  http.delete(`${BASE}/invitations/:id`, ({ params }) => {
    const id = Number(params.id);
    const invitation = MOCK_SENT_INVITATIONS.find((inv) => inv.id === id);

    if (!invitation) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({ message: 'Invitation cancelled' }, { status: 200 });
  }),

  // Send a new invitation
  http.post(`${BASE}/invitations`, async ({ request }) => {
    const body = (await request.json()) as { receiverId: number };
    const newInvitation = {
      id: Date.now(),
      sender_id: 1,
      receiver_id: body.receiverId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return HttpResponse.json(newInvitation, { status: 201 });
  }),
];
