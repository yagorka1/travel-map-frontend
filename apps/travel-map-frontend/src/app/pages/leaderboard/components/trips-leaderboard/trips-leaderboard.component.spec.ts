import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TripsLeaderboardComponent } from './trips-leaderboard.component';
import { provideRouter } from '@angular/router';
import { LeaderboardService } from '../../services/leaderboard.service';
import { of } from 'rxjs';
import { SpinnerService } from '@app/core';
import { LeaderboardTrip } from '../../interfaces/leaderboard.interface';
import { By } from '@angular/platform-browser';

const tripsMock: LeaderboardTrip[] = [
  {
    id: '1',
    name: 'Trip 1',
    points: 100,
    distance: 15000,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-05'),
    userId: 'u1',
    userName: 'John Doe',
  },
  {
    id: '2',
    name: 'Trip 2',
    points: 80,
    distance: 12000,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-05'),
    userId: 'u2',
    userName: 'Jane Doe',
  },
];

const leaderboardServiceMock = {
  getTopTrips: () => of(tripsMock),
};

const spinnerServiceMock = {
  show: (obs: any) => obs,
};

describe('TripsLeaderboardComponent', () => {
  let component: TripsLeaderboardComponent;
  let fixture: ComponentFixture<TripsLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsLeaderboardComponent, TranslateModule.forRoot()],
      providers: [
        { provide: LeaderboardService, useValue: leaderboardServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripsLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate trips$ on init', (done) => {
    component.trips$?.subscribe((trips) => {
      expect(trips.length).toBe(2);
      expect(trips[0].name).toBe('Trip 1');
      done();
    });
  });

  it('should render trip rows correctly', () => {
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);

    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent).toContain('1');
    expect(firstRowCells[1].nativeElement.textContent).toContain('Trip 1');
    expect(firstRowCells[2].nativeElement.textContent).toContain('100');
    expect(firstRowCells[3].nativeElement.textContent).toContain('15.00');
    expect(firstRowCells[4].nativeElement.textContent).toContain('Jan 1');
    expect(firstRowCells[5].nativeElement.textContent).toContain('Jan 5');
    expect(firstRowCells[6].nativeElement.textContent).toContain('John Doe');
  });

  it('should handle empty trips list', () => {
    component.trips$ = of([]);
    fixture.detectChanges();

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(0);
  });
});
