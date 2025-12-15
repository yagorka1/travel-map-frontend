import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerComponent } from '@app/core/components/spinner/spinner.component';
import { NotificationsComponent } from '@app/core/ui/notification/components/notifications/notifications.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, TranslateModule.forRoot(), SpinnerComponent, NotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Language', () => {
    it('should switch language', () => {
      const useSpy = jest.spyOn(translateService, 'use');
      component.useLanguage('fr');
      expect(useSpy).toHaveBeenCalledWith('fr');
    });
  });

  describe('Template', () => {
    it('should render router outlet', () => {
      const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
      expect(routerOutlet).toBeTruthy();
    });

    it('should render spinner', () => {
      const spinner = fixture.debugElement.query(By.directive(SpinnerComponent));
      expect(spinner).toBeTruthy();
    });

    it('should render notifications', () => {
      const notifications = fixture.debugElement.query(By.directive(NotificationsComponent));
      expect(notifications).toBeTruthy();
    });
  });
});
