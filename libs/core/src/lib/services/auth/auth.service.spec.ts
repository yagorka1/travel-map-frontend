import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authApi } from '../../api/auth.api';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    routerMock = {
      navigate: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: routerMock }],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('token', () => {
    it('should return null initially', () => {
      expect(service.token).toBeNull();
    });

    it('should return the token after it is set', () => {
      const testToken = 'test-token-123';
      service.setToken(testToken);
      expect(service.token).toBe(testToken);
    });
  });

  describe('userId', () => {
    it('should return null when no token is set', () => {
      expect(service.userId).toBeNull();
    });

    it('should decode and return userId from token', () => {
      // JWT token with payload: { id: 'user123' }
      const mockToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      service.setToken(mockToken);
      expect(service.userId).toBe('user123');
    });
  });

  describe('setToken', () => {
    it('should set the token', () => {
      const testToken = 'new-token-456';
      service.setToken(testToken);
      expect(service.token).toBe(testToken);
    });
  });

  describe('login', () => {
    it('should login user and navigate to home', () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const mockResponse = { accessToken: 'access-token-123' };

      service.login(loginDto).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(service.token).toBe('access-token-123');
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      });

      const req = httpMock.expectOne(authApi.login);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginDto);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockResponse);
    });
  });

  describe('signUp', () => {
    it('should sign up user and navigate to home', () => {
      const signUpDto = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };
      const mockResponse = { message: 'User created successfully' };

      service.signUp(signUpDto).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
      });

      const req = httpMock.expectOne(authApi.signUp);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(signUpDto);
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockResponse);
    });
  });

  describe('refresh', () => {
    it('should refresh token', () => {
      const mockResponse = { accessToken: 'new-access-token-456' };

      service.refresh().subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(service.token).toBe('new-access-token-456');
      });

      const req = httpMock.expectOne(authApi.refresh);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should logout user and navigate to sign-in on success', () => {
      service.setToken('some-token');
      service.logout();

      expect(service.token).toBeNull();

      const req = httpMock.expectOne(authApi.logout);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      expect(req.request.withCredentials).toBe(true);
      req.flush({});

      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
    });

    it('should navigate to sign-in even on logout error', () => {
      service.setToken('some-token');
      service.logout();

      expect(service.token).toBeNull();

      const req = httpMock.expectOne(authApi.logout);
      req.error(new ProgressEvent('error'));

      expect(routerMock.navigate).toHaveBeenCalledWith(['/auth/sign-in']);
    });
  });
});
