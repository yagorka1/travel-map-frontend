import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AvatarComponent } from '@app/core';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LeaderboardUser } from '../../interfaces/leaderboard.interface';
import { LeaderboardService } from '../../services/leaderboard.service';

@Component({
  selector: 'app-users-leaderboard',
  imports: [CommonModule, TranslateModule, AvatarComponent],
  templateUrl: './users-leaderboard.component.html',
  styleUrls: ['./users-leaderboard.component.scss'],
})
export class UsersLeaderboardComponent implements OnInit {
  private leaderboardService = inject(LeaderboardService);
  public users$: Observable<LeaderboardUser[]> | null = null;

  public ngOnInit(): void {
    this.users$ = this.leaderboardService.getTopUsers();
  }
}
