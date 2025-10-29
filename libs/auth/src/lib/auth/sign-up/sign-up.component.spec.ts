import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SignUpComponent, ReactiveFormsModule, RouterTestingModule], // standalone в imports
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with email, password and confirmPassword controls', () => {
    expect(component.signUpForm.contains('email')).toBe(true);
    expect(component.signUpForm.contains('password')).toBe(true);
    expect(component.signUpForm.contains('confirmPassword')).toBe(true);
  });

  it('should mark form as invalid if empty', () => {
    component.signUpForm.setValue({ email: '', password: '', confirmPassword: '' });
    expect(component.signUpForm.valid).toBe(false);
  });

  it('should not submit form if invalid', () => {
    component.signUpForm.setValue({ email: '', password: '', confirmPassword: '' });
    const consoleSpy = jest.spyOn(console, 'log');

    component.onSubmit();

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should submit form if valid', () => {
    component.signUpForm.setValue({
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });
    const consoleSpy = jest.spyOn(console, 'log');

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith('Sign Up', {
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456',
    });
  });

  it('should render submit button', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Sign Up');
  });
});
