import { NavLink, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { PATHS } from '@/routes/paths';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
}

const navItems: NavItem[] = [
  { to: PATHS.CHAT, icon: MessageSquare, label: 'Messages' },
  { to: PATHS.INVITATIONS, icon: Users, label: 'Invitations' },
  { to: PATHS.PROFILE_SETTINGS, icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { profile, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const navigate = useNavigate();

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
      className={cn(
        'relative flex flex-col h-full bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
      aria-label="Sidebar navigation"
    >
      <TooltipProvider delay={100}>
        {/* Logo */}
        <div className="flex items-center h-16 shrink-0 border-b border-border px-4">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          {sidebarOpen && <span className="ml-3 font-bold text-lg tracking-tight">Storm Chat</span>}
        </div>

        {/* Nav items */}
        <nav
          className={cn('flex flex-col gap-1 pt-3 flex-1', sidebarOpen ? 'px-3' : 'items-center')}
          role="navigation"
        >
          {navItems.map(({ to, icon: Icon, label }) => (
            <Tooltip key={to}>
              <TooltipTrigger
                render={(props) => (
                  <NavLink
                    to={to}
                    end={to === PATHS.CHAT}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-lg transition-colors outline-none h-10',
                        sidebarOpen ? 'px-3 w-full gap-3' : 'w-10 justify-center',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                      )
                    }
                    aria-label={label}
                    {...props}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
                  </NavLink>
                )}
              />
              {!sidebarOpen && (
                <TooltipContent side="right">
                  <p>{label}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>

        {/* Bottom actions */}
        <div
          className={cn(
            'flex flex-col gap-2 pb-4 pt-2 border-t border-border',
            sidebarOpen ? 'px-3' : 'items-center',
          )}
        >
          {/* Theme toggle */}
          <ThemeToggle showLabel={sidebarOpen} />

          {/* Logout */}
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <button
                  type="button"
                  className={cn(
                    'flex items-center rounded-lg transition-colors outline-none h-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                    sidebarOpen ? 'px-3 w-full gap-3' : 'w-10 justify-center',
                  )}
                  aria-label="Logout"
                  {...props}
                  onClick={(e) => {
                    void handleLogout();
                    props.onClick?.(e);
                  }}
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
                </button>
              )}
            />
            {!sidebarOpen && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>

          {/* User Avatar */}
          <Tooltip>
            <TooltipTrigger
              render={(props) => (
                <button
                  type="button"
                  className={cn(
                    'flex items-center rounded-lg hover:opacity-80 transition-opacity outline-none h-12',
                    sidebarOpen
                      ? 'px-2 w-full gap-3 bg-muted/30 border border-border'
                      : 'justify-center',
                  )}
                  aria-label="Your profile"
                  {...props}
                  onClick={(e) => {
                    void navigate(PATHS.PROFILE_SETTINGS);
                    props.onClick?.(e);
                  }}
                >
                  <UserAvatar profile={profile} size="sm" showStatus />
                  {sidebarOpen && (
                    <div className="flex flex-col items-start overflow-hidden">
                      <span className="text-sm font-semibold truncate w-full">
                        {profile?.display_name ?? 'Guest'}
                      </span>
                      <span className="text-xs text-muted-foreground truncate w-full">
                        View profile
                      </span>
                    </div>
                  )}
                </button>
              )}
            />
            {!sidebarOpen && (
              <TooltipContent side="right">
                <p>{profile?.display_name ?? 'Profile'}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent z-10 shadow-sm transition-colors"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? (
            <PanelLeftClose className="w-3.5 h-3.5" />
          ) : (
            <PanelLeftOpen className="w-3.5 h-3.5" />
          )}
        </button>
      </TooltipProvider>
    </aside>
  );
}
