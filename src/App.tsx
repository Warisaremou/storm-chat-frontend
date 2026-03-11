import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { router } from '@/routes';
import { useUIStore } from '@/stores/ui.store';
import { useEffect } from 'react';

export default function App() {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
