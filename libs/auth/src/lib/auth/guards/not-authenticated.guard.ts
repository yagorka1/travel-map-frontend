import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/lib/auth/services/auth.service';
import { catchError, map, Observable, of } from 'rxjs';

export const notAuthenticatedGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.token) {
    router.navigate(['/']);
    return of(false);
  }

  return authService.refresh().pipe(
    map(() => {
      router.navigate(['/']);
      return false;
    }),
    catchError(() => {
      return of(true);
    })
  );
};
