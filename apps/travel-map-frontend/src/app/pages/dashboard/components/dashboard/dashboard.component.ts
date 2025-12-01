import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { Level } from '../../../leaderboard/interfaces/levels.interface';
import { LeaderboardService } from '../../../leaderboard/services/leaderboard.service';
import { DashboardStats } from '../../interfaces/dashboard-stats.interface';
import { PointsLevelCardComponent } from '../points-level-card/points-level-card.component';
import { StatCardComponent } from '../stat-card/stat-card.component';
import { forkJoin } from 'rxjs';

interface StatCard {
  icon: string;
  titleKey: string;
  valueKey: string;
  valueParams?: any;
  iconColor: string;
}

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TranslateModule, StatCardComponent, PointsLevelCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [LeaderboardService],
})
export class DashboardComponent implements OnInit {
  private readonly leaderboardService = inject(LeaderboardService);

  public stats: StatCard[] = [];
  public totalPoints = 0;
  public level = 1;
  public progressPercentage = 0;
  public pointsToNextLevel = 0;

  public ngOnInit(): void {
    forkJoin({
      stats: this.leaderboardService.getDashboardStats(),
      levels: this.leaderboardService.getLevels(),
    })
      .pipe(untilDestroyed(this))
      .subscribe(({ stats, levels }) => {
        this.updateStats(stats, levels);
      });
  }

  private updateStats(data: DashboardStats, levels: Level[]): void {
    this.totalPoints = data.totalPoints;

    const sorted = [...levels].sort((a, b) => a.minPoints - b.minPoints);

    const currentLevel = sorted.filter((level) => level.minPoints <= data.totalPoints).slice(-1)[0];

    const nextLevel = sorted.find((level) => level.minPoints > data.totalPoints);

    this.level = currentLevel?.levelNumber ?? 1;

    if (!nextLevel) {
      this.pointsToNextLevel = 0;
      this.progressPercentage = 100;
      return;
    }

    this.pointsToNextLevel = nextLevel.minPoints - data.totalPoints;

    const levelRange = nextLevel.minPoints - currentLevel.minPoints;
    const levelProgress = data.totalPoints - currentLevel.minPoints;

    this.progressPercentage = Math.min(Math.max((levelProgress / levelRange) * 100, 0), 100);

    this.stats = [
      {
        icon: 'briefcase',
        titleKey: 'dashboard.total_trips',
        valueKey: 'dashboard.total_trips_value',
        valueParams: { count: data.totalTrips },
        iconColor: 'text-blue-500',
      },
      {
        icon: 'globe',
        titleKey: 'dashboard.total_distance',
        valueKey: 'dashboard.total_distance_value',
        valueParams: { distance: (data.totalDistance / 1000).toFixed(2) },
        iconColor: 'text-blue-500',
      },
      {
        icon: 'building',
        titleKey: 'dashboard.visited_countries',
        valueKey: 'dashboard.visited_countries_value',
        valueParams: { count: data.visitedCountries },
        iconColor: 'text-blue-500',
      },
      {
        icon: 'building',
        titleKey: 'dashboard.visited_cities',
        valueKey: 'dashboard.visited_cities_value',
        valueParams: { count: data.visitedCities },
        iconColor: 'text-blue-500',
      },
      {
        icon: 'clock',
        titleKey: 'dashboard.most_visited_city',
        valueKey: 'dashboard.most_visited_city_value',
        valueParams: data.mostVisitedCity
          ? { city: data.mostVisitedCity.name, count: data.mostVisitedCity.count }
          : { city: '-', count: 0 },
        iconColor: 'text-blue-500',
      },
      {
        icon: 'flag',
        titleKey: 'dashboard.most_visited_country',
        valueKey: 'dashboard.most_visited_country_value',
        valueParams: data.mostVisitedCountry
          ? { country: data.mostVisitedCountry.name, count: data.mostVisitedCountry.count }
          : { country: '-', count: 0 },
        iconColor: 'text-blue-500',
      },
      {
        icon: 'timer',
        titleKey: 'dashboard.avg_trip_duration',
        valueKey: 'dashboard.avg_trip_duration_value',
        valueParams: { hours: data.averageTripDuration },
        iconColor: 'text-blue-500',
      },
    ];
  }
}
