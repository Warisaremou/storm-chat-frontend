import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { forgotPasswordSchema } from '../schemas/auth.schemas';
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
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { authService } from '@/services/auth.service';
import { useState } from 'react';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setIsLoading(true);
      await authService.forgotPassword(values);
      setIsSent(true);
      toast.success('Reset link sent to your email');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="w-full text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Check your email</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-6">
          We&apos;ve sent a password reset link to{' '}
          <span className="font-medium text-foreground">{form.getValues('email')}</span>.
        </p>
        <Link
          to={PATHS.LOGIN}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Forgot password?</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No worries, we&apos;ll send you reset instructions.
        </p>
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

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <Link
          to={PATHS.LOGIN}
          className="inline-flex items-center font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}
