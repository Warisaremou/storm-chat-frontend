import type { UserStatus } from './enums';
import type { AuthUser, UserProfile } from './user.types';

export interface RegisterStep1Payload {
  email: string;
  username: string;
  password: string;
}

export interface RegisterStep2Payload {
  display_name: string;
  avatar?: File | null;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  profile: UserProfile;
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
  status?: UserStatus;
  avatar?: File;
}
