import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProfileService } from './profile.service';
import { profileApi } from '../api/profile.api';
import {
  ProfileInterface,
  UpdateProfileDto,
  ChangePasswordDto,
} from '../../pages/settings/interfaces/profile.interface';

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProfileService],
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get profile', () => {
    const mockProfile: ProfileInterface = {
      id: '1',
      name: 'John',
      email: 'john@example.com',
      avatarUrl: 'avatar.png',
      bio: 'Hello world',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
      language: 'en',
    };

    service.getProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(profileApi.getProfile);
    expect(req.request.method).toBe('GET');

    req.flush(mockProfile);
  });

  it('should update profile using FormData', () => {
    const updateDto: UpdateProfileDto = {
      name: 'New Name',
      password: '123456',
      language: 'pl',
      avatarUrl: new File(['123'], 'avatar.png'),
    };

    const mockResponse: ProfileInterface = {
      id: '1',
      name: 'New Name',
      email: 'john@example.com',
      avatarUrl: 'avatar.png',
      bio: 'Hello world',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-02T00:00:00Z',
      language: 'pl',
    };

    service.updateProfile(updateDto).subscribe((profile) => {
      expect(profile).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(profileApi.updateProfile);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body instanceof FormData).toBe(true);

    const body = req.request.body as FormData;

    expect(body.get('name')).toBe(updateDto.name);
    expect(body.get('password')).toBe(updateDto.password);
    expect(body.get('language')).toBe(updateDto.language);
    expect(body.get('avatar')).toBe(updateDto.avatarUrl);

    req.flush(mockResponse);
  });

  it('should send POST request to change password', () => {
    const dto: ChangePasswordDto = {
      currentPassword: 'old123',
      newPassword: 'new123',
      confirmPassword: 'new123',
    };

    service.changePassword(dto).subscribe((response) => {
      expect(response).toBeUndefined(); // void
    });

    const req = httpMock.expectOne(profileApi.changePassword);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);

    req.flush(null);
  });
});
