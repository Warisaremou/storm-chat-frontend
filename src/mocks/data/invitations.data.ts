import type { InvitationWithUsers } from '@/types';
import { MOCK_USERS } from './users.data';

export const MOCK_RECEIVED_INVITATIONS: InvitationWithUsers[] = [
  {
    id: 1,
    sender_id: 6,
    receiver_id: 1,
    status: 'pending',
    created_at: '2025-06-09T10:00:00Z',
    updated_at: '2025-06-09T10:00:00Z',
    sender: MOCK_USERS[4],
    receiver: {
      id: 1,
      username: 'charlie_dev',
      display_name: 'Charlie Dev',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      status: 'online',
    },
  },
];

export const MOCK_SENT_INVITATIONS: InvitationWithUsers[] = [
  {
    id: 2,
    sender_id: 1,
    receiver_id: 4,
    status: 'pending',
    created_at: '2025-06-08T15:30:00Z',
    updated_at: '2025-06-08T15:30:00Z',
    sender: {
      id: 1,
      username: 'charlie_dev',
      display_name: 'Charlie Dev',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      status: 'online',
    },
    receiver: MOCK_USERS[2],
  },
];
