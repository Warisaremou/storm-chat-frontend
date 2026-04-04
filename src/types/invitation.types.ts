import type { InvitationStatus } from './enums';
import type { UserPreview } from './user.types';

export interface Invitation {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: InvitationStatus;
  created_at: string;
  updated_at: string;
}

export interface InvitationWithUsers extends Invitation {
  sender: UserPreview;
  receiver: UserPreview;
}

export interface SendInvitationPayload {
  receiver_id: string;
}

export interface RespondToInvitationPayload {
  invitation_id: string;
  action: 'accept' | 'decline';
}
