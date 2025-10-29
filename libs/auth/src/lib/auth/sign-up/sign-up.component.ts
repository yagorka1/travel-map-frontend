import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'lib-sign-up',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  public signUpForm!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);

  public ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.signUpForm.invalid) return;
    console.log('Sign Up', this.signUpForm.value);
  }
}
