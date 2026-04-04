import { apiClient } from '@/lib/axios';
import type { InvitationWithUsers } from '@/types';

export interface InvitationsResponse {
  received: InvitationWithUsers[];
  sent: InvitationWithUsers[];
}

export const invitationsService = {
  getInvitations: async () => {
    const response = await apiClient.get<InvitationsResponse>('/invitations');
    return response.data;
  },

  acceptInvitation: async (id: string) => {
    const response = await apiClient.post<{ roomId: string }>(`/invitations/${id}/accept`);
    return response.data;
  },

  declineInvitation: async (id: string) => {
    const response = await apiClient.post<void>(`/invitations/${id}/decline`);
    return response.data;
  },

  cancelInvitation: async (id: string) => {
    const response = await apiClient.delete<void>(`/invitations/${id}`);
    return response.data;
  },

  sendInvitation: async (receiverId: string) => {
    const response = await apiClient.post<void>('/invitations', { receiver_id: receiverId });
    return response.data;
  },
};