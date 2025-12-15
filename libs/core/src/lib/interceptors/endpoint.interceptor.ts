import type { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

export const endpointInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  if (req.url.includes('i18n') || req.url.includes('assets/geo')) {
    return next(req);
  }

  const clone = req.clone({
    url: environment.apiHost + req.url,
  });

  return next(clone);
};
