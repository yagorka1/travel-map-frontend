import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TripInterface } from '../../interfaces/trip.interface';
import { TripsService } from '../../services/trips.service';
import { MapComponent } from '../map/map.component';
import { SpinnerService } from '@app/core';
import { Observable } from 'rxjs';

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
  public trip$: Observable<TripInterface> | null = null;
  private spinnerService: SpinnerService = inject(SpinnerService);

  public ngOnInit(): void {
    this.trip$ = this.spinnerService.show(this.tripService.getTrip(this.id));
  }
}
