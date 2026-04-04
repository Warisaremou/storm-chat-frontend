import { apiClient } from '@/lib/axios';
import type { UserProfile, UserPreview, AuthUser, UserStatus } from '@/types';

interface ServerProfile {
  display_name?: string;
  DisplayName?: string;
  avatar_url?: string;
  AvatarURL?: string;
  status?: string;
}

interface ServerProfilePayload {
  id?: string;
  user_id?: string;
  username?: string;
  profile?: ServerProfile;
  Profile?: ServerProfile;
}

interface ServerMePayload {
  id?: string;
  email?: string;
  username?: string;
  role?: string;
  created_at?: string;
  CreatedAt?: string;
  profile?: UserProfile;
  data?: ServerMePayload;
  user?: ServerMePayload;
}

function mapServerProfileToPreview(payload: ServerProfilePayload): UserPreview {
  const id = payload.id ?? payload.user_id ?? '';
  const profile = payload.profile ?? payload.Profile ?? {};
  return {
    id: String(id),
    username: payload.username ?? '',
    display_name: profile.display_name ?? profile.DisplayName ?? null,
    avatar_url: profile.avatar_url ?? profile.AvatarURL ?? null,
    status: (profile.status ?? 'offline') as UserStatus,
  };
}

function mapMeResponse(payload: ServerMePayload): { user: AuthUser; profile: UserProfile | null } {
  const user: AuthUser = {
    id: String(payload.id ?? ''),
    email: payload.email ?? '',
    username: payload.username ?? '',
    role: payload.role ?? 'user',
    created_at: payload.created_at ?? payload.CreatedAt ?? '',
  };
  return { user, profile: payload.profile ?? null };
}

export const usersService = {
  searchUsers: async (query: string) => {
    try {
      const resp = await apiClient.get<{ data?: ServerProfilePayload[] } | ServerProfilePayload[]>(
        `/search?q=${encodeURIComponent(query)}`,
      );
      const payload = (resp.data as { data?: ServerProfilePayload[] }).data ?? resp.data ?? [];
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
    const resp = await apiClient.get<ServerMePayload>('/users/me');
    const payload = resp.data.data ?? resp.data.user ?? resp.data;
    return mapMeResponse(payload);
  },

  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const resp = await apiClient.patch<UserProfile>('/users/me/profile', data);
    return resp.data;
  },
};