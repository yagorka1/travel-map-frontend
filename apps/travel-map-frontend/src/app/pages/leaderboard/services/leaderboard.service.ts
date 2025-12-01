import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaderboardTrip, LeaderboardUser } from '../interfaces/leaderboard.interface';
import { HttpClient } from '@angular/common/http';
import { leaderboardApi } from '../api/leaderboard.api';
import { DashboardStats } from '../../dashboard/interfaces/dashboard-stats.interface';
import { Level } from '../interfaces/levels.interface';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private http = inject(HttpClient);

  public getTopUsers(): Observable<LeaderboardUser[]> {
    return this.http.get<LeaderboardUser[]>(leaderboardApi.getLeaderboard);
  }

  public getTopTrips(): Observable<LeaderboardTrip[]> {
    return this.http.get<LeaderboardTrip[]>(leaderboardApi.getLeaderboardTrips);
  }

  public getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(leaderboardApi.getDashboardStats);
  }

  public getLevels(): Observable<Level[]> {
    return this.http.get<Level[]>(leaderboardApi.levels);
  }
}
