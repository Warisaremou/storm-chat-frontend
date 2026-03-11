import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ChatLayoutProps {
  conversationPanel: ReactNode;
  children?: ReactNode;
}

export function ChatLayout({ conversationPanel, children }: ChatLayoutProps) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="w-[280px] shrink-0 flex flex-col border-r border-border bg-card overflow-hidden">
        {conversationPanel}
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
        <Outlet />
      </div>
    </div>
  );
}
