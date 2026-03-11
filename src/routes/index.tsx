import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { PATHS } from './paths';
import { AuthGuard } from '@/features/auth/guards/AuthGuard';
import { GuestGuard } from '@/features/auth/guards/GuestGuard';
import { PageLoader } from '@/components/shared/PageLoader';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterStep1Page = lazy(() => import('@/pages/auth/RegisterStep1Page'));
const RegisterStep2Page = lazy(() => import('@/pages/auth/RegisterStep2Page'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const ChatPage = lazy(() => import('@/pages/app/ChatPage'));
const InvitationsPage = lazy(() => import('@/pages/app/InvitationsPage'));
const ProfileSettingsPage = lazy(() => import('@/pages/app/ProfileSettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const wrap = (el: React.ReactNode) => <Suspense fallback={<PageLoader />}>{el}</Suspense>;

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to={PATHS.CHAT} replace /> },
  {
    element: (
      <GuestGuard>
        <AuthLayout />
      </GuestGuard>
    ),
    children: [
      { path: PATHS.LOGIN, element: wrap(<LoginPage />) },
      { path: PATHS.REGISTER, element: wrap(<RegisterStep1Page />) },
      { path: PATHS.REGISTER_SETUP, element: wrap(<RegisterStep2Page />) },
      { path: PATHS.FORGOT_PASSWORD, element: wrap(<ForgotPasswordPage />) },
      { path: PATHS.RESET_PASSWORD, element: wrap(<ResetPasswordPage />) },
    ],
  },
  {
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      { path: PATHS.CHAT, element: wrap(<ChatPage />) },
      { path: PATHS.CHAT_CONVERSATION, element: wrap(<ChatPage />) },
      { path: PATHS.INVITATIONS, element: wrap(<InvitationsPage />) },
      { path: PATHS.PROFILE_SETTINGS, element: wrap(<ProfileSettingsPage />) },
    ],
  },
  { path: '*', element: wrap(<NotFoundPage />) },
]);
