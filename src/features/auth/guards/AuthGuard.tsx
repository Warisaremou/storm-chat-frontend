import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { PATHS } from '@/routes/paths';
import { PageLoader } from '@/components/shared/PageLoader';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
