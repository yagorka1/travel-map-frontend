import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent, SelectOption } from './select.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ControlContainer, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';

@Component({
  template: `
    <form [formGroup]="form">
      <lib-select formControlName="country" label="Country" [options]="options"></lib-select>
    </form>
  `,
  imports: [ReactiveFormsModule, SelectComponent],
})
class TestHostComponent {
  private fb = inject(FormBuilder);
  form: FormGroup;
  options: SelectOption[] = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ];

  constructor() {
    this.form = this.fb.group({
      country: ['', Validators.required],
    });
  }
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;
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
      imports: [SelectComponent, TranslateModule.forRoot()],
      providers: [ControlContainer, { provide: TranslateService, useValue: translateService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default values', () => {
      expect(component.id).toBe('test-uuid');
      expect(component.placeholder).toBe('');
      expect(component.label).toBe('');
      expect(component.options).toEqual([]);
      expect(component.formControlName).toBe('');
    });

    it('should accept custom placeholder', () => {
      component.placeholder = 'Select an option';
      expect(component.placeholder).toBe('Select an option');
    });

    it('should accept custom label', () => {
      component.label = 'Country';
      expect(component.label).toBe('Country');
    });

    it('should accept options array', () => {
      const options: SelectOption[] = [
        { value: 1, label: 'Option 1' },
        { value: 2, label: 'Option 2' },
      ];
      component.options = options;
      expect(component.options).toEqual(options);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should implement writeValue', () => {
      component.writeValue('test-value');
      expect(component.value).toBe('test-value');
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

    it('should call onChange when select value changes', () => {
      const onChangeSpy = jest.fn();
      component.onChange = onChangeSpy;

      const mockEvent = {
        target: {
          value: 'selected-value',
        },
      } as any;

      component.onSelectChange(mockEvent);

      expect(component.value).toBe('selected-value');
      expect(onChangeSpy).toHaveBeenCalledWith('selected-value');
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

describe('SelectComponent with FormGroup', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let selectComponent: SelectComponent;
  let translateService: jest.Mocked<Partial<TranslateService>>;

  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => 'test-uuid-select',
      },
    });
  });

  beforeEach(async () => {
    translateService = {
      instant: jest.fn((key: string) => {
        const messages: Record<string, string> = {
          'errors.required': 'Field is required',
        };
        return messages[key] || key;
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ReactiveFormsModule, SelectComponent, TranslateModule.forRoot()],
      providers: [{ provide: TranslateService, useValue: translateService }],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    const selectDebugElement = hostFixture.debugElement.query((de) => de.componentInstance instanceof SelectComponent);
    selectComponent = selectDebugElement.componentInstance;
  });

  describe('Form integration', () => {
    it('should get formControl from parent form', () => {
      expect(selectComponent.formControl).toBeTruthy();
      expect(selectComponent.formControl?.value).toBe('');
    });

    it('should detect form control errors', () => {
      const control = hostComponent.form.get('country');
      control?.markAsTouched();
      control?.setValue('');

      expect(selectComponent.isFormControlError).toBe(true);
    });

    it('should detect disabled state', () => {
      hostComponent.form.get('country')?.disable();
      hostFixture.detectChanges();

      expect(selectComponent.isFormControlDisabled).toBe(true);
    });

    it('should have options from parent', () => {
      expect(selectComponent.options).toEqual(hostComponent.options);
      expect(selectComponent.options.length).toBe(3);
    });
  });

  describe('Error messages', () => {
    it('should return empty string when field is not touched', () => {
      hostComponent.form.get('country')?.setValue('');

      expect(selectComponent.errorMessage).toBe('');
    });

    it('should show required error when field is touched and empty', () => {
      const control = hostComponent.form.get('country');
      control?.markAsTouched();
      control?.setValue('');
      hostFixture.detectChanges();

      const errorMsg = selectComponent.errorMessage;
      expect(errorMsg).toContain('Field is required');
    });

    it('should return empty string when field is valid', () => {
      const control = hostComponent.form.get('country');
      control?.markAsTouched();
      control?.setValue('us');
      hostFixture.detectChanges();

      expect(selectComponent.errorMessage).toBe('');
    });
  });
});
