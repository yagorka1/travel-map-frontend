import type { Route } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { notOAuthGuard } from '../../core/guards/noti-oauth.guard';

export const settingsRoutes: Route[] = [
  {
    path: '',
    component: SettingsComponent,

    children: [
      {
        path: 'profile',
        loadComponent: () => import('./components/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'password',
        canActivate: [notOAuthGuard],
        loadComponent: () =>
          import('./components/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
    ],
  },
];
