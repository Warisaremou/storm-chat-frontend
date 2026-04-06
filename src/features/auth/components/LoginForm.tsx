import type { FormEventHandler } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { useAuthStore } from '@/stores/auth.store';
import { loginSchema } from '../schemas/auth.schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export function LoginForm() {
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identity: '',
      password: '',
    },
  });

  const onValidSubmit: SubmitHandler<z.infer<typeof loginSchema>> = (values) => {
    void (async () => {
      try {
        await login(values);
        void navigate(PATHS.CHAT);
      } catch {
        // Error handled in store
      }
    })();
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    void form.handleSubmit(onValidSubmit)(e);
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h2>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={onFormSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="identity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </Form>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          to={PATHS.REGISTER}
          className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
