import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { TripInterface } from '../../interfaces/trip.interface';
import { TripsService } from '../../services/trips.service';

@Component({
  selector: 'app-trips-list',
  imports: [CommonModule, TranslateModule, RouterLink],
  providers: [TripsService],
  templateUrl: './trips-list.component.html',
  styleUrls: ['./trips-list.component.scss'],
})
export class TripsListComponent implements OnInit {
  private tripsService = inject(TripsService);
  public trips$: Observable<TripInterface[]> | null = null;

  public ngOnInit(): void {
    this.trips$ = this.tripsService.getTrips();
  }
}
