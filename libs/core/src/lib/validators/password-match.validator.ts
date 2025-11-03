import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ PASSWORD_MISMATCH: true });
  } else if (confirmPassword) {
    control.get('confirmPassword')?.setErrors(null);
  }

  return null;
}
