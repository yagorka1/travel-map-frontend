import { Component, Input, inject } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  UntypedFormGroup,
  FormGroupDirective,
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { forwardRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

export interface SelectOption {
  value: any;
  label: string;
}

@UntilDestroy()
@Component({
  selector: 'lib-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
  imports: [NgClass, ReactiveFormsModule, FormsModule],
})
export class SelectComponent implements ControlValueAccessor {
  @Input()
  public id = crypto.randomUUID();

  @Input()
  public placeholder = '';

  @Input()
  public label = '';

  @Input()
  public options: SelectOption[] = [];

  @Input() formControlName = '';

  public value: any;

  private controlContainer = inject(ControlContainer);

  private translateService = inject(TranslateService);

  public onTouched = () => {
    /* empty */
  };

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public onChange = (value: any) => {
    /* empty */
  };

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    this.value = value;
    this.onChange(value);
  }

  private get form(): UntypedFormGroup | null {
    return this.controlContainer.formDirective
      ? ((this.controlContainer.formDirective as FormGroupDirective).form as FormGroup)
      : null;
  }

  public get formControl(): FormControl | null {
    return this.controlContainer.formDirective
      ? (((this.controlContainer.formDirective as FormGroupDirective).form as FormGroup)?.get(
          this.formControlName,
        ) as FormControl)
      : null;
  }

  public get isFormControlDisabled(): boolean {
    if (this.form?.get(this.formControlName)) {
      return !!this.form.get(this.formControlName)?.disabled;
    }

    return false;
  }

  public get isFormControlError(): boolean {
    if (this.formControl) {
      return !!this.formControl.errors;
    }

    return false;
  }

  public get errorMessage(): string {
    if (this.isFormControlError && this.formControl?.touched && this.formControl?.invalid) {
      let errors = '';

      const controlErrors = this.formControl.errors || {};

      for (const errorKey of Object.keys(controlErrors)) {
        errors += this.translateService.instant(`errors.${errorKey}`) + '\n';
      }

      return errors;
    }

    return '';
  }
}
