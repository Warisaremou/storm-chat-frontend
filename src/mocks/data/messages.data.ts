import type { Message } from '@/types';

export const MOCK_MESSAGES: Record<number, Message[]> = {
  101: [
    {
      id: 'msg-101-1',
      room_id: 101,
      sender_id: 2,
      content: 'Hey! Are you joining the team sync today?',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T14:20:00Z',
    },
    {
      id: 'msg-101-2',
      room_id: 101,
      sender_id: 1,
      content: "Yes, I'll be there in 10 minutes.",
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T14:25:00Z',
    },
    {
      id: 'msg-101-3',
      room_id: 101,
      sender_id: 2,
      content: 'Sure, see you in the standup!',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T14:32:00Z',
    },
  ],
};
