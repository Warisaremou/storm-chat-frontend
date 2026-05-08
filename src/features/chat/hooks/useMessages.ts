import { useEffect, useCallback, useMemo } from 'react';
import { useChatStore } from '@/stores/chat.store';
import type { Message } from '@/types';
import { messagesService } from '@/services/messages.service';
import { useRoomWebSocket } from './useRoomWebSocket';
import { toast } from 'sonner';

/** Send path only — use from inputs so MessageList can own fetch + WebSocket without duplicating them. */
export function useSendMessage(roomId: string | null) {
  const addMessage = useChatStore((s) => s.addMessage);

  return useCallback(
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
}

function sortMessagesChronological(list: Message[]) {
  if (list.length <= 1) return list;
  return [...list].sort((a, b) => {
    const ta = new Date(a.created_at).getTime();
    const tb = new Date(b.created_at).getTime();
    if (ta !== tb) return ta - tb;
    return a.id.localeCompare(b.id);
  });
}

export function useMessages(roomId: string | null) {
  const { messages, setMessages, isLoadingMessages } = useChatStore();
  const roomSlice = roomId ? messages[roomId] : undefined;
  const roomMessages = useMemo(() => sortMessagesChronological(roomSlice ?? []), [roomSlice]);

  useRoomWebSocket(roomId);

  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    try {
      useChatStore.setState({ isLoadingMessages: true });
      const page = await messagesService.getMessages(roomId);
      const list = Array.isArray(page) ? page : page?.data;
      setMessages(roomId, Array.isArray(list) ? list : []);
    } catch {
      toast.error('Failed to load messages');
      setMessages(roomId, []);
    } finally {
      useChatStore.setState({ isLoadingMessages: false });
    }
  }, [roomId, setMessages]);

  const sendMessage = useSendMessage(roomId);

  // Load when the active room changes only. Depending on the whole `messages` map re-ran this
  // effect on every WebSocket message (new object reference) and could refetch forever if the
  // slice was never set to an array (e.g. unexpected API shape).
  useEffect(() => {
    if (!roomId) return;
    void fetchMessages();
  }, [roomId, fetchMessages]);

  return {
    messages: roomMessages,
    isLoadingMessages,
    sendMessage,
    refetch: fetchMessages,
  };
}
