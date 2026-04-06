import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '@/stores/chat.store';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { roomsService } from '@/services/rooms.service';
import { usersService } from '@/services/users.service';
import { useUserSearch } from '@/features/users/hooks/useUserSearch';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  Info,
  MoreVertical,
  UserPlus,
  UserMinus,
  Pencil,
  Trash2,
  LogOut,
  PanelRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { PATHS } from '@/routes/paths';
import type { RoomMember } from '@/types';
import type { UserPreview } from '@/types';

// ── Edit Room Dialog ──────────────────────────────────────────────────────────

interface EditRoomDialogProps {
  roomId: string;
  name: string;
  description: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSaved: (name: string, description: string) => void;
}

function EditRoomDialog({
  roomId,
  name,
  description,
  open,
  onOpenChange,
  onSaved,
}: EditRoomDialogProps) {
  const [newName, setNewName] = useState(name);
  const [newDesc, setNewDesc] = useState(description);
  const [isLoading, setIsLoading] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setNewName(name);
      setNewDesc(description);
    }
  }, [open, name, description]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      nameInputRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const handleSave = async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      setIsLoading(true);
      await roomsService.updateRoom(roomId, { name: trimmed, description: newDesc.trim() });
      onSaved(trimmed, newDesc.trim());
      onOpenChange(false);
      toast.success('Room updated');
    } catch {
      toast.error('Failed to update room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <Input
            ref={nameInputRef}
            placeholder="Room name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSave()} disabled={!newName.trim() || isLoading}>
              {isLoading ? <LoadingSpinner size="sm" /> : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Members Dialog ────────────────────────────────────────────────────────────

interface MembersDialogProps {
  roomId: string;
  isOwner: boolean;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

function MembersDialog({ roomId, isOwner, open, onOpenChange }: MembersDialogProps) {
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserPreview>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { query, setQuery, results, isLoading: isSearching } = useUserSearch();

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetched = await roomsService.getMembers(roomId);
      setMembers(fetched);
      const settled = await Promise.allSettled(fetched.map((m) => usersService.getUser(m.user_id)));
      const map: Record<string, UserPreview> = {};
      settled.forEach((result, i) => {
        if (result.status === 'fulfilled') map[fetched[i].user_id] = result.value;
      });
      setProfiles(map);
    } catch {
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (open) void fetchMembers();
  }, [open, fetchMembers]);

  const handleRemove = async (userId: string) => {
    try {
      setRemovingId(userId);
      await roomsService.removeMember(roomId, userId);
      setMembers((prev) => prev.filter((m) => m.user_id !== userId));
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    } finally {
      setRemovingId(null);
    }
  };

  const handleAdd = async (user: UserPreview) => {
    try {
      setAddingId(user.id);
      await roomsService.addMember(roomId, user.id);
      await fetchMembers();
      setQuery('');
      toast.success('Member added');
    } catch {
      toast.error('Failed to add member');
    } finally {
      setAddingId(null);
    }
  };

  const memberIds = new Set(members.map((m) => m.user_id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Members</DialogTitle>
          <DialogDescription>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isOwner && (
            <div className="space-y-2">
              <Input
                placeholder="Search users to add..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <div className="max-h-40 overflow-y-auto space-y-1 rounded-md border border-border p-1">
                  {isSearching ? (
                    <div className="flex justify-center py-3">
                      <LoadingSpinner size="sm" />
                    </div>
                  ) : results.filter((u) => !memberIds.has(u.id)).length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-2">No users found</p>
                  ) : (
                    results
                      .filter((u) => !memberIds.has(u.id))
                      .map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <UserAvatar profile={user} size="sm" />
                            <span className="text-sm">{user.display_name ?? user.username}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 gap-1"
                            onClick={() => void handleAdd(user)}
                            disabled={addingId === user.id}
                          >
                            {addingId === user.id ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <UserPlus className="w-3.5 h-3.5" />
                            )}
                            Add
                          </Button>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          )}

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              members.map((member) => {
                const profile = profiles[member.user_id];
                const displayName =
                  profile?.display_name ?? profile?.username ?? member.user_id.slice(0, 8);
                return (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <UserAvatar profile={profile} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{displayName}</span>
                        <span className="text-xs text-muted-foreground">
                          {[
                            profile ? `@${profile.username}` : null,
                            member.role === 'owner' ? 'owner' : null,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </div>
                    </div>
                    {isOwner && member.role !== 'owner' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => void handleRemove(member.user_id)}
                        disabled={removingId === member.user_id}
                      >
                        {removingId === member.user_id ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <UserMinus className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  isLoading: boolean;
  onConfirm: () => void;
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  isLoading,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" /> : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

export function ConversationHeader() {
  const { activeConversationId, conversations, removeConversation, updateConversationRoom } =
    useChatStore();
  const { user } = useAuthStore();
  const openModal = useUIStore((s) => s.openModal);
  const roomInfoOpen = useUIStore((s) => s.roomInfoOpen);
  const toggleRoomInfo = useUIStore((s) => s.toggleRoomInfo);
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const conversation = conversations.find((c) => c.id === activeConversationId);
  if (!conversation) return null;

  const participant = conversation.otherParticipant;
  const room = conversation.room;
  const isOwner = room.owner_id === user?.id;
  const displayName = participant?.display_name || room.name;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await roomsService.deleteRoom(room.id);
      removeConversation(room.id);
      setDeleteOpen(false);
      toast.success('Room deleted');
      void navigate(PATHS.CHAT);
    } catch {
      toast.error('Failed to delete room');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsLeaving(true);
      await roomsService.leaveRoom(room.id);
      removeConversation(room.id);
      setLeaveOpen(false);
      toast.success('Left room');
      void navigate(PATHS.CHAT);
    } catch {
      toast.error('Failed to leave room');
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-md">
        <div className="flex items-center gap-3 p-1">
          <UserAvatar profile={participant} size="md" showStatus />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-foreground">{displayName}</span>
            {participant && (
              <span className="text-xs text-muted-foreground">{participant.status}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={roomInfoOpen ? 'secondary' : 'ghost'}
            size="icon"
            className="h-9 w-9 text-muted-foreground"
            onClick={() => toggleRoomInfo()}
            title="Group info"
            aria-pressed={roomInfoOpen}
          >
            <PanelRight className="h-4 w-4" />
          </Button>
          {participant && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground"
              onClick={() => openModal('userProfile', participant)}
              title="Profile"
            >
              <Info className="h-4 w-4" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setMembersOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Members
              </DropdownMenuItem>
              {isOwner && (
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit room
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {isOwner ? (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete room
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setLeaveOpen(true)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave room
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <EditRoomDialog
        roomId={room.id}
        name={room.name}
        description={room.description}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={(name, description) => updateConversationRoom(room.id, { name, description })}
      />
      <MembersDialog
        roomId={room.id}
        isOwner={isOwner}
        open={membersOpen}
        onOpenChange={setMembersOpen}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete room"
        description={`"${room.name}" and all its messages will be permanently deleted.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
      />
      <ConfirmDialog
        open={leaveOpen}
        onOpenChange={setLeaveOpen}
        title="Leave room"
        description={`You will no longer have access to "${room.name}".`}
        confirmLabel="Leave"
        isLoading={isLeaving}
        onConfirm={() => void handleLeave()}
      />
    </>
  );
}
