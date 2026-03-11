import { useAuthStore } from '@/stores/auth.store';
import { ProfileForm } from '@/features/profile/components/ProfileForm';
import { AvatarUpload } from '@/features/profile/components/AvatarUpload';
import { usersService } from '@/services/users.service';
import { toast } from 'sonner';
import { useState } from 'react';
import type { UpdateProfileFormData } from '@/features/profile/schemas/profile.schemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { UserProfile } from '@/types';

export default function ProfileSettingsPage() {
  const { profile, user, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileSubmit = async (data: UpdateProfileFormData) => {
    try {
      setIsLoading(true);
      const response = await usersService.updateProfile(data);
      if (user && response.data) {
        // Update store with new profile data
        const updatedProfile: UserProfile = {
          ...(profile as UserProfile),
          ...response.data,
        };
        setAuth(user, updatedProfile);
        toast.success('Profile updated successfully');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (_file: File) => {
    try {
      setIsLoading(true);
      // In a real app, this would be a multipart/form-data request
      // For mock, we just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Avatar uploaded successfully');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-serif tracking-tight text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your public identity and presence.
          </p>
        </header>

        <div className="grid gap-8">
          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Your Identity</CardTitle>
              <CardDescription>This information will be visible to other users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <AvatarUpload
                  profile={profile}
                  onUpload={(file) => void handleAvatarUpload(file)}
                  isLoading={isLoading}
                />

                <div className="flex-1 w-full">
                  <ProfileForm
                    profile={profile}
                    onSubmit={(data) => handleProfileSubmit(data)}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm opacity-60">
            <CardHeader>
              <CardTitle className="text-xl">Account Information</CardTitle>
              <CardDescription>Private information about your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Username
                  </p>
                  <p className="text-sm font-medium">@{user?.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-end">
                <p className="text-xs text-muted-foreground italic">
                  Email and username changes are currently locked.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
