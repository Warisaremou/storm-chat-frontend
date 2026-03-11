import { useState, useCallback, useEffect } from 'react';
import { invitationsService, type InvitationsResponse } from '@/services/invitations.service';
import { toast } from 'sonner';

export function useInvitations() {
  const [invitations, setInvitations] = useState<InvitationsResponse>({ received: [], sent: [] });
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvitations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await invitationsService.getInvitations();
      setInvitations(data);
    } catch {
      toast.error('Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptInvitation = async (id: number) => {
    try {
      const { roomId } = await invitationsService.acceptInvitation(id);
      toast.success('Invitation accepted');
      void fetchInvitations();
      return roomId;
    } catch {
      toast.error('Failed to accept invitation');
    }
  };

  const declineInvitation = async (id: number) => {
    try {
      await invitationsService.declineInvitation(id);
      toast.success('Invitation declined');
      void fetchInvitations();
    } catch {
      toast.error('Failed to decline invitation');
    }
  };

  const cancelInvitation = async (id: number) => {
    try {
      await invitationsService.cancelInvitation(id);
      toast.success('Invitation cancelled');
      void fetchInvitations();
    } catch {
      toast.error('Failed to cancel invitation');
    }
  };

  useEffect(() => {
    void fetchInvitations();
  }, [fetchInvitations]);

  return {
    invitations,
    isLoading,
    refetch: fetchInvitations,
    acceptInvitation,
    declineInvitation,
    cancelInvitation,
  };
}
