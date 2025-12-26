import { NgOptimizedImage } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  AuthService,
  LanguageSwitcherComponent,
  NotificationService,
  passwordMatchValidator,
  ThemeToggleComponent,
} from '@app/core';
import { InputComponent } from '@app/core/components/input/input.component';
import { NotificationTypeEnum } from '@app/core/ui/notification/enums/notification-type.enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslatePipe } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'lib-sign-up',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputComponent,
    TranslatePipe,
    ThemeToggleComponent,
    LanguageSwitcherComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  public signUpForm!: FormGroup<{
    name: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  private fb: FormBuilder = inject(FormBuilder);

  private authService: AuthService = inject(AuthService);

  private notificationService: NotificationService = inject(NotificationService);

  public ngOnInit(): void {
    this.signUpForm = this.fb.nonNullable.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator(),
      },
    );
  }

  public onSubmit(): void {
    if (this.signUpForm.invalid) return;

    const { name, email, password } = this.signUpForm.getRawValue();

    this.authService
      .signUp({ name, email, password })
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.notificationService.show({
          message: 'auth.account_created_successfully',
          type: NotificationTypeEnum.Success,
        });
      });
  }
}
