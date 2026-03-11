import { useState, useRef } from 'react';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import type { UserProfile } from '@/types';
import { toast } from 'sonner';

interface AvatarUploadProps {
  profile: UserProfile | null;
  onUpload: (file: File) => Promise<void> | void;
  isLoading?: boolean;
}

export function AvatarUpload({ profile, onUpload, isLoading }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File is too large. Max 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      void onUpload(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <UserAvatar
          profile={profile}
          size="xl"
          avatarOverride={preview || undefined}
          className="ring-4 ring-offset-2 ring-primary/10"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          disabled={isLoading}
        >
          <Camera className="w-6 h-6" />
        </button>

        {preview && (
          <button
            onClick={clearPreview}
            className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-sm hover:bg-destructive/90 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="h-8 gap-2 border-border"
        >
          <ImageIcon className="w-4 h-4" />
          Change Avatar
        </Button>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
          JPG, PNG or GIF (Max 2MB)
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
// Note: UserAvatar size 'xl' needs to be added or used as a variant.
