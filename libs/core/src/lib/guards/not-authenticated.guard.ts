import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

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
