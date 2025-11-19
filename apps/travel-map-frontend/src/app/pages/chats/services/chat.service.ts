import { chatApi } from '../api/chat.api';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatMemberInterface } from '../interfaces/chat-member.interface';
import { ChatUserInterface } from '../interfaces/chat-user.interface';
import { ChatMessageInterface } from '../interfaces/chat-message.interface';

@Injectable()
export class ChatService {
  private http: HttpClient = inject(HttpClient);

  public loadAvailableUsers(name: string): Observable<ChatUserInterface[]> {
    return this.http.get<ChatUserInterface[]>(chatApi.chatUsers);
  }

  public loadChats(): Observable<ChatMemberInterface[]> {
    return this.http.get<ChatMemberInterface[]>(chatApi.chatsList);
  }

  public sendMessage(
    content: string,
    senderId: string,
    receiverId: string,
    chatId?: string,
  ): Observable<ChatMessageInterface> {
    return this.http.post<ChatMessageInterface>(chatApi.sendMessage, { content, senderId, receiverId, chatId });
  }

  public loadMessages(id: string): Observable<ChatMessageInterface[]> {
    return this.http.get<ChatMessageInterface[]>(chatApi.messages(id));
  }
}
