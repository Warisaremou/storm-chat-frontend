import { useCallback, useEffect, useState } from 'react';
import { roomsService } from '@/services/rooms.service';
import { usersService } from '@/services/users.service';
import type { RoomMember, UserPreview } from '@/types';
import { toast } from 'sonner';

export function useRoomMembers(roomId: string | null, enabled: boolean) {
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserPreview>>({});
  const [isLoading, setIsLoading] = useState(false);

  const refetch = useCallback(async () => {
    if (!roomId) return;
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
      setMembers([]);
      setProfiles({});
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (!enabled || !roomId) {
      setMembers([]);
      setProfiles({});
      return;
    }
    void refetch();
  }, [enabled, roomId, refetch]);

  return { members, profiles, isLoading, refetch };
}
