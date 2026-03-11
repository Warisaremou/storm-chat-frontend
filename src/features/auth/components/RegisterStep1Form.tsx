import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { registerStep1Schema } from '../schemas/auth.schemas';
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
import { authService } from '@/services/auth.service';
import { useState } from 'react';
import { toast } from 'sonner';

export function RegisterStep1Form() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerStep1Schema>>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerStep1Schema>) => {
    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _c, ...payload } = values;
      await authService.register(payload);
      toast.success('Account created successfully');
      void navigate(PATHS.REGISTER_SETUP);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Create account</h2>
        <p className="text-sm text-muted-foreground mt-1">Start your journey with us</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="storm_user" {...field} />
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link to={PATHS.LOGIN} className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
