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
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      await login(values);
      void navigate(PATHS.CHAT);
    } catch {
      // Error is handled in auth store
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter your details to sign in</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm text-center">
          {error}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="identifier"
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
                <div className="flex items-center justify-between">
                  <FormLabel>Password</FormLabel>
                  <Link
                    to={PATHS.FORGOT_PASSWORD}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
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

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account? </span>
        <Link to={PATHS.REGISTER} className="font-medium text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
