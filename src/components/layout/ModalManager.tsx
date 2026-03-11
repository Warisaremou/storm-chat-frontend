import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useUIStore } from '@/stores/ui.store';
import { UserSearch } from '@/features/users/components/UserSearch';
import { UserProfileModal } from '@/features/users/components/UserProfileModal';
import type { UserPreview } from '@/types';

export function ModalManager() {
  const { activeModal, closeModal, modalPayload } = useUIStore();

  const isOpen = activeModal !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-[425px]">
        {activeModal === 'userSearch' && (
          <>
            <DialogHeader>
              <DialogTitle>Find People</DialogTitle>
              <DialogDescription>
                Search for other users by their name or username to start a conversation.
              </DialogDescription>
            </DialogHeader>
            <UserSearch />
          </>
        )}

        {activeModal === 'userProfile' && !!modalPayload && (
          <>
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>Detailed contact information and actions.</DialogDescription>
            </DialogHeader>
            <UserProfileModal user={modalPayload as UserPreview} onStartChat={closeModal} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
