import { apiClient } from '@/lib/axios';
import type { UserProfile, UserPreview } from '@/types';

export const usersService = {
  searchUsers: async (query: string) => {
    const response = await apiClient.get<{ data: UserPreview[] }>(
      `/users/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },

  getUser: async (id: number) => {
    const response = await apiClient.get<{ data: UserProfile }>(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await apiClient.patch<{ data: UserProfile }>(`/users/me/profile`, data);
    return response.data;
  },
};
