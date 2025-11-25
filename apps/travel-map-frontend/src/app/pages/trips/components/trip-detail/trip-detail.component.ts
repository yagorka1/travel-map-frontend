import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { TripInterface } from '../../interfaces/trip.interface';
import { TripsService } from '../../services/trips.service';
import { MapComponent } from '../map/map.component';

@UntilDestroy()
@Component({
  selector: 'app-trip-detail',
  imports: [CommonModule, TranslateModule, MapComponent],
  providers: [TripsService],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.scss',
})
export class TripDetailComponent implements OnInit {
  private tripService: TripsService = inject(TripsService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private id: string = this.route.snapshot.params['id'];
  public trip: TripInterface | null = null;

  public ngOnInit(): void {
    this.tripService
      .getTrip(this.id)
      .pipe(untilDestroyed(this))
      .subscribe((trip: TripInterface) => {
        this.trip = trip;
      });
  }

  public get tripArray(): TripInterface[] | null {
    return this.trip ? [this.trip] : null;
  }
}
