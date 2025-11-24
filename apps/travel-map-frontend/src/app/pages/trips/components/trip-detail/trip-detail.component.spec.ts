import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDetailComponent } from './trip-detail.component';
import { TranslateModule } from '@ngx-translate/core';

describe('TripDetailComponent', () => {
  let component: TripDetailComponent;
  let fixture: ComponentFixture<TripDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
