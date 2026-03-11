import { apiClient } from '@/lib/axios';
import type { Message } from '@/types';

export const messagesService = {
  getMessages: async (roomId: number) => {
    const response = await apiClient.get<Message[]>(`/rooms/${roomId}/messages`);
    return response.data;
  },

  sendMessage: async (roomId: number, content: string) => {
    const response = await apiClient.post<Message>(`/rooms/${roomId}/messages`, { content });
    return response.data;
  },
};
