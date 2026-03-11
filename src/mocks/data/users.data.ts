import type { AuthUser, UserProfile, UserPreview } from '@/types';

export const MOCK_CURRENT_USER: AuthUser = {
  id: 1,
  email: 'charlie@example.com',
  username: 'charlie_dev',
  created_at: '2025-01-10T10:00:00Z',
  updated_at: '2025-01-10T10:00:00Z',
};

export const MOCK_CURRENT_PROFILE: UserProfile = {
  user_id: 1,
  display_name: 'Charlie Dev',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
  status: 'online',
  created_at: '2025-01-10T10:00:00Z',
  updated_at: '2025-01-10T10:00:00Z',
};

export const MOCK_USERS: UserPreview[] = [
  {
    id: 2,
    username: 'alex_storm',
    display_name: 'Alex Storm',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    status: 'online',
  },
  {
    id: 3,
    username: 'maya_ui',
    display_name: 'Maya Chen',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maya',
    status: 'away',
  },
  {
    id: 4,
    username: 'jordan_k',
    display_name: 'Jordan Kowalski',
    avatar_url: null,
    status: 'offline',
  },
  {
    id: 5,
    username: 'priya_dev',
    display_name: 'Priya Sharma',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    status: 'busy',
  },
  {
    id: 6,
    username: 'luca_design',
    display_name: 'Luca Romano',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luca',
    status: 'online',
  },
];
