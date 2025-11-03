import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AuthService, NotificationService } from '@app/core';
import { NotificationTypeEnum } from '@app/core/ui/notification/enums/notification-type.enum';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authServiceMock: any;
  let notificationServiceMock: any;

  beforeAll(() => {
    Object.defineProperty(global, 'crypto', {
      value: {
        randomUUID: () => 'test-uuid',
      },
    });
  });

  beforeEach(waitForAsync(() => {
    authServiceMock = {
      signUp: jest.fn().mockReturnValue(of({})),
    };
    notificationServiceMock = {
      show: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        SignUpComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with name, email, password and confirmPassword controls', () => {
    expect(component.signUpForm.contains('name')).toBe(true);
    expect(component.signUpForm.contains('email')).toBe(true);
    expect(component.signUpForm.contains('password')).toBe(true);
    expect(component.signUpForm.contains('confirmPassword')).toBe(true);
  });

  it('should mark form as invalid if empty', () => {
    component.signUpForm.setValue({ name: '', email: '', password: '', confirmPassword: '' });
    expect(component.signUpForm.valid).toBe(false);
  });

  it('should not call signUp if form is invalid', () => {
    component.signUpForm.setValue({ name: '', email: '', password: '', confirmPassword: '' });
    component.onSubmit();
    expect(authServiceMock.signUp).not.toHaveBeenCalled();
  });

  it('should call signUp and notificationService if form is valid', () => {
    component.signUpForm.setValue({
      name: 'test',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });

    component.onSubmit();

    expect(authServiceMock.signUp).toHaveBeenCalledWith({
      name: 'test',
      email: 'test@test.com',
      password: '123456',
    });
    expect(notificationServiceMock.show).toHaveBeenCalledWith({
      message: 'auth.account_created_successfully',
      type: NotificationTypeEnum.Success,
    });
  });
});
