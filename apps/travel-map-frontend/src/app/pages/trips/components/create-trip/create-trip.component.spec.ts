import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NotificationService } from '@app/core';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TripsService } from '../../services/trips.service';
import { CreateTripComponent } from './create-trip.component';

@Component({
  selector: 'app-map',
  template: '<div></div>',
  standalone: true,
})
class MockMapComponent {
  @Input() isCreateRoute = false;
  @Input() routeColor = '#3B82F6';
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'lib-input',
  template: '',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockInputComponent),
      multi: true,
    },
  ],
})
class MockInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = 'text';

  // ControlValueAccessor stub implementation
  private onChange: (value: unknown) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  private value: unknown;

  writeValue(_value: unknown): void {
    this.value = _value;
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

class MockTripsService {
  createTrip() {
    return of({});
  }
}
class MockNotificationService {
  show() {
    /* empty */
  }
}
describe('CreateTripComponent', () => {
  let component: CreateTripComponent;
  let fixture: ComponentFixture<CreateTripComponent>;

  if (typeof global.crypto === 'undefined') {
    (global as any).crypto = {};
  }

  if (typeof global.crypto.randomUUID === 'undefined') {
    (global as any).crypto.randomUUID = () => 'test-uuid';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateTripComponent,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MockMapComponent,
        MockInputComponent,
      ],
      providers: [
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: TripsService, useClass: MockTripsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should be valid when all fields are filled', () => {
    const start = new Date('2025-01-01T00:00:00Z');
    const end = new Date('2025-01-02T00:00:00Z');
    component.form.patchValue({
      name: 'Test Trip',
      description: 'Test Description',
      startDate: start,
      endDate: end,
      points: [{ lat: 1, lng: 1 }],
    });
    expect(component.form.valid).toBeTruthy();
  });
});
