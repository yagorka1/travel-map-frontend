import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripsListComponent } from './trips-list.component';
import { TripsService } from '../../services/trips.service';
import { SpinnerService } from '@app/core';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { TripInterface } from '../../interfaces/trip.interface';
import { provideRouter } from '@angular/router';

describe('TripsListComponent', () => {
  let component: TripsListComponent;
  let fixture: ComponentFixture<TripsListComponent>;
  let tripsService: jest.Mocked<TripsService>;
  let spinnerService: jest.Mocked<SpinnerService>;

  const mockTrips: TripInterface[] = [
    {
      id: '1',
      userId: '1',
      name: 'Paris Trip',
      description: 'Paris Trip',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
      distance: 100,
      pointsEarned: 10,
      startDate: '2024-06-01',
      endDate: '2024-06-10',
      createdAt: '2024-06-01',
      color: 'red',
    } as TripInterface,
    {
      id: '2',
      userId: '2',
      name: 'Paris Trip',
      description: 'Paris Trip',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1],
        ],
      },
      distance: 100,
      pointsEarned: 10,
      startDate: '2024-06-01',
      endDate: '2024-06-10',
      createdAt: '2024-06-01',
      color: 'red',
    } as TripInterface,
  ];

  beforeEach(async () => {
    const tripsServiceMock = {
      getTrips: jest.fn(),
    };

    const spinnerServiceMock = {
      show: jest.fn((obs) => obs),
    };

    await TestBed.configureTestingModule({
      imports: [TripsListComponent, TranslateModule.forRoot()],
      providers: [
        { provide: TripsService, useValue: tripsServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        provideRouter([]),
      ],
    })
      .overrideComponent(TripsListComponent, {
        remove: { providers: [TripsService] },
      })
      .compileComponents();

    tripsService = TestBed.inject(TripsService) as jest.Mocked<TripsService>;
    spinnerService = TestBed.inject(SpinnerService) as jest.Mocked<SpinnerService>;

    fixture = TestBed.createComponent(TripsListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Component should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load trips on initialization', () => {
      tripsService.getTrips.mockReturnValue(of(mockTrips));

      fixture.detectChanges();

      expect(tripsService.getTrips).toHaveBeenCalledTimes(1);
      expect(spinnerService.show).toHaveBeenCalledWith(expect.any(Object));
    });

    it('trips$ should be null before initialization', () => {
      expect(component.trips$).toBeNull();
    });

    it('trips$ should contain data after loading', (done) => {
      tripsService.getTrips.mockReturnValue(of(mockTrips));

      fixture.detectChanges();

      component.trips$?.subscribe((trips) => {
        expect(trips).toEqual(mockTrips);
        expect(trips.length).toBe(2);
        done();
      });
    });
  });

  describe('Error handling', () => {
    it('should pass error through observable', (done) => {
      const error = { status: 500, statusText: 'Server Error' };
      tripsService.getTrips.mockReturnValue(throwError(() => error));

      fixture.detectChanges();

      component.trips$?.subscribe({
        next: () => {
          fail('Should not receive a successful response');
          done();
        },
        error: (err) => {
          expect(err).toEqual(error);
          done();
        },
      });
    });

    it('should handle empty array', (done) => {
      tripsService.getTrips.mockReturnValue(of([]));

      fixture.detectChanges();

      component.trips$?.subscribe((trips) => {
        expect(trips).toEqual([]);
        expect(trips.length).toBe(0);
        done();
      });
    });
  });

  describe('SpinnerService integration', () => {
    it('should wrap getTrips result in spinner', () => {
      const tripsObservable = of(mockTrips);
      tripsService.getTrips.mockReturnValue(tripsObservable);

      fixture.detectChanges();

      expect(spinnerService.show).toHaveBeenCalledTimes(1);
      expect(spinnerService.show).toHaveBeenCalledWith(tripsObservable);
    });

    it('should use result from spinnerService', () => {
      const wrappedObservable = of(mockTrips);
      tripsService.getTrips.mockReturnValue(of(mockTrips));
      spinnerService.show.mockReturnValue(wrappedObservable);

      fixture.detectChanges();

      expect(component.trips$).toBe(wrappedObservable);
    });
  });

  describe('Template integration', () => {
    it('trips$ should be available for async pipe', async () => {
      tripsService.getTrips.mockReturnValue(of(mockTrips));

      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.trips$).toBeTruthy();
    });
  });
});
