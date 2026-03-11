import { Outlet } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="auth-bg min-h-screen w-full flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-primary text-primary-foreground p-3 rounded-xl mb-4 shadow-lg flex items-center justify-center">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h1 className="text-display font-serif tracking-tight text-foreground">Storm Chat</h1>
        <p className="text-muted-foreground mt-2">Connect in real-time with your team</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-[420px] p-8">
        <Outlet />
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Storm Chat. All rights reserved.
      </p>
    </div>
  );
}
