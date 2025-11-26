import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent {}
