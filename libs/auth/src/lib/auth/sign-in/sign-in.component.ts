import { NgOptimizedImage } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SpinnerService } from '@app/core';
import { InputComponent } from '@app/core/components/input/input.component';
import { AuthService } from '@app/core/services/auth/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslatePipe } from '@ngx-translate/core';

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
  private spinnerService: SpinnerService = inject(SpinnerService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  public ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.signInForm.valid) {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.spinnerService
        .show(this.authService.login(this.signInForm.value, returnUrl))
        .pipe(untilDestroyed(this))
        .subscribe();
    }
  }
}
