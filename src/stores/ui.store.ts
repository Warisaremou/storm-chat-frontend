import { create } from 'zustand';
import type { Theme } from '@/types';

export interface UIStoreState {
  theme: Theme;
  sidebarOpen: boolean;
  activeModal: 'userProfile' | 'userSearch' | null;
  modalPayload: unknown;
}

export interface UIStoreActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openModal: (modal: UIStoreState['activeModal'], payload?: unknown) => void;
  closeModal: () => void;
}

export type UIStore = UIStoreState & UIStoreActions;

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  activeModal: null,
  modalPayload: null,

  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (modal, payload) => set({ activeModal: modal, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),
}));
