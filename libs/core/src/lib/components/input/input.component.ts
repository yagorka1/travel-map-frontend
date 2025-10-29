import { Component, forwardRef, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import type { ControlValueAccessor } from '@angular/forms';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'lib-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = crypto.randomUUID();

  @Input() public type = 'text';

  @Input() public placeholder = '';

  @Input() public label = '';

  @Input() public errorMessage = 'Invalid input';

  public value: any;

  public onChange = (_: any) => {
    console.log(_);
  };

  public onTouched = () => {
    console.log('onTouched');
  };

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.value = value;
    this.onChange(value);
  }

  public control?: FormControl;
}
