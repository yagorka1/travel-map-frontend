import { of, BehaviorSubject } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, SpinnerService } from '@app/core';
import { UnreadMessagesService } from '../../../../pages/chats/services/unread-messages.service';
import { AsideMenuComponent } from './aside-menu.component';

describe('AsideMenuComponent', () => {
  let component: AsideMenuComponent;
  let fixture: ComponentFixture<AsideMenuComponent>;
  let mockUnreadMessagesService: any;
  let totalUnreadSubject: BehaviorSubject<number>;
  let spinnerServiceMock: any;
  let mockAuthService: any;

  beforeEach(async () => {
    totalUnreadSubject = new BehaviorSubject<number>(0);

    mockAuthService = {
      token: 'test-token',
      userId: 'test-user-id',
      logout: jest.fn().mockReturnValue(of(null)),
    };

    spinnerServiceMock = {
      show: jest.fn((obs) => obs),
    };

    mockUnreadMessagesService = {
      initialize: jest.fn(),
      setInitialUnreadMessagesCount: jest.fn(),
      totalUnread$: totalUnreadSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [AsideMenuComponent, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        { provide: UnreadMessagesService, useValue: mockUnreadMessagesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Logout', () => {
    it('should call authService.logout and spinnerService.show when onLogout is called', () => {
      component.onLogout();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(spinnerServiceMock.show).toHaveBeenCalled();
    });
  });
});
