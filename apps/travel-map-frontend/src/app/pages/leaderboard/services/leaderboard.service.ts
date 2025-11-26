import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LeaderboardTrip, LeaderboardUser } from '../interfaces/leaderboard.interface';
import { HttpClient } from '@angular/common/http';
import { leaderboardApi } from '../api/leaderboard.api';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private http = inject(HttpClient);

  public getTopUsers(): Observable<LeaderboardUser[]> {
    return this.http.get<LeaderboardUser[]>(leaderboardApi.getLeaderboard);
  }

  getTopTrips(): Observable<LeaderboardTrip[]> {
    return this.http.get<LeaderboardTrip[]>(leaderboardApi.getLeaderboardTrips);
  }
}
