import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, SpinnerService } from '@app/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UnreadMessagesService } from '../../../../pages/chats/services/unread-messages.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgOptimizedImage } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'app-aside-menu',
  imports: [RouterLink, TranslatePipe, NgOptimizedImage],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss',
})
export class AsideMenuComponent {
  public unreadMessages = 0;

  private unreadMessagesService = inject(UnreadMessagesService);
  private authService = inject(AuthService);
  private spinnerService = inject(SpinnerService);

  constructor() {
    this.unreadMessagesService.initialize();

    this.unreadMessagesService.totalUnread$.subscribe((totalUnread) => {
      this.unreadMessages = totalUnread || 0;
    });

    this.unreadMessagesService.setInitialUnreadMessagesCount();
  }

  public onLogout(): void {
    this.spinnerService.show(this.authService.logout()).pipe(untilDestroyed(this)).subscribe();
  }
}
