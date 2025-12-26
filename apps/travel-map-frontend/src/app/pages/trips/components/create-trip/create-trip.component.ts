import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dateRangeValidator, InputComponent, NotificationService } from '@app/core';
import { NotificationTypeEnum } from '@app/core/ui/notification/enums/notification-type.enum';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CreateTripInterface } from '../../interfaces/create-trip.interface';
import { TripInterface } from '../../interfaces/trip.interface';
import { TripsService } from '../../services/trips.service';
import { MapComponent } from '../map/map.component';
import { SpinnerService } from '@app/core/services/spinner/spinner.service';

@UntilDestroy()
@Component({
  selector: 'app-create-trip',
  imports: [CommonModule, TranslateModule, MapComponent, ReactiveFormsModule, InputComponent],
  providers: [TripsService],
  templateUrl: './create-trip.component.html',
  styleUrls: ['./create-trip.component.scss'],
})
export class CreateTripComponent {
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  private tripsService: TripsService = inject(TripsService);
  private router: Router = inject(Router);
  private notificationService: NotificationService = inject(NotificationService);
  private translateService: TranslateService = inject(TranslateService);
  private spinnerService: SpinnerService = inject(SpinnerService);

  private fb = inject(FormBuilder);

  public form = this.fb.group(
    {
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: this.fb.control<Date | null>(null, [Validators.required]),
      endDate: this.fb.control<Date | null>(null, [Validators.required]),
      points: [[] as { lat: number; lng: number }[], [Validators.required]],
      color: ['#3B82F6', [Validators.required]],
    },
    { validators: dateRangeValidator },
  );

  public routePoints: { lat: number; lng: number }[] = [];

  public onMapPointAdded(point: { lat: number; lng: number }) {
    this.routePoints.push(point);
    this.form.patchValue({ points: this.routePoints });
  }

  public clearRoute() {
    this.routePoints = [];
    this.form.patchValue({ points: [] });

    if (this.mapComponent) {
      this.mapComponent.clearRoute();
    }
  }

  public createTrip(): void {
    if (this.form.valid) {
      const tripData = this.form.value as CreateTripInterface;

      this.spinnerService
        .show(this.tripsService.createTrip(tripData))
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (data: TripInterface) => {
            this.notificationService.show({
              message: this.translateService.instant('trips.create_trip_success_message', {
                points: data.pointsEarned,
              }),
              type: NotificationTypeEnum.Success,
            });
            this.router.navigate(['/trips']);
          },
        });
    }
  }

  public cancel() {
    this.router.navigate(['/trips']);
  }
}
