import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpinnerService],
    });
    service = TestBed.inject(SpinnerService);
  });

  it('should emit false → true → false for show(request$)', (done) => {
    const emitted: boolean[] = [];

    service.loading$.subscribe((v) => emitted.push(v));

    // act - use delay to ensure async behavior
    service.show(of(null).pipe(delay(0)))!.subscribe({
      complete: () => {
        // Use setTimeout to ensure all emissions are processed
        setTimeout(() => {
          expect(emitted).toEqual([false, true, false]);
          done();
        }, 0);
      },
    });
  });

  it('should emit false → true → false for show() + hide()', () => {
    const emitted: boolean[] = [];
    service.loading$.subscribe((v) => emitted.push(v));

    service.show();
    service.hide();

    expect(emitted).toEqual([false, true, false]);
  });

  it('should handle multiple show() calls before hide()', () => {
    const emitted: boolean[] = [];
    service.loading$.subscribe((v) => emitted.push(v));

    service.show();
    service.show();
    service.hide();
    service.hide();

    expect(emitted).toEqual([false, true, false]);
  });
});
