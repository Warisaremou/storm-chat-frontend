import { create } from 'zustand';
import type { Theme } from '@/types';

export interface UIStoreState {
  theme: Theme;
  /** Right sidebar: room / group details and member list */
  roomInfoOpen: boolean;
  activeModal: 'userProfile' | 'userSearch' | null;
  modalPayload: unknown;
}

export interface UIStoreActions {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setRoomInfoOpen: (open: boolean) => void;
  toggleRoomInfo: () => void;
  openModal: (modal: UIStoreState['activeModal'], payload?: unknown) => void;
  closeModal: () => void;
}

export type UIStore = UIStoreState & UIStoreActions;

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  roomInfoOpen: false,
  activeModal: null,
  modalPayload: null,

  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setRoomInfoOpen: (roomInfoOpen) => set({ roomInfoOpen }),
  toggleRoomInfo: () => set((state) => ({ roomInfoOpen: !state.roomInfoOpen })),
  openModal: (modal, payload) => set({ activeModal: modal, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),
}));
