import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from '../map/map.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripsService } from '../../services/trips.service';
import { CreateTripInterface } from '../../interfaces/create-trip.interface';
import { Router } from '@angular/router';
import { InputComponent, NotificationService, dateRangeValidator } from '@app/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NotificationTypeEnum } from '@app/core/ui/notification/enums/notification-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { TripInterface } from '../../interfaces/trip.interface';

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

  public form = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      startDate: new FormControl<Date | null>(null, [Validators.required]),
      endDate: new FormControl<Date | null>(null, [Validators.required]),
      points: new FormControl<{ lat: number; lng: number }[]>([], [Validators.required]),
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
      this.tripsService
        .createTrip(this.form.value as CreateTripInterface)
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
