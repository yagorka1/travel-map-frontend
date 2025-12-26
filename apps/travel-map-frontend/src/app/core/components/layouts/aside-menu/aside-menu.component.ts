import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, SpinnerService } from '@app/core';
import { TranslatePipe } from '@ngx-translate/core';
import { UnreadMessagesService } from '../../../../pages/chats/services/unread-messages.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { toSignal } from '@angular/core/rxjs-interop';

@UntilDestroy()
@Component({
  selector: 'app-aside-menu',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './aside-menu.component.html',
  styleUrl: './aside-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideMenuComponent {
  private unreadMessagesService = inject(UnreadMessagesService);
  private authService = inject(AuthService);
  private spinnerService = inject(SpinnerService);

  public readonly unreadMessages: Signal<number | null> = toSignal(this.unreadMessagesService.totalUnread$, {
    initialValue: 0,
  });

  constructor() {
    this.unreadMessagesService.initialize();

    this.unreadMessagesService.setInitialUnreadMessagesCount();
  }

  public onLogout(): void {
    this.spinnerService.show(this.authService.logout()).pipe(untilDestroyed(this)).subscribe();
  }
}
