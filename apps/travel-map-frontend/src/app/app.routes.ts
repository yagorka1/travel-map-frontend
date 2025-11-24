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
      import('./core/components/layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'chats',
        loadComponent: () => import('./pages/chats/components/chats/chats.component').then((m) => m.ChatsComponent),
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.routes').then((m) => m.settingsRoutes),
      },
      {
        path: 'trips',
        loadChildren: () => import('./pages/trips/trips.routes').then((m) => m.tripsRoutes),
      },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ],
  },
];
