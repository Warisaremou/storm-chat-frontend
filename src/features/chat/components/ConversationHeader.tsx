import { useChatStore } from '@/stores/chat.store';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Info, MoreVertical, Phone, Video } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';

export function ConversationHeader() {
  const { activeConversationId, conversations } = useChatStore();
  const openModal = useUIStore((s) => s.openModal);
  const conversation = conversations.find((c) => c.id === activeConversationId);

  if (!conversation) return null;

  const handleOpenProfile = () => {
    if (conversation.otherParticipant) {
      openModal('userProfile', conversation.otherParticipant);
    }
  };

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-border bg-card">
      <div
        role="button"
        tabIndex={0}
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1"
        onClick={handleOpenProfile}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenProfile();
          }
        }}
      >
        <UserAvatar
          profile={conversation.otherParticipant}
          size="md"
          showStatus
          statusOverride={
            conversation.room.type === 'private' ? conversation.otherParticipant?.status : undefined
          }
        />
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-foreground">
            {conversation.otherParticipant?.display_name || conversation.room.name}
          </span>
          <span className="text-xs text-muted-foreground">
            {conversation.room.type === 'private'
              ? conversation.otherParticipant?.status || 'offline'
              : 'Group Chat'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <Video className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground"
          onClick={handleOpenProfile}
        >
          <Info className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
