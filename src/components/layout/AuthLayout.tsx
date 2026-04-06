import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 400, damping: 30 };

function LogoMark() {
  return (
    <div className="flex flex-col gap-1.5 items-center justify-center" aria-hidden>
      <span className="h-0.5 w-7 rounded-full bg-foreground" />
      <span className="h-0.5 w-7 rounded-full bg-foreground" />
      <span className="h-0.5 w-7 rounded-full bg-foreground" />
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-6 py-12">
      <motion.div
        className="flex w-full max-w-[400px] flex-col items-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <LogoMark />

        <div className="mt-10 w-full">
          <Outlet />
        </div>

        <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground max-w-[320px]">
          By continuing you agree to our{' '}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </motion.div>
    </div>
  );
}
