import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@app/auth/lib/auth/services/auth.service';
import { catchError, map, Observable, of } from 'rxjs';

export const authenticatedGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (authService.token) {
    return true;
  }

  return authService.refresh().pipe(
    map((success) => {
      if (success) return true;

      router.navigate(['/auth']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/auth']);
      return of(false);
    })
  );
};
