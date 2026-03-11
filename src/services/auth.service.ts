import { apiClient } from '@/lib/axios';
import type {
  LoginPayload,
  LoginResponse,
  RegisterStep1Payload,
  RegisterStep2Payload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ApiResponse,
  AuthUser,
  UserProfile,
} from '@/types';

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', payload);
    return data.data;
  },

  register: async (payload: RegisterStep1Payload) => {
    const { data } = await apiClient.post<ApiResponse<{ user: AuthUser }>>(
      '/auth/register',
      payload,
    );
    return data.data;
  },

  setupProfile: async (payload: RegisterStep2Payload) => {
    const formData = new FormData();
    formData.append('display_name', payload.display_name);
    if (payload.avatar) {
      formData.append('avatar', payload.avatar as Blob);
    }

    const { data } = await apiClient.post<ApiResponse<{ profile: UserProfile }>>(
      '/auth/setup',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return data.data;
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<void>>('/auth/forgot-password', payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    const { data } = await apiClient.post<ApiResponse<void>>('/auth/reset-password', payload);
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return data;
  },

  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<LoginResponse>>('/auth/me');
    return data.data;
  },
};
