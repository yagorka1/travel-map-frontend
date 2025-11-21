import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(
  passwordField = 'password',
  confirmPasswordField = 'confirmPassword',
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordField)?.value;
    const confirmPassword = control.get(confirmPasswordField)?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      control.get(confirmPasswordField)?.setErrors({ PASSWORD_MISMATCH: true });
    } else if (confirmPassword) {
      control.get(confirmPasswordField)?.setErrors(null);
    }

    return null;
  };
}
