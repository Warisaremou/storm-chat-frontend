import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Message, UserStatus } from '@/types';
import { UserAvatar } from '@/components/shared/UserAvatar';

const spring = { type: 'spring' as const, stiffness: 400, damping: 30 };

export type MessageSenderAvatar = {
  display_name: string | null;
  username: string | null;
  avatar_url: string | null;
  status: UserStatus;
};

interface MessageBubbleProps {
  message: Message;
  senderAvatar: MessageSenderAvatar;
  /** First row in a run from the same sender — show avatar, name, and time (Discord-style). */
  showAvatar: boolean;
}

function senderLabel(sender: MessageSenderAvatar): string {
  const name = sender.display_name?.trim();
  if (name) return name;
  if (sender.username?.trim()) return sender.username.trim();
  return 'Unknown';
}

/** Discord-style channel row: all messages left-aligned; avatar column; grouped lines share one header. */
export function MessageBubble({ message, senderAvatar, showAvatar }: MessageBubbleProps) {
  const time = format(new Date(message.created_at), 'HH:mm');
  const label = senderLabel(senderAvatar);

  return (
    <motion.div
      className={cn(
        'group -mx-2 grid w-full max-w-full gap-x-3 rounded-lg px-2 py-0.5',
        'hover:bg-muted/50',
        showAvatar ? 'mt-3 first:mt-1' : 'mt-0.5',
      )}
      style={{ gridTemplateColumns: '40px minmax(0, 1fr)' }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
    >
      <div className="flex w-10 shrink-0 justify-center pt-0.5">
        {showAvatar ? <UserAvatar profile={senderAvatar} size="md" /> : null}
      </div>

      <div className="min-w-0 pt-0.5">
        {showAvatar ? (
          <div className="mb-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0">
            <span className="text-sm font-semibold leading-tight text-foreground">{label}</span>
            <time
              className="font-mono text-xs font-medium tabular-nums text-muted-foreground"
              dateTime={message.created_at}
            >
              {time}
            </time>
          </div>
        ) : null}
        <div className="whitespace-pre-wrap break-words text-[15px] leading-[1.45] text-foreground">
          {message.content}
        </div>
      </div>
    </motion.div>
  );
}
