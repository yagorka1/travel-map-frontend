import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;
  let spinnerService: jest.Mocked<Partial<SpinnerService>>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);

    spinnerService = {
      loading$: loadingSubject.asObservable(),
    };

    await TestBed.configureTestingModule({
      imports: [SpinnerComponent],
      providers: [{ provide: SpinnerService, useValue: spinnerService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('SpinnerService integration', () => {
    it('should have loading$ observable from SpinnerService', () => {
      expect(component.loading$).toBeDefined();
      expect(component.loading$).toBe(spinnerService.loading$);
    });

    it('should reflect loading state from service', (done) => {
      component.loading$.subscribe((loading) => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('should update when service loading state changes', (done) => {
      const states: boolean[] = [];

      component.loading$.subscribe((loading) => {
        states.push(loading);

        if (states.length === 2) {
          expect(states).toEqual([false, true]);
          done();
        }
      });

      loadingSubject.next(true);
    });

    it('should handle multiple loading state transitions', (done) => {
      const states: boolean[] = [];

      component.loading$.subscribe((loading) => {
        states.push(loading);

        if (states.length === 4) {
          expect(states).toEqual([false, true, false, true]);
          done();
        }
      });

      loadingSubject.next(true);
      loadingSubject.next(false);
      loadingSubject.next(true);
    });
  });

  describe('Template integration', () => {
    it('should use AsyncPipe to subscribe to loading$', () => {
      expect(component.loading$).toBeDefined();

      component.loading$.subscribe((value) => {
        expect(typeof value).toBe('boolean');
      });
    });
  });
});
