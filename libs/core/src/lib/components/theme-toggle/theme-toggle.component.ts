import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeEnum, ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'lib-theme-toggle',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  public readonly ThemeEnum = ThemeEnum;
  public currentTheme = toSignal(this.themeService.theme$);

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
