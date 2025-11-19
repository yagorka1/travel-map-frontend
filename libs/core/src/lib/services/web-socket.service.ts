import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { WebSocketEvents } from '../enums/web-sockets-events.enum';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: Socket | null = null;

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket) return resolve();

      this.socket = io(environment.apiWebSocketHost, {
        auth: {
          token: token,
        },
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('WS connected', this.socket?.id);
        resolve();
      });

      this.socket.on('connect_error', (err) => {
        console.error('WS connection error', err.message);
        reject(err);
      });
    });
  }

  joinChat(chatId: string) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected yet');
      return;
    }
    this.socket.emit('join', chatId);
  }

  onNewMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket?.on(WebSocketEvents.NEW_MESSAGE, (msg) => {
        observer.next(msg);
      });
    });
  }

  onUnreadCount(): Observable<any> {
    return new Observable((observer) => {
      this.socket?.on(WebSocketEvents.UNREAD_COUNT, (data) => {
        observer.next(data);
      });
    });
  }
}
