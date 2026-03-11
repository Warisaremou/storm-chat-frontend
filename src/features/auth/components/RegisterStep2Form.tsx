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
import { Loader2, UploadCloud, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { authService } from '@/services/auth.service';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export function RegisterStep2Form() {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerStep2Schema>>({
    resolver: zodResolver(registerStep2Schema),
    defaultValues: {
      display_name: '',
      // File inputs can't have a typed default - use undefined
      avatar: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      form.setValue('avatar', file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof registerStep2Schema>) => {
    try {
      setIsLoading(true);
      await authService.setupProfile(values);
      toast.success('Profile setup complete!');
      void navigate(PATHS.CHAT);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to setup profile';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Set up your profile
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Let others know who you are</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-6"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <button
              type="button"
              className="relative w-24 h-24 rounded-full border-2 border-dashed border-border bg-muted flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
              onClick={triggerFileInput}
              aria-label="Upload profile picture"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <UploadCloud className="w-6 h-6 text-white" />
              </div>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
              aria-label="Profile picture file input"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Upload a profile picture (max 2MB)
            </p>
          </div>

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
