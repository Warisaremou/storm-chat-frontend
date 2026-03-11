import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/stores/ui.store';
import { useEffect } from 'react';
import { ModalManager } from './ModalManager';

export function AppLayout() {
  const { theme } = useUIStore();

  // Apply theme class to <html> element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col min-w-0">
        <Outlet />
      </main>
      <ModalManager />
    </div>
  );
}
