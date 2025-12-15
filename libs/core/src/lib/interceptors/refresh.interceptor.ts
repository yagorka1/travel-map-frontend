import type { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { authApi } from '../api/auth.api';
import { HttpStatusCode } from '../constants/http-status-code.constant';
import { AuthService } from '../services/auth/auth.service';

export const refreshInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthService);

  const authReq = auth.token ? req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } }) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (
        err.status === HttpStatusCode.UNAUTHORIZED &&
        !req.url.includes(authApi.refresh) &&
        !req.url.includes(authApi.login)
      ) {
        return auth.refreshWithQueue().pipe(
          switchMap((token) => {
            const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
            return next(cloned);
          }),
          catchError((refreshErr) => {
            auth.logout().subscribe();
            return throwError(() => refreshErr);
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
