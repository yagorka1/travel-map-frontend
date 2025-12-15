import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripsListComponent } from './trips-list.component';
import { TripsService } from '../../services/trips.service';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

class MockTripsService {
  getTrips() {
    return of([]);
  }
}

describe('TripsListComponent', () => {
  let component: TripsListComponent;
  let fixture: ComponentFixture<TripsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsListComponent, TranslateModule.forRoot()],
    })
      .overrideComponent(TripsListComponent, {
        add: { providers: [{ provide: TripsService, useClass: MockTripsService }] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(TripsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
