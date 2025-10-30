import { Injectable, signal } from '@angular/core';
import { NotificationInterface } from '../interfaces/notification.interface';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  public notificationsList = signal<NotificationInterface[]>([]);

  public show(toast: NotificationInterface) {
    this.notificationsList.update((list) => [...list, toast]);
  }

  public remove(index: number) {
    this.notificationsList.update((list) => list.filter((_, i) => i !== index));
  }
}
