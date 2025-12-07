import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpStatusCode } from '../constants/http-status-code.constant';
import { AuthService } from '../services/auth/auth.service';

export const authenticatedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): boolean | Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.token) {
    return true;
  }

  return authService.refreshWithQueue().pipe(
    map(() => true),
    catchError((err) => {
      if (err.status === HttpStatusCode.NETWORK_ERROR) {
        return of(false);
      }

      // Save the attempted URL for redirecting after login
      router.navigate(['/auth'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    }),
  );
};
