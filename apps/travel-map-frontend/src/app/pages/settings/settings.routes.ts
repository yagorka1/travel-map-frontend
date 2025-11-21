import type { Route } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';

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
        loadComponent: () =>
          import('./components/change-password/change-password.component').then((m) => m.ChangePasswordComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'profile' },
    ],
  },
];
