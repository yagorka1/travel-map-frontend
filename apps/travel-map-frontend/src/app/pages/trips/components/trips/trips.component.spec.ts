import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripsComponent } from './trips.component';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from '../map/map.component';
import { Component, Input } from '@angular/core';
import { TripsListComponent } from '../trips-list/trips-list.component';
import { TripsService } from '../../services/trips.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

// Mock MapComponent
@Component({
  selector: 'app-map',
  template: '<div></div>',
  standalone: true,
})
class MockMapComponent {
  @Input() trips: unknown;
}

@Component({
  selector: 'app-trips-list',
  template: '<div></div>',
  standalone: true,
})
class MockTripsListComponent {}

class MockTripsService {
  getTrips() {
    return of([]);
  }
}

describe('TripsComponent', () => {
  let component: TripsComponent;
  let fixture: ComponentFixture<TripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsComponent, TranslateModule.forRoot(), RouterTestingModule],
    })
      .overrideComponent(TripsComponent, {
        remove: { imports: [MapComponent, TripsListComponent] },
        add: {
          imports: [MockMapComponent, MockTripsListComponent],
          providers: [{ provide: TripsService, useClass: MockTripsService }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
