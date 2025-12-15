import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@app/core/components/input/input.component';
import { TranslatePipe } from '@ngx-translate/core';
import { NgOptimizedImage } from '@angular/common';
import { AuthService, NotificationService, passwordMatchValidator } from '@app/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NotificationTypeEnum } from '@app/core/ui/notification/enums/notification-type.enum';

@UntilDestroy()
@Component({
  selector: 'lib-sign-up',
  imports: [RouterLink, ReactiveFormsModule, InputComponent, TranslatePipe, NgOptimizedImage],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  public signUpForm!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);

  private authService: AuthService = inject(AuthService);

  private notificationService: NotificationService = inject(NotificationService);

  public ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        name: ['', Validators.required],
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

    const { name, email, password } = this.signUpForm.value;

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
