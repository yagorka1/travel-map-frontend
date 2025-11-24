import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripsComponent } from './trips.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { MapComponent } from '../map/map.component';

// Mock MapComponent
@Component({
  selector: 'app-map',
  template: '<div></div>',
  standalone: true,
})
class MockMapComponent {}

describe('TripsComponent', () => {
  let component: TripsComponent;
  let fixture: ComponentFixture<TripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripsComponent, RouterTestingModule, TranslateModule.forRoot()],
    })
      .overrideComponent(TripsComponent, {
        remove: { imports: [MapComponent] },
        add: { imports: [MockMapComponent] },
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
