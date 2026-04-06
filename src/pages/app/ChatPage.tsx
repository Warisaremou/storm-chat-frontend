import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomInfoPanel } from '@/features/chat/components/RoomInfoPanel';
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
  const setRoomInfoOpen = useUIStore((s) => s.setRoomInfoOpen);

  useEffect(() => {
    if (conversationId) {
      if (conversationId !== activeConversationId) {
        setActiveConversation(conversationId);
      }
    } else if (activeConversationId !== null) {
      setActiveConversation(null);
    }
  }, [conversationId, activeConversationId, setActiveConversation]);

  useEffect(() => {
    if (!activeConversationId) setRoomInfoOpen(false);
  }, [activeConversationId, setRoomInfoOpen]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {activeConversationId ? (
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <ConversationHeader />
            <MessageList />
            <MessageInput />
          </div>
          <RoomInfoPanel />
        </div>
      ) : (
        <div className="flex h-full flex-1 flex-col items-center justify-center bg-transparent">
          <EmptyState
            icon={MessageSquarePlus}
            title="No conversation selected"
            description="Pick a chat from the list or start a new one."
            actionLabel="Start a new chat"
            onAction={() => openModal('userSearch')}
          />
        </div>
      )}
    </div>
  );
}
