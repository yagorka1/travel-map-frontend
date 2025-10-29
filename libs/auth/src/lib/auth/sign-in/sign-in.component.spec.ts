import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignInComponent } from './sign-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@app/core/services/auth.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authService: AuthService;

  beforeEach(waitForAsync(() => {
    const authServiceMock = {
      login: jest.fn().mockReturnValue(of(true)),
    };

    TestBed.configureTestingModule({
      imports: [SignInComponent, ReactiveFormsModule, RouterTestingModule, TranslatePipe, TranslateModule.forRoot()],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with email and password controls', () => {
    expect(component.signInForm.contains('email')).toBe(true);
    expect(component.signInForm.contains('password')).toBe(true);
  });

  it('should mark form controls as invalid if empty', () => {
    component.signInForm.setValue({ email: '', password: '' });
    expect(component.signInForm.valid).toBe(false);
  });

  it('should call authService.login on valid form submit', () => {
    component.signInForm.setValue({ email: 'test@test.com', password: '123456' });
    const loginSpy = jest.spyOn(authService, 'login').mockReturnValue(of(true));

    component.onSubmit();

    expect(loginSpy).toHaveBeenCalledWith({ email: 'test@test.com', password: '123456' });
  });

  it('should not call authService.login on invalid form submit', () => {
    component.signInForm.setValue({ email: '', password: '' });
    const loginSpy = jest.spyOn(authService, 'login');

    component.onSubmit();

    expect(loginSpy).not.toHaveBeenCalled();
  });
});
