import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// Polyfill for crypto.randomUUID in Node.js test environment
if (typeof crypto === 'undefined') {
  (global as any).crypto = {};
}
if (typeof crypto.randomUUID === 'undefined') {
  (crypto as any).randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const mockTranslateService = {
    currentLang: 'en',
    use: jest.fn().mockReturnValue(of({})),
    get: jest.fn().mockReturnValue(of({})),
    instant: jest.fn((key: string) => key),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideMockStore({
          initialState: {
            profile: {
              profile: null,
            },
          },
        }),
        {
          provide: TranslateService,
          useValue: mockTranslateService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
