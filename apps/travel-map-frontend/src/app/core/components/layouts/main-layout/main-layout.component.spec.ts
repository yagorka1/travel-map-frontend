import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@app/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UnreadMessagesService } from '../../../../pages/chats/services/unread-messages.service';
import { loadProfile } from '../../../store/profile/profile.actions';
import { AsideMenuComponent } from '../aside-menu/aside-menu.component';
import { HeaderComponent } from '../header/header.component';
import { MainLayoutComponent } from './main-layout.component';

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    const mockAuthService = {
      token: 'test-token',
      userId: 'test-user-id',
    };

    const mockUnreadMessagesService = {
      initialize: jest.fn(),
      setInitialUnreadMessagesCount: jest.fn(),
      totalUnread$: of(0),
    };

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, RouterTestingModule, TranslatePipe, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMockStore({
          initialState: {
            profile: {
              profile: null,
            },
          },
        }),
        { provide: AuthService, useValue: mockAuthService },
        { provide: UnreadMessagesService, useValue: mockUnreadMessagesService },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadProfile action on initialization', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(loadProfile());
  });

  describe('Sidebar Methods', () => {
    it('should toggle sidebar state from false to true', () => {
      component.isSidebarOpen = false;

      component.toggleSidebar();

      expect(component.isSidebarOpen).toBe(true);
    });

    it('should toggle sidebar state from true to false', () => {
      component.isSidebarOpen = true;

      component.toggleSidebar();

      expect(component.isSidebarOpen).toBe(false);
    });

    it('should close sidebar regardless of current state', () => {
      component.isSidebarOpen = true;

      component.closeSidebar();

      expect(component.isSidebarOpen).toBe(false);
    });

    it('should keep sidebar closed when calling closeSidebar on closed sidebar', () => {
      component.isSidebarOpen = false;

      component.closeSidebar();

      expect(component.isSidebarOpen).toBe(false);
    });
  });

  describe('Template', () => {
    it('should render aside menu', () => {
      const asideMenu = fixture.debugElement.query(By.directive(AsideMenuComponent));
      expect(asideMenu).toBeTruthy();
    });

    it('should render header', () => {
      const header = fixture.debugElement.query(By.directive(HeaderComponent));
      expect(header).toBeTruthy();
    });

    it('should render router outlet', () => {
      const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });
  });
});
