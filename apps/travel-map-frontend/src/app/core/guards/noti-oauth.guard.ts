import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService, HttpStatusCode } from '@app/core';

export const notOAuthGuard: CanActivateFn = (
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

      router.navigate(['/auth'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    }),
  );
};
