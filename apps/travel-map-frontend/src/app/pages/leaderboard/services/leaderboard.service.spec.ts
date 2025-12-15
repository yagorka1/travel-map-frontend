import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardStats } from '../../dashboard/interfaces/dashboard-stats.interface';
import { leaderboardApi } from '../api/leaderboard.api';
import { LeaderboardTrip, LeaderboardUser } from '../interfaces/leaderboard.interface';
import { Level } from '../interfaces/levels.interface';
import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeaderboardService],
    });
    service = TestBed.inject(LeaderboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTopUsers', () => {
    it('should fetch top users from the API', () => {
      const mockUsers: LeaderboardUser[] = [
        {
          id: '1',
          name: 'User 1',
          avatar: 'avatar1.jpg',
          totalPoints: 1000,
          level: { id: '1', name: 'Explorer', minPoints: 0, maxPoints: 1000 },
        },
        {
          id: '2',
          name: 'User 2',
          avatar: 'avatar2.jpg',
          totalPoints: 800,
          level: { id: '1', name: 'Explorer', minPoints: 0, maxPoints: 1000 },
        },
      ];

      service.getTopUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
        expect(users.length).toBe(2);
      });

      const req = httpMock.expectOne(leaderboardApi.getLeaderboard);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('getTopTrips', () => {
    it('should fetch top trips from the API', () => {
      const mockTrips: LeaderboardTrip[] = [
        {
          id: '1',
          name: 'Trip 1',
          points: 500,
          user: { id: '1', name: 'User 1', avatar: 'avatar1.jpg' },
        },
        {
          id: '2',
          name: 'Trip 2',
          points: 400,
          user: { id: '2', name: 'User 2', avatar: 'avatar2.jpg' },
        },
      ];

      service.getTopTrips().subscribe((trips) => {
        expect(trips).toEqual(mockTrips);
        expect(trips.length).toBe(2);
      });

      const req = httpMock.expectOne(leaderboardApi.getLeaderboardTrips);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrips);
    });
  });

  describe('getDashboardStats', () => {
    it('should fetch dashboard stats from the API', () => {
      const mockStats: DashboardStats = {
        totalTrips: 10,
        totalDistance: 5000,
        visitedCities: 25,
        visitedCountries: 8,
        mostVisitedCity: { name: 'Paris', count: 5 },
        mostVisitedCountry: { name: 'France', count: 10 },
        averageTripDuration: 7,
        totalPoints: 1500,
        currentLevel: { id: '2', name: 'Adventurer', minPoints: 1000, maxPoints: 2000 },
        nextLevel: { id: '3', name: 'Voyager', minPoints: 2000, maxPoints: 3000 },
        progressToNextLevel: 50,
      };

      service.getDashboardStats().subscribe((stats) => {
        expect(stats).toEqual(mockStats);
        expect(stats.totalTrips).toBe(10);
        expect(stats.totalPoints).toBe(1500);
      });

      const req = httpMock.expectOne(leaderboardApi.getDashboardStats);
      expect(req.request.method).toBe('GET');
      req.flush(mockStats);
    });
  });

  describe('getLevels', () => {
    it('should fetch all levels from the API', () => {
      const mockLevels: Level[] = [
        { id: '1', name: 'Explorer', minPoints: 0, maxPoints: 1000 },
        { id: '2', name: 'Adventurer', minPoints: 1000, maxPoints: 2000 },
        { id: '3', name: 'Voyager', minPoints: 2000, maxPoints: 3000 },
      ];

      service.getLevels().subscribe((levels) => {
        expect(levels).toEqual(mockLevels);
        expect(levels.length).toBe(3);
      });

      const req = httpMock.expectOne(leaderboardApi.levels);
      expect(req.request.method).toBe('GET');
      req.flush(mockLevels);
    });
  });
});
