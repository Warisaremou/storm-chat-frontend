import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, Phone, Video, Calendar, Shield } from 'lucide-react';
import type { UserPreview } from '@/types';

interface UserProfileModalProps {
  user: UserPreview;
  onStartChat?: () => void;
}

export function UserProfileModal({ user, onStartChat }: UserProfileModalProps) {
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

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: MessageSquare, label: 'Chat' },
          { icon: Phone, label: 'Audio' },
          { icon: Video, label: 'Video' },
          { icon: Mail, label: 'Email' },
        ].map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="h-auto flex-col py-3 px-0 gap-1.5 border-border bg-background hover:bg-accent group/btn"
          >
            <action.icon className="h-4 w-4 text-primary group-hover/btn:scale-110 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/btn:text-foreground">
              {action.label}
            </span>
          </Button>
        ))}
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
      <Button
        onClick={onStartChat}
        className="w-full h-12 text-sm font-bold gap-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all"
      >
        <MessageSquare className="h-4 w-4" />
        Message {(user.display_name ?? 'User').split(' ')[0]}
      </Button>
    </div>
  );
}
