import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LanguageEnum, LanguageSwitcherComponent, SpinnerService, ThemeToggleComponent } from '@app/core';
import { InputComponent } from '@app/core/components/input/input.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { environment } from '@env/environment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

declare const google: any;

@UntilDestroy()
@Component({
  selector: 'lib-sign-in',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgOptimizedImage,
    TranslatePipe,
    InputComponent,
    ThemeToggleComponent,
    LanguageSwitcherComponent,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  public signInForm!: FormGroup;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private spinnerService = inject(SpinnerService);
  private route = inject(ActivatedRoute);
  private translate = inject(TranslateService);

  private googleInitialized = false;

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.loadGoogleScript$()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.initGoogle();
        this.syncGoogleButtonWithLang();
      });
  }

  private loadGoogleScript$(): Observable<void> {
    return new Observable<void>((observer) => {
      if ((window as any).google) {
        observer.next();
        observer.complete();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        observer.next();
        observer.complete();
      };

      script.onerror = () => observer.error('Google SDK failed to load');

      document.body.appendChild(script);
    });
  }

  private initGoogle(): void {
    if (this.googleInitialized) return;

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: ({ credential }: any) => {
        this.spinnerService.show(this.authService.googleLogin({ credential })).pipe(untilDestroyed(this)).subscribe();
      },
    });

    this.googleInitialized = true;
  }

  private syncGoogleButtonWithLang(): void {
    this.translate.onLangChange
      .pipe(
        map((e) => e.lang),
        distinctUntilChanged(),
        untilDestroyed(this),
      )
      .subscribe((lang) => this.renderGoogleButton(lang));

    this.renderGoogleButton(this.translate.currentLang || LanguageEnum.EN);
  }

  private renderGoogleButton(locale: string): void {
    const container = document.getElementById('google-btn');
    if (!container) return;

    container.innerHTML = '';
    container.classList.add('opacity-0');

    google.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'medium',
      locale,
    });

    requestAnimationFrame(() => {
      container.classList.remove('opacity-0');
    });
  }

  public onSubmit(): void {
    if (this.signInForm.invalid) return;

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.spinnerService
      .show(this.authService.login(this.signInForm.value, returnUrl))
      .pipe(untilDestroyed(this))
      .subscribe();
  }
}
