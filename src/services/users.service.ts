import { apiClient } from '@/lib/axios';
import type { UserProfile, UserPreview, AuthUser } from '@/types';

function mapServerProfileToPreview(payload: any): UserPreview {
  const id = payload.id ?? payload.user_id ?? ''; 
  const profile = payload.profile ?? payload.Profile ?? {};
  return {
    id: String(id),
    username: payload.username ?? '',
    display_name: profile.display_name ?? profile.DisplayName ?? null,
    avatar_url: profile.avatar_url ?? profile.AvatarURL ?? null,
    status: (profile.status ?? 'offline') as any,
  };
}

function mapMeResponse(payload: any): { user: AuthUser; profile: UserProfile | null } {
  const user = {
    id: String(payload.id),
    email: payload.email,
    username: payload.username,
    created_at: payload.created_at || payload.CreatedAt,
    updated_at: payload.updated_at || payload.UpdatedAt,
  } as AuthUser;
  const profile = payload.profile ?? null;
  return { user, profile };
}

export const usersService = {
  searchUsers: async (query: string) => {
    try {
      const resp = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
      const payload = resp.data?.data ?? resp.data ?? [];
      const previews = Array.isArray(payload) ? payload.map(mapServerProfileToPreview) : [];
      return { data: previews };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes('not found')) {
        return { data: [] };
      }
      throw err;
    }
  },

  getUser: async (id: string) => {
    const response = await apiClient.get<{ data: UserProfile }>(`/users/${id}`);
    return response.data;
  },

  getCurrentUser: async () => {
    const resp = await apiClient.get('/me');
    return mapMeResponse(resp.data?.data ?? resp.data ?? resp.data?.user ?? resp.data);
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const resp = await apiClient.patch('/me/profile', data);
    return resp.data;
  },
};
