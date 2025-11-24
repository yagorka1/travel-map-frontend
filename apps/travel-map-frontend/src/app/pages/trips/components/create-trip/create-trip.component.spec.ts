import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTripComponent } from './create-trip.component';
import { TranslateModule } from '@ngx-translate/core';

describe('CreateTripComponent', () => {
  let component: CreateTripComponent;
  let fixture: ComponentFixture<CreateTripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTripComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
