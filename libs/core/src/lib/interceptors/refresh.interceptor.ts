import { inject } from '@angular/core';
import type { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError, Observable, BehaviorSubject, filter, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { authApi } from '../api/auth.api';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const refreshInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthService);

  const authReq = auth.token ? req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } }) : req;

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 && !req.url.includes(authApi.refresh) && !req.url.includes(authApi.login)) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject.next(null);

          return auth.refresh().pipe(
            switchMap(() => {
              isRefreshing = false;
              refreshSubject.next(auth.token);
              const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${auth.token}` } });
              return next(cloned);
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              auth.logout();
              return throwError(() => refreshErr);
            }),
          );
        } else {
          return refreshSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
              const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
              return next(cloned);
            }),
          );
        }
      }
      return throwError(() => err);
    }),
  );
};
