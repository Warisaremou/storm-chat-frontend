import { useUserSearch } from '../hooks/useUserSearch';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MessageSquarePlus } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useState } from 'react';
import { toast } from 'sonner';
import { roomsService } from '@/services/rooms.service';
import { useChatStore } from '@/stores/chat.store';
import { useUIStore } from '@/stores/ui.store';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import type { UserPreview } from '@/types';

export function UserSearch() {
  const { query, setQuery, results, isLoading } = useUserSearch();
  const [startingId, setStartingId] = useState<string | null>(null);
  const { addConversation, setActiveConversation } = useChatStore();
  const closeModal = useUIStore((s) => s.closeModal);
  const navigate = useNavigate();

  const handleStartConversation = async (user: UserPreview) => {
    try {
      setStartingId(user.id);
      const roomName = user.display_name || user.username || 'New conversation';
      const room = await roomsService.createRoom({ name: roomName });
      await roomsService.addMember(room.id, user.id);
      const conversation = {
        id: room.id,
        room,
        otherParticipant: user,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: room.updated_at,
      };
      addConversation(conversation);
      setActiveConversation(room.id);
      closeModal();
      void navigate(PATHS.CHAT_CONVERSATION.replace(':conversationId', room.id));
    } catch {
      toast.error('Failed to start conversation');
    } finally {
      setStartingId(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      );
    }

    if (results.length > 0) {
      return results.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <UserAvatar profile={user} size="md" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{user.display_name}</span>
              <span className="text-xs text-muted-foreground">@{user.username}</span>
            </div>
          </div>

          <Button
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => void handleStartConversation(user)}
            disabled={startingId === user.id}
          >
            {startingId === user.id ? (
              <LoadingSpinner size="sm" />
            ) : (
              <MessageSquarePlus className="h-4 w-4" />
            )}
            Start conversation
          </Button>
        </div>
      ));
    }

    if (query) {
      return (
        <div className="text-center py-8 text-muted-foreground text-sm italic">
          No users found matching &quot;{query}&quot;
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-muted-foreground text-sm italic">
        Start typing to search for users...
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by username or display name..."
          className="pl-9 h-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="max-h-75 overflow-y-auto space-y-2 pr-1">{renderContent()}</div>
    </div>
  );
}
