import type { Conversation } from '@/types';
import { MOCK_USERS } from './users.data';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 101,
    room: {
      id: 101,
      name: 'alex_storm-charlie_dev',
      slug: 'alex_storm-charlie_dev',
      description: null,
      type: 'private',
      avatar_url: null,
      creator_id: 1,
      created_at: '2025-01-15T08:00:00Z',
      updated_at: '2025-06-10T14:32:00Z',
    },
    otherParticipant: MOCK_USERS[0],
    lastMessage: {
      id: 'uuid-last-1',
      room_id: 101,
      sender_id: 2,
      content: 'Sure, see you in the standup!',
      delivery_status: 'read',
      is_read: true,
      created_at: '2025-06-10T14:32:00Z',
    },
    unreadCount: 0,
    updatedAt: '2025-06-10T14:32:00Z',
  },
  {
    id: 102,
    room: {
      id: 102,
      name: 'maya_ui-charlie_dev',
      slug: 'maya_ui-charlie_dev',
      description: null,
      type: 'private',
      avatar_url: null,
      creator_id: 3,
      created_at: '2025-02-01T11:00:00Z',
      updated_at: '2025-06-10T09:18:00Z',
    },
    otherParticipant: MOCK_USERS[1],
    lastMessage: {
      id: 'uuid-last-2',
      room_id: 102,
      sender_id: 3,
      content: 'I pushed the new component designs, can you review?',
      delivery_status: 'delivered',
      is_read: false,
      created_at: '2025-06-10T09:18:00Z',
    },
    unreadCount: 3,
    updatedAt: '2025-06-10T09:18:00Z',
  },
];
