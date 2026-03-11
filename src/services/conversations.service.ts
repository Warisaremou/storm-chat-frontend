import { apiClient } from '@/lib/axios';
import type { Conversation } from '@/types';

export const conversationsService = {
  getConversations: async () => {
    const response = await apiClient.get<Conversation[]>('/rooms');
    return response.data;
  },

  getConversation: async (id: number) => {
    const response = await apiClient.get<Conversation>(`/rooms/${id}`);
    return response.data;
  },
};
