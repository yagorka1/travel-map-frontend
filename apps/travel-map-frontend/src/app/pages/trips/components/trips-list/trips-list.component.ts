import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsService } from '../../services/trips.service';
import { TripInterface } from '../../interfaces/trip.interface';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-trips-list',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  providers: [TripsService],
  templateUrl: './trips-list.component.html',
  styleUrls: ['./trips-list.component.scss'],
})
export class TripsListComponent implements OnInit {
  private tripsService = inject(TripsService);
  public trips$: Observable<TripInterface[]> | null = null;

  ngOnInit(): void {
    this.trips$ = this.tripsService.getTrips();
  }
}
