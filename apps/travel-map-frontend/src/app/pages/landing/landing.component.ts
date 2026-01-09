import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageSwitcherComponent } from '@app/core/components/language-switcher/language-switcher.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { TranslatePipe } from '@ngx-translate/core';
import { first } from 'rxjs';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, AsyncPipe, TranslatePipe, LanguageSwitcherComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingPageComponent implements OnInit {
  public authService = inject(AuthService);
  public isAuthenticated$ = this.authService.isAuthenticated$;

  public ngOnInit(): void {
    this.authService.checkSession().pipe(first()).subscribe();
  }
}
