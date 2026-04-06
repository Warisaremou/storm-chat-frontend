import { useNavigate } from 'react-router-dom';
import { MessageSquare, LogOut, User, ChevronsUpDown, Sun, Moon } from 'lucide-react';
import { PATHS } from '@/routes/paths';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ConversationList } from '@/features/chat/components/ConversationList';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Theme } from '@/types';

export function Sidebar() {
  const { profile, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);

  const displayName = profile?.display_name?.trim() || user?.username || 'Guest';
  const secondaryLine = user?.email?.trim() || (user?.username ? `@${user.username}` : '');

  const handleLogout = async () => {
    try {
      await logout();
      void navigate(PATHS.LOGIN);
    } catch {
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <aside
      className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-card"
      aria-label="Sidebar navigation"
    >
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
          <MessageSquare className="h-4 w-4 text-foreground" strokeWidth={1.75} />
        </div>
        <span className="truncate text-sm font-semibold tracking-tight text-foreground">
          Storm Chat
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pt-4">
        <ConversationList />
      </div>

      <div className="shrink-0 border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              'flex w-full items-center gap-2 rounded-lg px-2 py-2 outline-none',
              'hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card',
            )}
          >
            <UserAvatar profile={profile} size="sm" showStatus />
            <div className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium text-foreground">
                {displayName}
              </span>
              {secondaryLine ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {secondaryLine}
                </span>
              ) : null}
            </div>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" sideOffset={8} className="min-w-56">
            <div className="flex gap-2 px-2 py-2">
              <UserAvatar profile={profile} size="md" showStatus />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                {secondaryLine ? (
                  <p className="truncate text-xs text-muted-foreground">{secondaryLine}</p>
                ) : (
                  <p className="truncate text-xs text-muted-foreground">Signed in</p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void navigate(PATHS.PROFILE_SETTINGS)}>
              <User className="mr-2 size-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                Theme
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as Theme)}
              >
                <DropdownMenuRadioItem value="light">
                  <Sun className="mr-2 size-4" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <Moon className="mr-2 size-4" />
                  Dark
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => void handleLogout()}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
