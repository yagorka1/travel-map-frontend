import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '@app/core/components/spinner/spinner.component';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsComponent } from '@app/core/ui/notification/components/notifications/notifications.component';

@Component({
  imports: [RouterModule, SpinnerComponent, NotificationsComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private translate = inject(TranslateService);

  public useLanguage(language: string): void {
    this.translate.use(language);
  }
}
