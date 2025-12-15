import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { tripsApi } from '../api/trips.api';
import { CreateTripInterface } from '../interfaces/create-trip.interface';
import { TripInterface } from '../interfaces/trip.interface';
import { Observable } from 'rxjs';

@Injectable()
export class TripsService {
  private http: HttpClient = inject(HttpClient);

  public createTrip(trip: Partial<CreateTripInterface>): Observable<TripInterface> {
    return this.http.post<TripInterface>(tripsApi.create, trip);
  }

  public getTrips(): Observable<TripInterface[]> {
    return this.http.get<TripInterface[]>(tripsApi.list);
  }

  public getTrip(id: string): Observable<TripInterface> {
    return this.http.get<TripInterface>(tripsApi.byId(id));
  }
}
