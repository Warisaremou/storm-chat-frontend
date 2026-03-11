import { useEffect, useCallback } from 'react';
import { useChatStore } from '@/stores/chat.store';
import { conversationsService } from '@/services/conversations.service';
import { toast } from 'sonner';

export function useConversations() {
  const { conversations, setConversations, isLoadingConversations } = useChatStore();

  const fetchConversations = useCallback(async () => {
    try {
      useChatStore.setState({ isLoadingConversations: true });
      const data = await conversationsService.getConversations();
      setConversations(data);
    } catch {
      toast.error('Failed to load conversations');
    } finally {
      useChatStore.setState({ isLoadingConversations: false });
    }
  }, [setConversations]);

  useEffect(() => {
    if (conversations.length === 0) {
      void fetchConversations();
    }
  }, [conversations.length, fetchConversations]);

  return {
    conversations,
    isLoadingConversations,
    refetch: fetchConversations,
  };
}
