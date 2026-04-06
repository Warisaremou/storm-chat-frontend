import { apiClient } from '@/lib/axios';
import type { Message, MessagesPage } from '@/types';

export const messagesService = {
  getMessages: async (roomId: string, before?: string): Promise<MessagesPage> => {
    const params = new URLSearchParams({ limit: '50' });
    if (before) params.set('before', before);
    const { data } = await apiClient.get<MessagesPage>(
      `/messages/rooms/${roomId}/messages?${params.toString()}`,
    );
    return data;
  },

  sendMessage: async (roomId: string, content: string): Promise<Message> => {
    const { data } = await apiClient.post<Message>(`/messages/rooms/${roomId}/messages`, {
      content,
    });
    return data;
  },
};
