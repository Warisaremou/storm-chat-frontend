import { useConversations } from '../hooks/useConversations';
import { ConversationItem } from './ConversationItem';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageSquareText, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export function ConversationList() {
  const { conversations, isLoadingConversations } = useConversations();
  const [search, setSearch] = useState('');

  const filteredConversations = conversations.filter((c) => {
    const name = c.otherParticipant?.display_name || c.room.name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoadingConversations && conversations.length === 0) {
    return <LoadingSpinner size="md" className="my-8" />;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-8 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem key={conversation.id} conversation={conversation} />
          ))
        ) : (
          <EmptyState
            icon={MessageSquareText}
            title={search ? 'No results found' : 'No conversations'}
            description={
              search
                ? `No chat found matching "${search}"`
                : 'Start a chat with someone to see it here.'
            }
            className="py-12"
          />
        )}
      </div>
    </div>
  );
}
