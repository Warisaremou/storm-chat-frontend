import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/chat.store';
import { useSendMessage } from '../hooks/useMessages';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const spring = { type: 'spring' as const, stiffness: 400, damping: 30 };

export function MessageInput() {
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const sendMessage = useSendMessage(activeConversationId);
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
    <div className="shrink-0 border-t border-border bg-background/80 px-6 py-5 backdrop-blur-sm">
      <div className="relative mx-auto flex max-w-4xl items-end gap-3">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            placeholder="Type a message…"
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="min-h-[48px] max-h-32 resize-none border-input bg-muted/50 py-3.5 pr-14 text-[15px] leading-relaxed shadow-none focus-visible:ring-ring/30 scrollbar-none"
            rows={1}
          />
          <div className="absolute bottom-2 right-2">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={spring}>
              <Button
                size="icon"
                className={cn(
                  'h-9 w-9 rounded-xl shadow-sm',
                  content.trim()
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground',
                )}
                onClick={() => void handleSend()}
                disabled={!content.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
