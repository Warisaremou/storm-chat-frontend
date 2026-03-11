import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatLayout } from '@/components/layout/ChatLayout';
import { ConversationList } from '@/features/chat/components/ConversationList';
import { useChatStore } from '@/stores/chat.store';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageSquarePlus } from 'lucide-react';
import { ConversationHeader } from '@/features/chat/components/ConversationHeader';
import { MessageList } from '@/features/chat/components/MessageList';
import { MessageInput } from '@/features/chat/components/MessageInput';
import { useUIStore } from '@/stores/ui.store';

export default function ChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const setActiveConversation = useChatStore((s) => s.setActiveConversation);
  const openModal = useUIStore((s) => s.openModal);

  // Sync URL ID with Store
  useEffect(() => {
    if (conversationId) {
      const id = parseInt(conversationId, 10);
      if (!isNaN(id) && id !== activeConversationId) {
        setActiveConversation(id);
      }
    } else if (activeConversationId !== null) {
      // If no ID in URL but we have one in store, maybe we should clear it or ignore
      // Typically we follow the URL
      setActiveConversation(null);
    }
  }, [conversationId, activeConversationId, setActiveConversation]);

  return (
    <ChatLayout conversationPanel={<ConversationList />}>
      {activeConversationId ? (
        <div className="flex flex-col h-full overflow-hidden">
          <ConversationHeader />
          <MessageList />
          <MessageInput />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full bg-background">
          <EmptyState
            icon={MessageSquarePlus}
            title="No conversation selected"
            description="Choose a conversation from the list to start chatting or find new community members."
            actionLabel="Start a new chat"
            onAction={() => openModal('userSearch')}
          />
        </div>
      )}
    </ChatLayout>
  );
}
