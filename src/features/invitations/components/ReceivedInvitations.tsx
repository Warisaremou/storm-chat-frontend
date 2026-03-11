import { InvitationCard } from './InvitationCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Inbox } from 'lucide-react';
import { useInvitations } from '../hooks/useInvitations';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { useChatStore } from '@/stores/chat.store';

export function ReceivedInvitations() {
  const { invitations, isLoading, acceptInvitation, declineInvitation } = useInvitations();
  const navigate = useNavigate();
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);

  const handleAccept = async (id: number) => {
    const roomId = await acceptInvitation(id);
    if (roomId) {
      setActiveConversation(roomId);
      void navigate(PATHS.CHAT);
    }
  };

  if (invitations.received.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No invitations received"
        description="When someone invites you to chat, it will appear here."
        className="py-20"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {invitations.received.map((inv) => (
        <InvitationCard
          key={inv.id}
          type="received"
          invitation={inv}
          onAccept={(id) => void handleAccept(id)}
          onDecline={(id) => void declineInvitation(id)}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
