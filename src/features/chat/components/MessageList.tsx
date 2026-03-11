import { useChatStore } from '@/stores/chat.store';
import { useMessages } from '../hooks/useMessages';
import { MessageBubble } from './MessageBubble';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useEffect, useRef } from 'react';

export function MessageList() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const { messages, isLoadingMessages } = useMessages(activeConversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      className="flex-1 overflow-y-auto p-4 flex flex-col scroll-smooth bg-subtle/30"
    >
      {messages.length > 0 ? (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm opacity-60 italic">
          No messages here yet. Say hello!
        </div>
      )}
    </div>
  );
}
