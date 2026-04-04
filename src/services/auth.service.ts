import { apiClient } from '@/lib/axios';
import type {
  LoginPayload,
  LoginResponse,
  RegisterStep1Payload,
  RegisterStep2Payload,
  RegisterResponse,
  MeResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types';
import type { UserProfile } from '@/types/user.types';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  register: async (payload: RegisterStep1Payload): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refresh: async (): Promise<void> => {
    await apiClient.post('/auth/refresh');
  },

  getMe: async (): Promise<MeResponse> => {
    const { data } = await apiClient.get<MeResponse>('/users/me');
    return data;
  },

  setupProfile: async (payload: RegisterStep2Payload): Promise<UserProfile> => {
    const { data } = await apiClient.patch<UserProfile>('/users/me/profile', payload);
    return data;
  },

  forgotPassword: (_payload: ForgotPasswordPayload): Promise<void> => {
    return Promise.reject(new Error('Forgot password is not implemented yet'));
  },

  resetPassword: (_payload: ResetPasswordPayload): Promise<void> => {
    return Promise.reject(new Error('Reset password is not implemented yet'));
  },
};