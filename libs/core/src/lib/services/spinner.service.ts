import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private loading = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();

  public show() {
    this.loading.next(true);
  }

  public hide() {
    this.loading.next(false);
  }
}
