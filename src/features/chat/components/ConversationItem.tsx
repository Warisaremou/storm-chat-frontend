import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/stores/chat.store';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types';
import { PATHS } from '@/routes/paths';

interface ConversationItemProps {
  conversation: Conversation;
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const navigate = useNavigate();
  const { activeConversationId, setActiveConversation } = useChatStore();
  const isActive = activeConversationId === conversation.id;

  const handleSelect = () => {
    setActiveConversation(conversation.id);
    void navigate(PATHS.CHAT_CONVERSATION.replace(':conversationId', String(conversation.id)));
  };

  const lastMessage = conversation.lastMessage;
  const time = lastMessage
    ? formatDistanceToNow(new Date(lastMessage.created_at), { addSuffix: false })
    : '';

  return (
    <button
      onClick={handleSelect}
      className={cn(
        'w-full flex items-center gap-3 p-3 transition-colors border-l-2',
        isActive
          ? 'bg-accent border-primary'
          : 'bg-transparent border-transparent hover:bg-muted/50',
      )}
    >
      <UserAvatar
        profile={conversation.otherParticipant}
        size="md"
        showStatus
        statusOverride={
          conversation.room.type === 'private' ? conversation.otherParticipant?.status : undefined
        }
      />

      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="font-semibold text-sm truncate text-foreground">
            {conversation.otherParticipant?.display_name || conversation.room.name}
          </span>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">{time}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground truncate flex-1">
            {lastMessage?.content || 'No messages yet'}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
