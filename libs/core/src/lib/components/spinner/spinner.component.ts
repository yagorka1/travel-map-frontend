import { Component, inject } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SpinnerService } from '../../services/spinner.service';
import { AsyncPipe } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'lib-spinner',
  imports: [
    AsyncPipe,
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  private spinnerService = inject(SpinnerService);

  public loading$ = this.spinnerService.loading$;
}
