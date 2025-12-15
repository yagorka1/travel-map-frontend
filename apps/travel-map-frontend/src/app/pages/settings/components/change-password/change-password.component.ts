import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@app/core/components/input/input.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { passwordMatchValidator, NotificationService, SpinnerService } from '@app/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NotificationTypeEnum } from '@app/core/ui/notification/enums/notification-type.enum';
import { ChangePasswordDto } from '../../../../core/interfaces/profile.interface';

@UntilDestroy()
@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule, InputComponent, TranslateModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private translateService = inject(TranslateService);
  private notificationService = inject(NotificationService);
  private spinnerService: SpinnerService = inject(SpinnerService);

  public passwordForm!: FormGroup;
  public isSubmitting = false;

  public ngOnInit(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: passwordMatchValidator('newPassword', 'confirmPassword'),
      },
    );
  }

  public onSubmit(): void {
    if (this.passwordForm.valid) {
      this.isSubmitting = true;

      const changePasswordDto: ChangePasswordDto = {
        currentPassword: this.passwordForm.value.currentPassword,
        newPassword: this.passwordForm.value.newPassword,
        confirmPassword: this.passwordForm.value.confirmPassword,
      };

      this.spinnerService
        .show(this.profileService.changePassword(changePasswordDto))
        .pipe(untilDestroyed(this))
        .subscribe({
          next: () => {
            this.isSubmitting = false;

            this.notificationService.show({
              message: this.translateService.instant('password.password_changed_success'),
              type: NotificationTypeEnum.Success,
            });
            this.passwordForm.reset();
          },
          error: () => {
            this.isSubmitting = false;
          },
        });
    }
  }
}
