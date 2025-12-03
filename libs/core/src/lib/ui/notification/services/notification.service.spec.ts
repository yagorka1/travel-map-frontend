import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { NotificationInterface } from '../interfaces/notification.interface';
import { NotificationTypeEnum } from '../enums/notification-type.enum';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty notifications list', () => {
    expect(service.notificationsList()).toEqual([]);
  });

  it('should add a notification to the list', () => {
    const notification: NotificationInterface = {
      type: NotificationTypeEnum.Success,
      message: 'Test notification',
    };

    service.show(notification);

    expect(service.notificationsList().length).toBe(1);
    expect(service.notificationsList()[0]).toEqual(notification);
  });

  it('should add multiple notifications to the list', () => {
    const notification1: NotificationInterface = {
      type: NotificationTypeEnum.Success,
      message: 'First notification',
    };
    const notification2: NotificationInterface = {
      type: NotificationTypeEnum.Error,
      message: 'Second notification',
    };

    service.show(notification1);
    service.show(notification2);

    expect(service.notificationsList().length).toBe(2);
    expect(service.notificationsList()[0]).toEqual(notification1);
    expect(service.notificationsList()[1]).toEqual(notification2);
  });

  it('should remove a notification by index', () => {
    const notification1: NotificationInterface = {
      type: NotificationTypeEnum.Success,
      message: 'First notification',
    };
    const notification2: NotificationInterface = {
      type: NotificationTypeEnum.Error,
      message: 'Second notification',
    };
    const notification3: NotificationInterface = {
      type: NotificationTypeEnum.Info,
      message: 'Third notification',
    };

    service.show(notification1);
    service.show(notification2);
    service.show(notification3);

    service.remove(1);

    expect(service.notificationsList().length).toBe(2);
    expect(service.notificationsList()[0]).toEqual(notification1);
    expect(service.notificationsList()[1]).toEqual(notification3);
  });

  it('should remove the first notification', () => {
    const notification1: NotificationInterface = {
      type: NotificationTypeEnum.Success,
      message: 'First notification',
    };
    const notification2: NotificationInterface = {
      type: NotificationTypeEnum.Error,
      message: 'Second notification',
    };

    service.show(notification1);
    service.show(notification2);

    service.remove(0);

    expect(service.notificationsList().length).toBe(1);
    expect(service.notificationsList()[0]).toEqual(notification2);
  });

  it('should remove the last notification', () => {
    const notification1: NotificationInterface = {
      type: NotificationTypeEnum.Success,
      message: 'First notification',
    };
    const notification2: NotificationInterface = {
      type: NotificationTypeEnum.Error,
      message: 'Second notification',
    };

    service.show(notification1);
    service.show(notification2);

    service.remove(1);

    expect(service.notificationsList().length).toBe(1);
    expect(service.notificationsList()[0]).toEqual(notification1);
  });

  it('should handle removing from empty list gracefully', () => {
    service.remove(0);
    expect(service.notificationsList().length).toBe(0);
  });
});
