import { NotificationTypeEnum } from '../enums/notification-type.enum';

export interface NotificationInterface {
  message: string;
  type: NotificationTypeEnum;
  duration?: number;
  notHiding?: boolean;
}
