import type { HttpEvent, HttpRequest, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { inject } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';

export const spinnerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const spinner = inject(SpinnerService);
  spinner.show();
  return next(req).pipe(finalize(() => spinner.hide()));
};
