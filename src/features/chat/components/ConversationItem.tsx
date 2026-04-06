import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/chat.store';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types';
import { PATHS } from '@/routes/paths';

const spring = { type: 'spring' as const, stiffness: 400, damping: 30 };

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
    <motion.button
      type="button"
      onClick={handleSelect}
      className={cn(
        'relative flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left outline-none transition-colors',
        !isActive && 'hover:bg-accent',
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={spring}
    >
      {isActive ? (
        <motion.span
          layoutId="conversation-active"
          className="absolute inset-0 rounded-lg bg-muted"
          transition={spring}
        />
      ) : null}
      <span className="relative z-10 flex min-w-0 flex-1 items-center gap-2">
        <UserAvatar profile={conversation.otherParticipant} size="sm" showStatus />

        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-1">
            <span className="truncate text-sm font-medium text-foreground">
              {conversation.otherParticipant?.display_name || conversation.room.name}
            </span>
            {time ? (
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
                {time}
              </span>
            ) : null}
          </span>

          <span className="mt-0.5 flex items-center justify-between gap-1.5">
            <span className="truncate text-xs text-muted-foreground">
              {lastMessage?.content || 'No messages yet'}
            </span>
            {conversation.unreadCount > 0 ? (
              <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-semibold text-primary-foreground">
                {conversation.unreadCount}
              </span>
            ) : null}
          </span>
        </span>
      </span>
    </motion.button>
  );
}
