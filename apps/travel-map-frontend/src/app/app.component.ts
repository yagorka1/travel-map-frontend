import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '@app/core/components/spinner/spinner.component';
import { NotificationsComponent } from '@app/core/ui/notification/components/notifications/notifications.component';
import { LanguageService } from '@app/core';

@Component({
  imports: [RouterModule, SpinnerComponent, NotificationsComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private languageService = inject(LanguageService);

  public ngOnInit() {
    this.languageService.init();
  }
}
