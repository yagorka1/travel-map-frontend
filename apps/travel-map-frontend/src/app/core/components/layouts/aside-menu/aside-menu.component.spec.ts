import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsideMenuComponent } from './aside-menu.component';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '@app/core';
import { UnreadMessagesService } from '../../../../pages/chats/services/unread-messages.service';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('AsideMenuComponent', () => {
  let component: AsideMenuComponent;
  let fixture: ComponentFixture<AsideMenuComponent>;
  let mockUnreadMessagesService: any;
  let totalUnreadSubject: BehaviorSubject<number>;

  beforeEach(async () => {
    totalUnreadSubject = new BehaviorSubject<number>(0);

    const mockAuthService = {
      token: 'test-token',
      userId: 'test-user-id',
    };

    mockUnreadMessagesService = {
      initialize: jest.fn(),
      setInitialUnreadMessagesCount: jest.fn(),
      totalUnread$: totalUnreadSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [AsideMenuComponent, RouterTestingModule, TranslatePipe, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
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

  describe('Initialization', () => {
    it('should initialize unread messages service', () => {
      expect(mockUnreadMessagesService.initialize).toHaveBeenCalled();
    });

    it('should set initial unread messages count', () => {
      expect(mockUnreadMessagesService.setInitialUnreadMessagesCount).toHaveBeenCalled();
    });
  });

  describe('Unread Messages', () => {
    it('should update unreadMessages when service emits new value', () => {
      totalUnreadSubject.next(5);
      expect(component.unreadMessages).toBe(5);
    });

    it('should default unreadMessages to 0 if service emits null/undefined', () => {
      totalUnreadSubject.next(null as any);
      expect(component.unreadMessages).toBe(0);
    });
  });

  describe('Template', () => {
    it('should render navigation links', () => {
      const links = fixture.debugElement.queryAll(By.css('a'));
      expect(links.length).toBeGreaterThan(0);
    });
  });
});
