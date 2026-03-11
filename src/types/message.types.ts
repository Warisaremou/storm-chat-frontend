import type { MessageDeliveryStatus } from './enums';

export interface Message {
  id: string;
  room_id: number;
  sender_id: number;
  content: string;
  delivery_status: MessageDeliveryStatus;
  is_read: boolean;
  created_at: string;
}

export interface MessageWithSender extends Message {
  sender: {
    id: number;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

export interface SendMessagePayload {
  room_id: number;
  content: string;
}
