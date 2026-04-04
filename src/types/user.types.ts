import type { UserStatus } from './enums';

export interface AuthUser {
  id: string;           
  email: string;
  username: string;
  role: string;         
  created_at: string;
}

export interface UserProfile {
  user_id: string;      
  display_name: string;
  avatar_url: string;
  status: UserStatus;
  created_at: string;
  updated_at: string;
}

export interface UserWithProfile extends AuthUser {
  profile: UserProfile;
}

export interface UserPreview {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  status: UserStatus;
}