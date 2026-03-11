import { authHandlers } from './handlers/auth.handlers';
import { usersHandlers } from './handlers/users.handlers';
import { conversationsHandlers } from './handlers/conversations.handlers';
import { messagesHandlers } from './handlers/messages.handlers';
import { invitationsHandlers } from './handlers/invitations.handlers';

export const handlers = [
  ...authHandlers,
  ...usersHandlers,
  ...conversationsHandlers,
  ...messagesHandlers,
  ...invitationsHandlers,
];
