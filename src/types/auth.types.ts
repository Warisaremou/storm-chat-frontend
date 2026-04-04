import type { UserStatus } from './enums';
import type { AuthUser, UserProfile } from './user.types';

export interface RegisterStep1Payload {
  email: string;
  username: string;
  password: string;
}

export interface RegisterStep2Payload {
  display_name: string;
  avatar_url?: string;
}

export interface LoginPayload {
  identity: string;     
  password: string;
}

export interface LoginResponse {
  message: string;
}

// Réponse de GET /users/me
export interface MeResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  profile: UserProfile;
}

// Réponse de POST /auth/register
export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface UpdateProfilePayload {
  display_name?: string;
  avatar_url?: string;
  status?: UserStatus;
}

export type { AuthUser, UserProfile };