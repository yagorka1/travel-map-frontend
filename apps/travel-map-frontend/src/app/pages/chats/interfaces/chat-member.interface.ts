import { ChatUserInterface } from './chat-user.interface';

export interface ChatMemberInterface {
  chat: { id: string; name: string };
  id: string;
  user: ChatUserInterface;
}
