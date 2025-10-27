import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/lib/auth/services/auth.service';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.token;

  if (!token) return next(req);

  const clone = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(clone);
};
