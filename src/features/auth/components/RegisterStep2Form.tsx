import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type z } from 'zod';
import { registerStep2Schema } from '../schemas/auth.schemas';
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
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { authService } from '@/services/auth.service';
import { useState } from 'react';
import { toast } from 'sonner';

export function RegisterStep2Form() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerStep2Schema>>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      display_name: '',
      avatar_url: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerStep2Schema>) => {
    try {
      setIsLoading(true);
      await authService.setupProfile({
        display_name: values.display_name,
        avatar_url: values.avatar_url ?? '',
      });
      toast.success('Profile setup complete!');
      void navigate(PATHS.CHAT);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to setup profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    void onSubmit(values);
  });

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Set up your profile
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Let others know who you are</p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            control={form.control}
            name="display_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Avatar URL{' '}
                  <span className="text-muted-foreground text-xs">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/avatar.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Finish Setup
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => void navigate(PATHS.CHAT)}
          >
            Skip for now
          </Button>
        </form>
      </Form>
    </div>
  );
}