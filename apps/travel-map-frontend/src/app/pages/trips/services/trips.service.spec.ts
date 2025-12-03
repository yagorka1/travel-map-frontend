import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tripsApi } from '../api/trips.api';
import { CreateTripInterface } from '../interfaces/create-trip.interface';
import { TripInterface } from '../interfaces/trip.interface';
import { TripsService } from './trips.service';

describe('TripsService', () => {
  let service: TripsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TripsService],
    });
    service = TestBed.inject(TripsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createTrip', () => {
    it('should create a new trip', () => {
      const newTrip: Partial<CreateTripInterface> = {
        name: 'Summer Vacation',
        startDate: '2024-06-01',
        endDate: '2024-06-15',
      };

      const mockResponse: TripInterface = {
        id: '1',
        name: 'Summer Vacation',
        startDate: '2024-06-01',
        endDate: '2024-06-15',
        routes: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      service.createTrip(newTrip).subscribe((trip) => {
        expect(trip).toEqual(mockResponse);
        expect(trip.id).toBe('1');
        expect(trip.name).toBe('Summer Vacation');
      });

      const req = httpMock.expectOne(tripsApi.create);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTrip);
      req.flush(mockResponse);
    });
  });

  describe('getTrips', () => {
    it('should fetch all trips', () => {
      const mockTrips: TripInterface[] = [
        {
          id: '1',
          name: 'Trip 1',
          startDate: '2024-01-01',
          endDate: '2024-01-10',
          routes: [],
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        {
          id: '2',
          name: 'Trip 2',
          startDate: '2024-02-01',
          endDate: '2024-02-10',
          routes: [],
          createdAt: '2024-02-01',
          updatedAt: '2024-02-01',
        },
      ];

      service.getTrips().subscribe((trips) => {
        expect(trips).toEqual(mockTrips);
        expect(trips.length).toBe(2);
      });

      const req = httpMock.expectOne(tripsApi.list);
      expect(req.request.method).toBe('GET');
      req.flush(mockTrips);
    });

    it('should return empty array when no trips exist', () => {
      service.getTrips().subscribe((trips) => {
        expect(trips).toEqual([]);
        expect(trips.length).toBe(0);
      });

      const req = httpMock.expectOne(tripsApi.list);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getTrip', () => {
    it('should fetch a single trip by id', () => {
      const tripId = '123';
      const mockTrip: TripInterface = {
        id: tripId,
        name: 'Specific Trip',
        startDate: '2024-03-01',
        endDate: '2024-03-15',
        routes: [
          {
            id: 'route1',
            from: 'Paris',
            to: 'London',
            distance: 344,
            points: 100,
          },
        ],
        createdAt: '2024-03-01',
        updatedAt: '2024-03-01',
      };

      service.getTrip(tripId).subscribe((trip) => {
        expect(trip).toEqual(mockTrip);
        expect(trip.id).toBe(tripId);
        expect(trip.routes.length).toBe(1);
      });

      const req = httpMock.expectOne(tripsApi.byId(tripId));
      expect(req.request.method).toBe('GET');
      req.flush(mockTrip);
    });
  });
});
