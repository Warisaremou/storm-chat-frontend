import { useConversations } from '../hooks/useConversations';
import { ConversationItem } from './ConversationItem';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageSquarePlus, MessageSquareText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/ui.store';
import { useState } from 'react';

export function ConversationList() {
  const { conversations, isLoadingConversations } = useConversations();
  const openModal = useUIStore((s) => s.openModal);
  const [search, setSearch] = useState('');

  const filteredConversations = conversations.filter((c) => {
    const name = c.otherParticipant?.display_name || c.room.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoadingConversations && conversations.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-2 px-1">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground">Messages</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground"
            aria-label="Start a new conversation"
            title="New conversation"
            onClick={() => openModal('userSearch')}
          >
            <MessageSquarePlus className="size-4" />
          </Button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between gap-2 px-1">
        <h2 className="text-xs font-medium tracking-wide text-muted-foreground">Messages</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Start a new conversation"
          title="New conversation"
          onClick={() => openModal('userSearch')}
        >
          <MessageSquarePlus className="size-4" />
        </Button>
      </div>

      <div className="mt-3 shrink-0 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="h-9 border-input bg-background/80 pl-8 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pb-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))
        ) : (
          <EmptyState
            icon={MessageSquareText}
            title={search ? 'No results' : 'No conversations'}
            description={search ? `Nothing matches “${search}”.` : 'Start a chat to see it here.'}
            className="py-8"
          />
        )}
      </div>
    </div>
  );
}
