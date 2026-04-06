import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';
import { useMessages } from '../hooks/useMessages';
import { MessageBubble, type MessageSenderAvatar } from './MessageBubble';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useEffect, useRef, useMemo } from 'react';
import type { UserPreview } from '@/types';

function avatarProfileForSender(
  message: { sender_id: string; sender?: UserPreview | null },
  userId: string | undefined,
  username: string | undefined,
  profile: {
    display_name: string;
    avatar_url: string;
    status: MessageSenderAvatar['status'];
  } | null,
  otherParticipant: UserPreview | null,
): MessageSenderAvatar {
  const senderId = message.sender_id;
  if (message.sender) {
    return {
      display_name: message.sender.display_name ?? null,
      username: message.sender.username ?? null,
      avatar_url: message.sender.avatar_url ?? null,
      status: message.sender.status,
    };
  }
  if (userId && senderId === userId) {
    if (profile) {
      return {
        display_name: profile.display_name,
        username: username ?? null,
        avatar_url: profile.avatar_url,
        status: profile.status,
      };
    }
    return {
      display_name: null,
      username: username ?? null,
      avatar_url: null,
      status: 'offline',
    };
  }
  if (otherParticipant && otherParticipant.id === senderId) {
    return {
      display_name: otherParticipant.display_name,
      username: otherParticipant.username,
      avatar_url: otherParticipant.avatar_url,
      status: otherParticipant.status,
    };
  }
  return { display_name: null, username: null, avatar_url: null, status: 'offline' };
}

export function MessageList() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const conversation = useChatStore((s) =>
    s.conversations.find((c) => c.id === activeConversationId),
  );
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const { messages, isLoadingMessages } = useMessages(activeConversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    return messages.map((message, i) => {
      const prev = messages[i - 1];
      const showAvatar = !prev || prev.sender_id !== message.sender_id;
      const senderAvatar = avatarProfileForSender(
        message,
        user?.id,
        user?.username,
        profile,
        conversation?.otherParticipant ?? null,
      );
      return { message, showAvatar, senderAvatar };
    });
  }, [messages, user?.id, user?.username, profile, conversation?.otherParticipant]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (isLoadingMessages && messages.length === 0) {
    return <LoadingSpinner size="lg" className="flex-1" />;
  }

  return (
    <div
      ref={scrollRef}
      className="flex flex-1 flex-col overflow-y-auto scroll-smooth bg-transparent px-6 py-6"
    >
      {messages.length > 0 ? (
        rows.map(({ message, showAvatar, senderAvatar }) => (
          <MessageBubble
            key={message.id}
            message={message}
            showAvatar={showAvatar}
            senderAvatar={senderAvatar}
          />
        ))
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm opacity-60 italic">
          No messages here yet. Say hello!
        </div>
      )}
    </div>
  );
}
