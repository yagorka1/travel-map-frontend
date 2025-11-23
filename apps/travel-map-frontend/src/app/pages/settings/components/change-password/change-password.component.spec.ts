import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@app/core';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { NotificationTypeEnum } from '@app/core/ui/notification/enums/notification-type.enum';
import { ProfileService } from '../../../../core/services/profile.service';

@Pipe({ name: 'translate' })
class TranslatePipeMock implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}

describe('ChangePasswordComponent (Jest)', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  if (typeof global.crypto === 'undefined') {
    (global as any).crypto = {};
  }

  if (typeof global.crypto.randomUUID === 'undefined') {
    (global as any).crypto.randomUUID = () => 'test-uuid';
  }

  const translateServiceMock = {
    get: jest.fn().mockReturnValue(of('translated')),
    instant: jest.fn().mockReturnValue('translated'),
  };

  const mockNotificationService = {
    show: jest.fn(),
  };

  const mockProfileService = {
    changePassword: jest.fn(),
  };

  const validForm = {
    currentPassword: '111111',
    newPassword: '222222',
    confirmPassword: '222222',
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent, ReactiveFormsModule, TranslatePipeMock],
      providers: [
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: TranslateService, useValue: translateServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;

    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create password form on init', () => {
    expect(component.passwordForm).toBeTruthy();
    expect(component.passwordForm.controls['currentPassword']).toBeTruthy();
    expect(component.passwordForm.controls['newPassword']).toBeTruthy();
    expect(component.passwordForm.controls['confirmPassword']).toBeTruthy();
  });

  it('should NOT submit if form is invalid', () => {
    mockProfileService.changePassword.mockReturnValue(of({}));

    component.passwordForm.setValue({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    component.onSubmit();

    expect(mockProfileService.changePassword).not.toHaveBeenCalled();
  });

  it('should call profileService.changePassword and show success message', () => {
    mockProfileService.changePassword.mockReturnValue(of({}));

    component.passwordForm.setValue(validForm);
    component.onSubmit();

    expect(mockProfileService.changePassword).toHaveBeenCalledWith(validForm);
    expect(mockNotificationService.show).toHaveBeenCalledWith({
      message: 'translated',
      type: NotificationTypeEnum.Success,
    });
  });

  it('should handle error without showing success notification', () => {
    mockProfileService.changePassword.mockReturnValue(throwError(() => new Error('fail')));

    component.passwordForm.setValue(validForm);
    component.onSubmit();

    expect(mockNotificationService.show).not.toHaveBeenCalled();
    expect(component.isSubmitting).toBe(false);
  });
});
