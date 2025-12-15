import { Injectable, inject, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AuthService, WebSocketService } from '@app/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { chatApi } from '../api/chat.api';

export interface UnreadData {
  totalUnread: number;
  chats: Array<{
    chatId: string;
    unreadCount: number;
    lastMessage: any;
  }>;
}

@Injectable({ providedIn: 'root' })
export class UnreadMessagesService {
  private socketService = inject(WebSocketService);
  private authService = inject(AuthService);
  private http: HttpClient = inject(HttpClient);

  private unreadData = signal<UnreadData | null>(null);

  public totalUnread = computed(() => {
    const data = this.unreadData();
    return data ? data.totalUnread : null;
  });

  public chatsUnread = computed(() => this.unreadData()?.chats ?? []);

  public totalUnread$ = toObservable(this.totalUnread);

  private isInitialized = false;

  public initialize(): void {
    if (this.isInitialized) return;

    const token = this.authService.token;
    if (!token) {
      console.warn('No token available for WebSocket connection');
      return;
    }

    this.socketService
      .connect(token)
      .then(() => {
        console.log('✅ UnreadMessagesService: WebSocket connected');

        this.socketService.onUnreadCount().subscribe((data: UnreadData) => {
          console.log('📬 Unread count updated:', data);
          this.unreadData.set(data);
        });

        this.isInitialized = true;
      })
      .catch((err) => {
        console.error('❌ UnreadMessagesService: Connection failed', err);
      });
  }

  public getUnreadForChat(chatId: string) {
    return computed(() => {
      const chats = this.unreadData()?.chats ?? [];
      return chats.find((c) => c.chatId === chatId)?.unreadCount ?? 0;
    });
  }

  public reset(): void {
    this.unreadData.set(null);
    this.isInitialized = false;
  }

  public getUnreadMessages(): Observable<any> {
    return this.http.get<any>(chatApi.unreadMessages);
  }

  public setInitialUnreadMessagesCount(): void {
    this.getUnreadMessages().subscribe((data: any) => {
      this.unreadData.set(data);
    });
  }
}
