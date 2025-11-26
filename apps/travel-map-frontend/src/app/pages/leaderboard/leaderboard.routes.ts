import { Routes } from '@angular/router';

export const leaderboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/leaderboard/leaderboard.component').then((m) => m.LeaderboardComponent),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./components/users-leaderboard/users-leaderboard.component').then((m) => m.UsersLeaderboardComponent),
      },
      {
        path: 'trips',
        loadComponent: () =>
          import('./components/trips-leaderboard/trips-leaderboard.component').then((m) => m.TripsLeaderboardComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'users' },
    ],
  },
];
