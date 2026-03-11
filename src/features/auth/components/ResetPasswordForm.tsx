import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { resetPasswordSchema } from '../schemas/auth.schemas';
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
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { authService } from '@/services/auth.service';
import { useState } from 'react';
import { toast } from 'sonner';

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    try {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _c, ...payload } = values;
      await authService.resetPassword({ ...payload, token });
      toast.success('Password successfully reset');
      void navigate(PATHS.LOGIN);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to reset password';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Set new password</h2>
        <p className="text-sm text-muted-foreground mt-1">Must be at least 8 characters.</p>
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
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
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
            Reset password
          </Button>
        </form>
      </Form>
    </div>
  );
}
