import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { InputComponent } from '@app/core/components/input/input.component';
import { NotificationService } from '@app/core/ui/notification/services/notification.service';
import { NotificationTypeEnum } from '@app/core/ui/notification/enums/notification-type.enum';

@UntilDestroy()
@Component({
  selector: 'lib-sign-in',
  imports: [RouterLink, ReactiveFormsModule, NgOptimizedImage, TranslatePipe, InputComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent implements OnInit {
  public signInForm!: FormGroup;

  private formBuilder: FormBuilder = inject(FormBuilder);

  private authService: AuthService = inject(AuthService);

  private notificationService: NotificationService = inject(NotificationService);

  public ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.notificationService.show({
      message: 'Sign in',
      type: NotificationTypeEnum.Success,
    });
  }

  public onSubmit(): void {
    if (this.signInForm.valid) {
      this.authService.login(this.signInForm.value).pipe(untilDestroyed(this)).subscribe();
    }
  }
}
