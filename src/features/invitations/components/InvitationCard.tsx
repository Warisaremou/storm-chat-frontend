import { formatDistanceToNow } from 'date-fns';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Clock } from 'lucide-react';
import type { InvitationWithUsers } from '@/types';

interface InvitationCardProps {
  invitation: InvitationWithUsers;
  type: 'received' | 'sent';
  onAccept?: (id: number) => void;
  onDecline?: (id: number) => void;
  onCancel?: (id: number) => void;
  isLoading?: boolean;
}

export function InvitationCard({
  invitation,
  type,
  onAccept,
  onDecline,
  onCancel,
  isLoading,
}: InvitationCardProps) {
  const otherUser = type === 'received' ? invitation.sender : invitation.receiver;
  const time = formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true });

  return (
    <Card className="overflow-hidden bg-card border-border hover:border-primary/50 transition-colors">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar profile={otherUser} size="lg" />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-foreground truncate">
              {otherUser.display_name}
            </span>
            <span className="text-xs text-muted-foreground truncate italic">
              @{otherUser.username}
            </span>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground opacity-70">
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {type === 'received' ? (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-8 group hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                disabled={isLoading}
                onClick={() => onDecline?.(invitation.id)}
              >
                <X className="w-4 h-4 mr-1 transition-transform group-hover:rotate-90" />
                Decline
              </Button>
              <Button
                size="sm"
                className="h-8"
                disabled={isLoading}
                onClick={() => onAccept?.(invitation.id)}
              >
                <Check className="w-4 h-4 mr-1" />
                Accept
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              disabled={isLoading}
              onClick={() => onCancel?.(invitation.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
