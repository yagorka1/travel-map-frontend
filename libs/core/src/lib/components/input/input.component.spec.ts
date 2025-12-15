import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Component, inject } from '@angular/core';

@Component({
  template: `
    <form [formGroup]="form">
      <lib-input formControlName="testField" label="Test Label" placeholder="Test Placeholder"></lib-input>
    </form>
  `,
  imports: [ReactiveFormsModule, InputComponent],
})
class TestHostComponent {
  private fb = inject(FormBuilder);
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      testField: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
}

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let translateService: jest.Mocked<Partial<TranslateService>>;

  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => 'test-uuid',
      },
    });
  });

  beforeEach(async () => {
    translateService = {
      instant: jest.fn((key: string) => `Translated: ${key}`),
    };

    await TestBed.configureTestingModule({
      imports: [InputComponent, TranslateModule.forRoot()],
      providers: [ControlContainer, { provide: TranslateService, useValue: translateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default values', () => {
      expect(component.id).toBe('test-uuid');
      expect(component.type).toBe('text');
      expect(component.placeholder).toBe('');
      expect(component.label).toBe('');
      expect(component.autocomplete).toBe('off');
      expect(component.formControlName).toBe('');
    });

    it('should accept custom type', () => {
      component.type = 'password';
      expect(component.type).toBe('password');
    });

    it('should accept custom placeholder', () => {
      component.placeholder = 'Enter text';
      expect(component.placeholder).toBe('Enter text');
    });

    it('should accept custom label', () => {
      component.label = 'Username';
      expect(component.label).toBe('Username');
    });

    it('should accept custom autocomplete', () => {
      component.autocomplete = 'email';
      expect(component.autocomplete).toBe('email');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue('test value');
      expect(component.value).toBe('test value');
    });

    it('should implement registerOnChange', () => {
      const fn = jest.fn();
      component.registerOnChange(fn);

      component.onChange('new value');
      expect(fn).toHaveBeenCalledWith('new value');
    });

    it('should implement registerOnTouched', () => {
      const fn = jest.fn();
      component.registerOnTouched(fn);

      component.onTouched();
      expect(fn).toHaveBeenCalled();
    });

    it('should call onChange when input value changes', () => {
      const onChangeSpy = jest.fn();
      component.onChange = onChangeSpy;

      const mockEvent = {
        target: {
          value: 'new value',
        },
      } as any;

      component.onInput(mockEvent);

      expect(component.value).toBe('new value');
      expect(onChangeSpy).toHaveBeenCalledWith('new value');
    });
  });

  describe('Error handling (without form)', () => {
    it('should return false for isFormControlError when no form control', () => {
      expect(component.isFormControlError).toBe(false);
    });

    it('should return false for isFormControlDisabled when no form', () => {
      expect(component.isFormControlDisabled).toBe(false);
    });

    it('should return empty string for errorMessage when no form control', () => {
      expect(component.errorMessage).toBe('');
    });

    it('should return null for formControl when no control container', () => {
      expect(component.formControl).toBeNull();
    });
  });
});

describe('InputComponent with FormGroup', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let inputComponent: InputComponent;
  let translateService: jest.Mocked<Partial<TranslateService>>;

  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => 'test-uuid-form',
      },
    });
  });

  beforeEach(async () => {
    translateService = {
      instant: jest.fn((key: string) => {
        const messages: Record<string, string> = {
          'errors.required': 'Field is required',
          'errors.minlength': 'Minimum length not met',
        };
        return messages[key] || key;
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ReactiveFormsModule, InputComponent, TranslateModule.forRoot()],
      providers: [{ provide: TranslateService, useValue: translateService }],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    const inputDebugElement = hostFixture.debugElement.query((de) => de.componentInstance instanceof InputComponent);
    inputComponent = inputDebugElement.componentInstance;
  });

  describe('Form integration', () => {
    it('should get formControl from parent form', () => {
      expect(inputComponent.formControl).toBeTruthy();
      expect(inputComponent.formControl?.value).toBe('');
    });

    it('should detect form control errors', () => {
      const control = hostComponent.form.get('testField');
      control?.markAsTouched();
      control?.setValue('');

      expect(inputComponent.isFormControlError).toBe(true);
    });

    it('should detect disabled state', () => {
      hostComponent.form.get('testField')?.disable();
      hostFixture.detectChanges();

      expect(inputComponent.isFormControlDisabled).toBe(true);
    });
  });

  describe('Error messages', () => {
    it('should return empty string when field is not touched', () => {
      hostComponent.form.get('testField')?.setValue('');

      expect(inputComponent.errorMessage).toBe('');
    });

    it('should show required error when field is touched and empty', () => {
      const control = hostComponent.form.get('testField');
      control?.markAsTouched();
      control?.setValue('');
      hostFixture.detectChanges();

      const errorMsg = inputComponent.errorMessage;
      expect(errorMsg).toContain('Field is required');
    });

    it('should show minlength error when value is too short', () => {
      const control = hostComponent.form.get('testField');
      control?.markAsTouched();
      control?.setValue('ab');
      hostFixture.detectChanges();

      const errorMsg = inputComponent.errorMessage;
      expect(errorMsg).toContain('Minimum length not met');
    });

    it('should return empty string when field is valid', () => {
      const control = hostComponent.form.get('testField');
      control?.markAsTouched();
      control?.setValue('valid value');
      hostFixture.detectChanges();

      expect(inputComponent.errorMessage).toBe('');
    });
  });
});
