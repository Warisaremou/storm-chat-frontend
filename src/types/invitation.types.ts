import type { InvitationStatus } from './enums';
import type { UserPreview } from './user.types';

export interface Invitation {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: InvitationStatus;
  created_at: string;
  updated_at: string;
}

export interface InvitationWithUsers extends Invitation {
  sender: UserPreview;
  receiver: UserPreview;
}

export interface SendInvitationPayload {
  receiver_id: number;
}

export interface RespondToInvitationPayload {
  invitation_id: number;
  action: 'accept' | 'decline';
}
