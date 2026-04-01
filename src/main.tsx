import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';
import { useAuthStore } from '@/stores/auth.store';

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') return;
  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass' });
}

void enableMocking().then(async () => {
  // Initialize auth state from cookie (/me) before rendering
  try {
    await useAuthStore.getState().init();
  } catch {
    // ignore init errors — app will render as unauthenticated
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
