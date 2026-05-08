import { apiClient } from '@/lib/axios';
import type { Room, RoomMember } from '@/types';

export interface CreateRoomPayload {
  name: string;
  description?: string;
}

export interface UpdateRoomPayload {
  name?: string;
  description?: string;
}

export const roomsService = {
  getRooms: async (): Promise<Room[]> => {
    const { data } = await apiClient.get<Room[]>('/rooms');
    return data;
  },

  getGroupRooms: async (): Promise<Room[]> => {
    const { data } = await apiClient.get<Room[]>('/rooms/groups');
    return data;
  },

  getRoom: async (id: string): Promise<Room> => {
    const { data } = await apiClient.get<Room>(`/rooms/${id}`);
    return data;
  },

  createRoom: async (payload: CreateRoomPayload): Promise<Room> => {
    const { data } = await apiClient.post<Room>('/rooms', payload);
    return data;
  },

  updateRoom: async (id: string, payload: UpdateRoomPayload): Promise<Room> => {
    const { data } = await apiClient.patch<Room>(`/rooms/${id}`, payload);
    return data;
  },

  deleteRoom: async (id: string): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },

  addMember: async (roomId: string, userId: string): Promise<void> => {
    await apiClient.post(`/rooms/${roomId}/members`, { user_id: userId });
  },

  getMembers: async (roomId: string): Promise<RoomMember[]> => {
    const { data } = await apiClient.get<RoomMember[]>(`/rooms/${roomId}/members`);
    return data;
  },

  removeMember: async (roomId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/rooms/${roomId}/members/${userId}`);
  },

  leaveRoom: async (roomId: string): Promise<void> => {
    await apiClient.post(`/rooms/${roomId}/leave`);
  },
};
