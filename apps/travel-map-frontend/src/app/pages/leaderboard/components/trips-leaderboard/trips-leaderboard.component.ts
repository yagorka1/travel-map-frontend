import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LeaderboardTrip } from '../../interfaces/leaderboard.interface';
import { LeaderboardService } from '../../services/leaderboard.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-trips-leaderboard',
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './trips-leaderboard.component.html',
  styleUrls: ['./trips-leaderboard.component.scss'],
})
export class TripsLeaderboardComponent implements OnInit {
  private leaderboardService = inject(LeaderboardService);
  public trips$: Observable<LeaderboardTrip[]> | null = null;

  public ngOnInit(): void {
    this.trips$ = this.leaderboardService.getTopTrips();
  }
}
