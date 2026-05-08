import type { UserPreview } from './user.types';
import type { Message } from './message.types';

export interface Room {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface RoomMember {
  id: string;
  room_id: string;
  user_id: string;
  role: 'owner' | 'member';
  created_at: string;
}

export interface Conversation {
  id: string;
  room: Room;
  otherParticipant: UserPreview | null;
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
}
