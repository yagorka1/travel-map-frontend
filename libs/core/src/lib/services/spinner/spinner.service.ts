import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private loading = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();

  private requestCount = 0;

  public show(): void;

  public show<T>(request$: Observable<T>): Observable<T>;

  public show<T>(request$?: Observable<T>): Observable<T> | void {
    if (request$) {
      this.requestCount++;

      if (this.requestCount === 1) {
        this.loading.next(true);
      }

      return request$.pipe(finalize(() => this.hide()));
    } else {
      this.requestCount++;
      if (this.requestCount === 1) {
        this.loading.next(true);
      }
    }
  }

  public hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loading.next(false);
    }
  }
}
