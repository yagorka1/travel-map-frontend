import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpinnerService } from '@app/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Level } from '../../../leaderboard/interfaces/levels.interface';
import { LeaderboardService } from '../../../leaderboard/services/leaderboard.service';
import { DashboardStats } from '../../interfaces/dashboard-stats.interface';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockLeaderboardService: jest.Mocked<Partial<LeaderboardService>>;
  let mockSpinnerService: jest.Mocked<Partial<SpinnerService>>;

  const mockDashboardStats: DashboardStats = {
    totalTrips: 10,
    totalDistance: 50000,
    visitedCities: 15,
    visitedCountries: 5,
    mostVisitedCity: { name: 'Paris', count: 3 },
    mostVisitedCountry: { name: 'France', count: 5 },
    averageTripDuration: 48,
    totalPoints: 250,
    visitedCountriesList: ['France', 'Germany', 'Italy'],
  };

  const mockLevels: Level[] = [
    { id: '1', levelNumber: 1, name: 'Beginner', minPoints: 0, description: 'New traveler' },
    { id: '2', levelNumber: 2, name: 'Intermediate', minPoints: 100, description: 'Experienced traveler' },
    { id: '3', levelNumber: 3, name: 'Advanced', minPoints: 200, description: 'Seasoned traveler' },
    { id: '4', levelNumber: 4, name: 'Expert', minPoints: 500, description: 'Master traveler' },
  ];

  beforeEach(async () => {
    mockLeaderboardService = {
      getDashboardStats: jest.fn().mockReturnValue(of(mockDashboardStats)),
      getLevels: jest.fn().mockReturnValue(of(mockLevels)),
    };

    mockSpinnerService = {
      show: jest.fn().mockImplementation((obs) => obs),
    };

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule, TranslatePipe, TranslateModule.forRoot()],
    })
      .overrideComponent(DashboardComponent, {
        set: {
          providers: [
            { provide: LeaderboardService, useValue: mockLeaderboardService },
            { provide: SpinnerService, useValue: mockSpinnerService },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call spinner service with forkJoin of stats and levels', () => {
      fixture.detectChanges();

      expect(mockSpinnerService.show).toHaveBeenCalled();
      expect(mockLeaderboardService.getDashboardStats).toHaveBeenCalled();
      expect(mockLeaderboardService.getLevels).toHaveBeenCalled();
    });

    it('should update stats and highlighted countries after loading data', () => {
      fixture.detectChanges();

      expect(component.stats.length).toBeGreaterThan(0);
      expect(component.highlightedCountries).toEqual(['France', 'Germany', 'Italy']);
      expect(component.totalPoints).toBe(250);
    });
  });

  describe('updateStats', () => {
    it('should calculate current level correctly', () => {
      component['updateStats'](mockDashboardStats, mockLevels);

      expect(component.level).toBe(3); // 250 points = level 3 (Advanced)
      expect(component.totalPoints).toBe(250);
    });

    it('should calculate next level and progress correctly', () => {
      component['updateStats'](mockDashboardStats, mockLevels);

      expect(component.pointsToNextLevel).toBe(250); // 500 - 250 = 250
      expect(component.progressPercentage).toBeCloseTo(16.67, 1); // (250-200)/(500-200) * 100
    });

    it('should handle user at max level', () => {
      const maxLevelStats: DashboardStats = { ...mockDashboardStats, totalPoints: 600 };

      component['updateStats'](maxLevelStats, mockLevels);

      expect(component.level).toBe(4);
      expect(component.pointsToNextLevel).toBe(0);
      expect(component.progressPercentage).toBe(100);
    });

    it('should handle user at minimum level', () => {
      const minLevelStats: DashboardStats = { ...mockDashboardStats, totalPoints: 50 };

      component['updateStats'](minLevelStats, mockLevels);

      expect(component.level).toBe(1);
      expect(component.pointsToNextLevel).toBe(50); // 100 - 50
      expect(component.progressPercentage).toBeCloseTo(50, 1); // (50-0)/(100-0) * 100
    });

    it('should handle user exactly at level threshold', () => {
      const exactLevelStats: DashboardStats = { ...mockDashboardStats, totalPoints: 200 };

      component['updateStats'](exactLevelStats, mockLevels);

      expect(component.level).toBe(3);
      expect(component.pointsToNextLevel).toBe(300); // 500 - 200
      expect(component.progressPercentage).toBe(0);
    });

    it('should generate stats cards with correct data', () => {
      component['updateStats'](mockDashboardStats, mockLevels);

      expect(component.stats).toHaveLength(7);
      expect(component.stats[0].titleKey).toBe('dashboard.total_trips');
      expect(component.stats[0].valueParams).toEqual({ count: 10 });
      expect(component.stats[1].titleKey).toBe('dashboard.total_distance');
      expect(component.stats[1].valueParams).toEqual({ distance: '50.00' });
    });

    it('should handle null mostVisitedCity', () => {
      const statsWithoutCity: DashboardStats = {
        ...mockDashboardStats,
        mostVisitedCity: null as any,
      };

      component['updateStats'](statsWithoutCity, mockLevels);

      const cityCard = component.stats.find((s) => s.titleKey === 'dashboard.most_visited_city');
      expect(cityCard?.valueParams).toEqual({ city: '-', count: 0 });
    });

    it('should handle null mostVisitedCountry', () => {
      const statsWithoutCountry: DashboardStats = {
        ...mockDashboardStats,
        mostVisitedCountry: null as any,
      };

      component['updateStats'](statsWithoutCountry, mockLevels);

      const countryCard = component.stats.find((s) => s.titleKey === 'dashboard.most_visited_country');
      expect(countryCard?.valueParams).toEqual({ country: '-', count: 0 });
    });

    it('should format distance correctly in kilometers', () => {
      const statsWithDistance: DashboardStats = {
        ...mockDashboardStats,
        totalDistance: 123456,
      };

      component['updateStats'](statsWithDistance, mockLevels);

      const distanceCard = component.stats.find((s) => s.titleKey === 'dashboard.total_distance');
      expect(distanceCard?.valueParams).toEqual({ distance: '123.46' });
    });

    it('should handle empty levels array', () => {
      component['updateStats'](mockDashboardStats, []);

      expect(component.level).toBe(1);
      expect(component.progressPercentage).toBe(100);
      expect(component.pointsToNextLevel).toBe(0);
    });

    it('should sort levels by minPoints before calculating', () => {
      const unsortedLevels: Level[] = [
        { id: '4', levelNumber: 4, name: 'Expert', minPoints: 500, description: 'Master' },
        { id: '1', levelNumber: 1, name: 'Beginner', minPoints: 0, description: 'Beginner' },
        { id: '3', levelNumber: 3, name: 'Advanced', minPoints: 200, description: 'Advanced' },
        { id: '2', levelNumber: 2, name: 'Intermediate', minPoints: 100, description: 'Intermediate' },
      ];

      component['updateStats'](mockDashboardStats, unsortedLevels);

      expect(component.level).toBe(3);
    });
  });

  describe('Component State', () => {
    it('should have initial default values', () => {
      expect(component.stats).toEqual([]);
      expect(component.totalPoints).toBe(0);
      expect(component.level).toBe(1);
      expect(component.progressPercentage).toBe(0);
      expect(component.pointsToNextLevel).toBe(0);
      expect(component.highlightedCountries).toEqual([]);
    });
  });
});
