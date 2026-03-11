import type { UserStatus } from './enums';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id: number;
  display_name: string | null;
  avatar_url: string | null;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile extends AuthUser {
  profile: UserProfile;
}

export interface UserPreview {
  id: number;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  status: UserStatus;
}
