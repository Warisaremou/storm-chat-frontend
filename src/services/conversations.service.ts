import { apiClient } from '@/lib/axios';
import type { Conversation, Room } from '@/types';

function roomToConversation(room: Room): Conversation {
  return {
    id: room.id,
    room,
    // Room API does not embed the other member; message rows carry `sender` from message-service.
    otherParticipant: null,
    lastMessage: null,
    unreadCount: 0,
    updatedAt: room.updated_at,
  };
}

export const conversationsService = {
  getConversations: async (): Promise<Conversation[]> => {
    const { data } = await apiClient.get<Room[]>('/rooms');
    return data.map(roomToConversation);
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const { data } = await apiClient.get<Room>(`/rooms/${id}`);
    return roomToConversation(data);
  },
};
