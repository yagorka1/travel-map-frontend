import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'lib-notifications',
  templateUrl: './notifications.component.html',
  imports: [NotificationComponent],
})
export class NotificationsComponent {
  private notificationService = inject(NotificationService);

  public notifications = this.notificationService.notificationsList;

  public removeToast(index: number) {
    this.notificationService.remove(index);
  }
}
