import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Shield } from 'lucide-react';
import type { UserPreview } from '@/types';

interface UserProfileModalProps {
  user: UserPreview;
  onStartChat?: () => void;
}

export function UserProfileModal({ user, onStartChat }: Readonly<UserProfileModalProps>) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center pt-2 gap-4">
        <UserAvatar profile={user} size="xl" showStatus />
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold tracking-tight">{user.display_name}</h2>
          <p className="text-sm text-muted-foreground font-medium">@{user.username}</p>
        </div>
      </div>

      {/* Profile Info Card */}
      <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
        <div className="divide-y divide-border">
          <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Member Since
              </p>
              <p className="text-sm font-semibold">June 2025</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Access Level
              </p>
              <p className="text-sm font-semibold text-primary">Certified Member</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <Button onClick={onStartChat} className="w-full gap-2">
        <MessageSquare className="h-4 w-4" />
        Message {(user.display_name ?? 'User').split(' ')[0]}
      </Button>
    </div>
  );
}
