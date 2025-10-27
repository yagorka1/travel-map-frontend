import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/lib/auth/services/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';

export const endpointInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

  const clone = req.clone({
    url: environment.apiHost + req.url
  });

  return next(clone);
};
