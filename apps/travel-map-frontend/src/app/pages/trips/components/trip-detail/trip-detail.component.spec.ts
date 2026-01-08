import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CommonModule } from '@angular/common';
import { SpinnerService } from '@app/core';
import { TripInterface } from '../../interfaces/trip.interface';
import { TripsService } from '../../services/trips.service';
import { TripDetailComponent } from './trip-detail.component';

@Component({
  selector: 'app-map',
  standalone: true,
  template: '<div>Mock Map</div>',
})
class MockMapComponent {
  @Input() trips: TripInterface[] | null = null;
}

describe('TripDetailComponent Integration', () => {
  let fixture: ComponentFixture<TripDetailComponent>;
  let component: TripDetailComponent;
  let tripsServiceSpy: jest.Mocked<TripsService>;

  const mockTrip: TripInterface = {
    id: '123',
    userId: 'user1',
    name: 'Test Trip',
    description: 'This is a test trip description',
    geometry: { type: 'LineString', coordinates: [] },
    distance: 1000,
    pointsEarned: 50,
    startDate: '2023-01-01',
    endDate: '2023-01-05',
    createdAt: '2023-01-01',
    color: '#ff0000',
  };

  beforeEach(async () => {
    const tripsServiceMock: jest.Mocked<TripsService> = {
      getTrip: jest.fn().mockReturnValue(of(mockTrip)),
    } as any;

    const spinnerServiceMock = {
      show: jest.fn().mockImplementation((obs) => obs),
    };

    await TestBed.configureTestingModule({
      imports: [TripDetailComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '123' } },
          },
        },
        { provide: TripsService, useValue: tripsServiceMock },
        { provide: SpinnerService, useValue: spinnerServiceMock },
      ],
    })
      .overrideComponent(TripDetailComponent, {
        set: {
          imports: [CommonModule, TranslateModule, MockMapComponent],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TripDetailComponent);
    component = fixture.componentInstance;

    tripsServiceSpy = TestBed.inject(TripsService) as jest.Mocked<TripsService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTrip with route id', () => {
    expect(tripsServiceSpy.getTrip).toHaveBeenCalledWith('123');
  });

  it('should display trip details', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('h1'));
    const description = fixture.debugElement.query(By.css('p.text-gray-900.dark\\:text-gray-500'));
    const map = fixture.debugElement.query(By.css('app-map'));

    expect(title.nativeElement.textContent).toContain('Test Trip');
    expect(description.nativeElement.textContent).toContain('This is a test trip description');
    expect(map).toBeTruthy();
    expect(map.nativeElement.textContent).toContain('Mock Map');
  });
});
