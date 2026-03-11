import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, UserProfile, LoginPayload } from '@/types';
import { authService } from '@/services/auth.service';

export interface AuthStoreState {
  user: AuthUser | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthStoreActions {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (user: AuthUser, profile: UserProfile) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (payload: LoginPayload) => {
        try {
          set({ isLoading: true, error: null });
          const response = await authService.login(payload);
          set({
            user: response.user,
            profile: response.profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to login';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await authService.logout();
          set({ user: null, profile: null, isAuthenticated: false, isLoading: false, error: null });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to logout';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      setAuth: (user, profile) => set({ user, profile, isAuthenticated: true, error: null }),

      clearAuth: () => set({ user: null, profile: null, isAuthenticated: false }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'storm-chat-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
