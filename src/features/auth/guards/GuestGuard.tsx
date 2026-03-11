import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { PATHS } from '@/routes/paths';
import { PageLoader } from '@/components/shared/PageLoader';

export function GuestGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <PageLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={PATHS.CHAT} replace />;
  }

  return <>{children}</>;
}
