import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center', className)}>
      {Icon && (
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
          <Icon className="h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-[300px] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button className="mt-8 rounded-xl px-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
