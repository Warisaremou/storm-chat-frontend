import { InvitationCard } from './InvitationCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Send } from 'lucide-react';
import { useInvitations } from '../hooks/useInvitations';

export function SentInvitations() {
  const { invitations, isLoading, cancelInvitation } = useInvitations();

  if (invitations.sent.length === 0) {
    return (
      <EmptyState
        icon={Send}
        title="No invitations sent"
        description="Search for users and invite them to start a conversation."
        className="py-20"
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      {invitations.sent.map((inv) => (
        <InvitationCard
          key={inv.id}
          type="sent"
          invitation={inv}
          onCancel={(id) => void cancelInvitation(id)}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
