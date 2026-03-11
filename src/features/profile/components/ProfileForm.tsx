import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema, type UpdateProfileFormData } from '../schemas/profile.schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusSelector } from './StatusSelector';
import type { UserProfile } from '@/types';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ProfileFormProps {
  profile: UserProfile | null;
  onSubmit: (data: UpdateProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ProfileForm({ profile, onSubmit, isLoading }: ProfileFormProps) {
  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      display_name: profile?.display_name || '',
      status: profile?.status || 'online',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)} className="space-y-6">
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="How others see you"
                  className="h-10 bg-card border-border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <StatusSelector
                  value={field.value || 'online'}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => form.reset()}
            disabled={isLoading || !form.formState.isDirty}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isDirty}
            className="min-w-[100px]"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
