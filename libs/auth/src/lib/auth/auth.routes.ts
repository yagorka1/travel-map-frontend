import { Route } from '@angular/router';
import { AuthComponent } from '@app/auth/lib/auth/auth.component';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
  }
];
