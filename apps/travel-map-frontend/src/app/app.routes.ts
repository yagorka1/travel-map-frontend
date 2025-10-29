import type { Route } from '@angular/router';
import { authenticatedGuard } from '@app/core/guards/authenticated.guard';
import { notAuthenticatedGuard } from '@app/core/guards/not-authenticated.guard';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    canActivate: [notAuthenticatedGuard],
    loadChildren: () => import('@app/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: '',
    canActivate: [authenticatedGuard],
    loadComponent: () =>
      import('./core/components/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
  },
];
