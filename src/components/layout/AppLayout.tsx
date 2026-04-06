import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/stores/ui.store';
import { useEffect } from 'react';
import { ModalManager } from './ModalManager';

export function AppLayout() {
  const { theme } = useUIStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background shadow-sm dark:shadow-none">
        <Outlet />
      </main>
      <ModalManager />
    </div>
  );
}
