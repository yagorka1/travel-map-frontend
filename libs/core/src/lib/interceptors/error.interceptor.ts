import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { NotificationService } from '../ui/notification/services/notification.service';
import { inject } from '@angular/core';
import { NotificationTypeEnum } from '../ui/notification/enums/notification-type.enum';
import { skipErrorNotification } from '../helpers/skip-error-notification';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!skipErrorNotification(error)) {
        notificationService.show({
          message: 'errors.' + error.error.errorCode,
          type: NotificationTypeEnum.Error,
        });
      }

      return throwError(() => error);
    }),
  );
};
