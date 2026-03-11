import type { RoomType, RoomMemberRole } from './enums';
import type { UserPreview } from './user.types';

export interface Room {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  type: RoomType;
  avatar_url: string | null;
  creator_id: number;
  created_at: string;
  updated_at: string;
}

export interface RoomMember {
  room_id: number;
  user_id: number;
  role: RoomMemberRole;
  joined_at: string;
}

export interface Conversation {
  id: number;
  room: Room;
  otherParticipant: UserPreview;
  lastMessage: Message | null;
  unreadCount: number;
  updatedAt: string;
}

// Ensure Message is imported correctly later or declare a type here temporarily if needed.
// However we will implement Message type in message.types.ts
import type { Message } from './message.types';
