import { Route } from '@angular/router';
import { Auth } from '@app/auth/lib/auth/auth';

export const authRoutes: Route[] = [
  {
    path: '',
    component: Auth,
  }
];
