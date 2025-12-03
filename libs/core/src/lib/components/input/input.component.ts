import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, inject, Input, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NG_VALUE_ACCESSOR,
  UntypedFormGroup,
} from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'lib-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  imports: [NgClass, FormsModule],
})
export class InputComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('input') input!: ElementRef;

  @Input()
  public id = crypto.randomUUID();

  @Input()
  public type = 'text';

  @Input()
  public placeholder = '';

  @Input()
  public label = '';

  @Input()
  public autocomplete = 'off';

  @Input() formControlName = '';

  @Input() dataTestId = '';

  public value: any;

  private controlContainer = inject(ControlContainer);

  private translateService = inject(TranslateService);

  public ngAfterViewInit() {
    if (this.value) {
      this.input.nativeElement.classList.add('filled');
    }
  }

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

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
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
