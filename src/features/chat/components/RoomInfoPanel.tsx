import { useChatStore } from '@/stores/chat.store';
import { useUIStore } from '@/stores/ui.store';
import { useRoomMembers } from '../hooks/useRoomMembers';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { X, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

function roomInitials(name: string) {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (w.length === 0) return '?';
  if (w.length === 1) return w[0].slice(0, 2).toUpperCase();
  return (w[0][0] + w[1][0]).toUpperCase();
}

export function RoomInfoPanel() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const conversation = useChatStore((s) =>
    s.conversations.find((c) => c.id === activeConversationId),
  );
  const roomInfoOpen = useUIStore((s) => s.roomInfoOpen);
  const setRoomInfoOpen = useUIStore((s) => s.setRoomInfoOpen);

  const roomId = conversation?.room.id ?? null;
  const { members, profiles, isLoading } = useRoomMembers(roomId, roomInfoOpen && !!roomId);

  if (!roomInfoOpen || !conversation) return null;

  const { room } = conversation;
  const desc = room.description?.trim();

  return (
    <aside
      className={cn(
        'w-[300px] shrink-0 border-l border-border bg-card flex flex-col h-full min-h-0',
        'animate-in slide-in-from-right-2 duration-200',
      )}
      aria-label="Group info"
    >
      <div className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-border">
        <span className="font-semibold text-sm text-foreground">Group info</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => setRoomInfoOpen(false)}
          aria-label="Close group info"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-6">
          <div className="flex flex-col items-center text-center gap-2 pt-1">
            <div
              className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center text-2xl font-semibold text-primary ring-2 ring-border"
              aria-hidden
            >
              {roomInitials(room.name)}
            </div>
            <h2 className="text-lg font-semibold text-foreground leading-tight px-2">
              {room.name}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0" />
              Group · {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
          </div>

          {desc ? (
            <section>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{desc}</p>
            </section>
          ) : null}

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Members
              </h3>
              <span className="text-xs text-muted-foreground">{members.length}</span>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <ul className="space-y-1">
                {members.map((member) => {
                  const profile = profiles[member.user_id];
                  const label =
                    profile?.display_name ?? profile?.username ?? member.user_id.slice(0, 8);
                  const subtitle =
                    profile?.status && profile.status !== 'offline'
                      ? profile.status
                      : profile
                        ? `@${profile.username}`
                        : null;
                  return (
                    <li
                      key={member.id}
                      className="flex items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted/60 transition-colors"
                    >
                      <UserAvatar
                        profile={profile ?? null}
                        size="sm"
                        showStatus
                        className="mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground truncate">
                            {label}
                          </span>
                          {member.role === 'owner' ? (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 h-5 font-medium"
                            >
                              Owner
                            </Badge>
                          ) : null}
                        </div>
                        {subtitle ? (
                          <span className="text-xs text-muted-foreground capitalize">
                            {subtitle}
                          </span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
