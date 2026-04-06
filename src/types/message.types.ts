import type { UserPreview } from './user.types';

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  /** Populated by message-service list/create/WS when USER_SERVICE_URL is configured. */
  sender?: UserPreview | null;
}

export interface MessagesPage {
  data: Message[];
  next_cursor: string;
}
