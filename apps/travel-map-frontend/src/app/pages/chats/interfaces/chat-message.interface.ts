import { ChatUserInterface } from './chat-user.interface';

export interface ChatMessageInterface {
  chat: { id: string; name: string };
  chatId: string;
  content: string;
  created_at: string;
  id: string;
  senderId: string;
  sender: ChatUserInterface;
}
