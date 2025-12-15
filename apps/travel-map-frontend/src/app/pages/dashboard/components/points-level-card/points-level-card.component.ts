import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-points-level-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './points-level-card.component.html',
  styleUrl: './points-level-card.component.scss',
})
export class PointsLevelCardComponent {
  @Input() totalPoints!: number;
  @Input() level!: number;
  @Input() progressPercentage = 0;
  @Input() pointsToNextLevel = 0;
}
