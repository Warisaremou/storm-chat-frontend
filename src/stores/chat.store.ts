import { create } from 'zustand';
import type { Conversation, Message } from '@/types';

export interface ChatStoreState {
  activeConversationId: number | null;
  conversations: Conversation[];
  messages: Record<number, Message[]>;
  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
}

export interface ChatStoreActions {
  setActiveConversation: (id: number | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  addMessage: (conversationId: number, message: Message) => void;
  setMessages: (conversationId: number, messages: Message[]) => void;
  markConversationRead: (conversationId: number) => void;
}

export type ChatStore = ChatStoreState & ChatStoreActions;

export const useChatStore = create<ChatStore>((set) => ({
  activeConversationId: null,
  conversations: [],
  messages: {},
  isLoadingConversations: false,
  isLoadingMessages: false,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  setConversations: (conversations) => set({ conversations }),

  addMessage: (conversationId, message) =>
    set((state) => {
      const existing = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existing, message],
        },
      };
    }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  markConversationRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    })),
}));
