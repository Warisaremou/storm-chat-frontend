import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuthStore();
  const isOwn = message.sender_id === user?.id || message.sender_id === 1; // Assuming default mock user ID is 1

  const time = format(new Date(message.created_at), 'HH:mm');

  return (
    <div className={cn('flex w-full mb-4', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[70%] px-4 py-2 rounded-2xl shadow-sm relative group',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-tr-none'
            : 'bg-muted text-foreground rounded-tl-none',
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
          {message.content}
        </p>

        <div
          className={cn(
            'flex items-center gap-1 mt-1 justify-end',
            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground',
          )}
        >
          <span className="text-[10px]">{time}</span>
          {isOwn && (
            <span className="shrink-0">
              {message.delivery_status === 'read' ? (
                <CheckCheck className="h-3 w-3" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
