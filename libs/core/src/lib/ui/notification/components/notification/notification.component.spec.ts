import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { NotificationInterface } from '../../interfaces/notification.interface';
import { NotificationTypeEnum } from '../../enums/notification-type.enum';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent, TranslatePipe, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;

    component.notification = {
      type: NotificationTypeEnum.Success,
      message: 'Test',
    } as NotificationInterface;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
