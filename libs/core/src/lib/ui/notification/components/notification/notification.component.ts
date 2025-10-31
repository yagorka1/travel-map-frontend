import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationStyles } from '../../constants/notification-styles.const';
import { NotificationInterface } from '../../interfaces/notification.interface';
import { TranslatePipe } from '@ngx-translate/core';

const NOTIFICATION_DURATION = 5000;

@Component({
  selector: 'lib-notification',
  templateUrl: './notification.component.html',
  imports: [TranslatePipe],
})
export class NotificationComponent implements OnInit {
  @Input() notification!: NotificationInterface;

  @Output() closed = new EventEmitter<void>();

  public data!: { iconName: string; iconClass: string; icon: string };

  public visible = true;

  private readonly config = NotificationStyles;

  public ngOnInit() {
    this.data = {
      icon: this.config[this.notification.type].icon,
      iconClass: this.config[this.notification.type].class,
      iconName: this.config[this.notification.type].iconName,
    };

    if (!this.notification.notHiding) {
      setTimeout(() => this.close(), NOTIFICATION_DURATION);
    }
  }

  public close() {
    this.visible = false;
    this.closed.emit();
  }
}
