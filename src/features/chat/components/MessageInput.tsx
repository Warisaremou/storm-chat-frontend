import { useState, useRef } from 'react';
import { useChatStore } from '@/stores/chat.store';
import { useMessages } from '../hooks/useMessages';
import { Send, Image, Smile, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function MessageInput() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const { sendMessage } = useMessages(activeConversationId);
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!content.trim()) return;
    const currentContent = content.trim();
    setContent('');
    await sendMessage(currentContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className="p-4 bg-card border-t border-border shrink-0">
      <div className="flex items-end gap-2 max-w-4xl mx-auto relative">
        <div className="flex items-center gap-1 pb-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Plus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Image className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Smile className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message..."
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="min-h-[44px] max-h-32 pr-12 py-3 bg-muted/50 border-transparent focus-visible:ring-primary/20 resize-none scrollbar-none"
            rows={1}
          />
          <div className="absolute right-1.5 bottom-1.5">
            <Button
              size="icon"
              className={cn(
                'h-8 w-8 rounded-full transition-all duration-200',
                content.trim()
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
              onClick={() => void handleSend()}
              disabled={!content.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
