import { useUserSearch } from '../hooks/useUserSearch';
import { useInvitations } from '@/features/invitations/hooks/useInvitations';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Check } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useState } from 'react';
import { toast } from 'sonner';
import { invitationsService } from '@/services/invitations.service';

export function UserSearch() {
  const { query, setQuery, results, isLoading } = useUserSearch();
  const { invitations } = useInvitations();
  const [sendingId, setSendingId] = useState<number | null>(null);

  const handleInvite = async (userId: number) => {
    try {
      setSendingId(userId);
      await invitationsService.sendInvitation(userId);
      toast.success('Invitation sent!');
    } catch {
      toast.error('Failed to send invitation');
    } finally {
      setSendingId(null);
    }
  };

  const isInvited = (userId: number) => {
    return (
      invitations.sent.some((inv) => inv.receiver_id === userId) ||
      invitations.received.some((inv) => inv.sender_id === userId)
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by username or display name..."
          className="pl-9 h-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : results.length > 0 ? (
          results.map((user) => {
            const alreadyInvited = isInvited(user.id);
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar profile={user} size="md" />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{user.display_name}</span>
                    <span className="text-xs text-muted-foreground">@{user.username}</span>
                  </div>
                </div>

                {alreadyInvited ? (
                  <Button variant="ghost" disabled className="h-8 gap-1.5 text-success">
                    <Check className="h-4 w-4" />
                    Connect
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => void handleInvite(user.id)}
                    disabled={sendingId === user.id}
                  >
                    {sendingId === user.id ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Invite
                  </Button>
                )}
              </div>
            );
          })
        ) : query ? (
          <div className="text-center py-8 text-muted-foreground text-sm italic">
            No users found matching &quot;{query}&quot;
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm italic">
            Type to search for people...
          </div>
        )}
      </div>
    </div>
  );
}
