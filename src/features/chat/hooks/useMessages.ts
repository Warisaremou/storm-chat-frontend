import { useEffect, useCallback } from 'react';
import { useChatStore } from '@/stores/chat.store';
import { messagesService } from '@/services/messages.service';
import { toast } from 'sonner';

export function useMessages(roomId: number | null) {
  const { messages, setMessages, addMessage, isLoadingMessages } = useChatStore();
  const roomMessages = roomId ? messages[roomId] || [] : [];

  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    try {
      useChatStore.setState({ isLoadingMessages: true });
      const data = await messagesService.getMessages(roomId);
      setMessages(roomId, data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      useChatStore.setState({ isLoadingMessages: false });
    }
  }, [roomId, setMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!roomId) return;
      try {
        const newMessage = await messagesService.sendMessage(roomId, content);
        addMessage(roomId, newMessage);
      } catch {
        toast.error('Failed to send message');
      }
    },
    [roomId, addMessage],
  );

  useEffect(() => {
    if (roomId && !messages[roomId]) {
      void fetchMessages();
    }
  }, [roomId, messages, fetchMessages]);

  return {
    messages: roomMessages,
    isLoadingMessages,
    sendMessage,
    refetch: fetchMessages,
  };
}
