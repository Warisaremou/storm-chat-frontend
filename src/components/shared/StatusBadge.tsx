import type { UserStatus } from '@/types';

interface StatusBadgeProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3.5 h-3.5',
};

const colorMap: Record<UserStatus, string> = {
  online: 'bg-[var(--color-online)]',
  away: 'bg-[var(--color-away)]',
  busy: 'bg-[var(--color-busy)]',
  offline: 'bg-[var(--color-offline)]',
};

export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  return (
    <span
      className={`block rounded-full border-2 border-background ${sizeMap[size]} ${colorMap[status]} ${className}`}
      aria-label={`Status: ${status}`}
    />
  );
}
