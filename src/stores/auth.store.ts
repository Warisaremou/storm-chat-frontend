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
  init: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
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

      init: async () => {
        set({ isLoading: true, error: null });
        try {
          const me = await authService.getMe();
          set({
            user: {
              id: me.id,
              username: me.username,
              email: me.email,
              role: me.role,
              created_at: me.created_at,
            },
            profile: me.profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      login: async (payload: LoginPayload) => {
        try {
          set({ isLoading: true, error: null });
          await authService.login(payload);
          const me = await authService.getMe();
          set({
            user: {
              id: me.id,
              username: me.username,
              email: me.email,
              role: me.role,
              created_at: me.created_at,
            },
            profile: me.profile,
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
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to logout';
          set({ error: message, isLoading: false });
          throw error;
        }
      },

      fetchMe: async () => {
        try {
          set({ isLoading: true });
          const me = await authService.getMe();
          set({
            user: {
              id: me.id,
              username: me.username,
              email: me.email,
              role: me.role,
              created_at: me.created_at,
            },
            profile: me.profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          });
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
      onRehydrateStorage: () => (persistedState) => {
        // n'exécute la validation côté serveur que si un état persisté existe
        if (!persistedState) return;
        void (async () => {
          try {
            // appel retardé : la variable `useAuthStore` est disponible au moment de l'exécution
            await useAuthStore.getState().init();
          } catch {
            // init gère l'erreur et remet l'état non-authenticated si nécessaire
          }
        })();
      },
    },
  ),
);