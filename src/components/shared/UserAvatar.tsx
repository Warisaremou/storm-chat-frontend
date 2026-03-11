import type { UserProfile, UserStatus } from '@/types';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  profile: Pick<UserProfile, 'display_name' | 'avatar_url' | 'status'> | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
  statusOverride?: UserStatus;
  avatarOverride?: string;
}

const sizeMap = {
  xs: { avatar: 'w-6 h-6 text-xs', badge: 'sm' as const, offset: '-bottom-0 -right-0' },
  sm: { avatar: 'w-8 h-8 text-xs', badge: 'sm' as const, offset: '-bottom-0.5 -right-0.5' },
  md: { avatar: 'w-10 h-10 text-sm', badge: 'md' as const, offset: '-bottom-0.5 -right-0.5' },
  lg: { avatar: 'w-12 h-12 text-base', badge: 'md' as const, offset: '-bottom-1 -right-1' },
  xl: { avatar: 'w-24 h-24 text-2xl', badge: 'lg' as const, offset: '-bottom-1 -right-1' },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function UserAvatar({
  profile,
  size = 'md',
  showStatus = false,
  className,
  statusOverride,
  avatarOverride,
}: UserAvatarProps) {
  const { avatar: avatarSize, badge: badgeSize, offset } = sizeMap[size];
  const displayName = profile?.display_name ?? '?';
  const status = statusOverride ?? profile?.status ?? 'offline';

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'rounded-full bg-primary/10 flex items-center justify-center overflow-hidden font-medium text-primary select-none ring-2 ring-border',
          avatarSize,
        )}
      >
        {avatarOverride || profile?.avatar_url ? (
          <img
            src={avatarOverride || profile?.avatar_url || ''}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(displayName)}</span>
        )}
      </div>

      {showStatus && (
        <StatusBadge status={status} size={badgeSize} className={cn('absolute', offset)} />
      )}
    </div>
  );
}
