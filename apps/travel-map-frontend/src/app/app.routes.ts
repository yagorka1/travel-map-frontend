import { Route } from '@angular/router';
import { notAuthenticatedGuard } from '@app/auth/lib/auth/guards/not-authenticated.guard';
import { authenticatedGuard } from '@app/auth/lib/auth/guards/authenticated.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    canActivate: [notAuthenticatedGuard],
    loadChildren: () => import('@app/auth/lib/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('./core/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
  }
];
