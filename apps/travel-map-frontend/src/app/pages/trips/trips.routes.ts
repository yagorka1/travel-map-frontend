import { Routes } from '@angular/router';

export const tripsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/trips/trips.component').then((m) => m.TripsComponent),
  },
  {
    path: 'new',
    loadComponent: () => import('./components/create-trip/create-trip.component').then((m) => m.CreateTripComponent),
  },
  {
    path: ':id',
    loadComponent: () => import('./components/trip-detail/trip-detail.component').then((m) => m.TripDetailComponent),
  },
];
