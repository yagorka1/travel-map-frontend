import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from '../map/map.component';
import { TripsListComponent } from '../trips-list/trips-list.component';
import { TripsService } from '../../services/trips.service';
import { Observable } from 'rxjs';
import { TripInterface } from '../../interfaces/trip.interface';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, MapComponent, TripsListComponent],
  providers: [TripsService],
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.scss'],
})
export class TripsComponent implements OnInit {
  private tripsService = inject(TripsService);
  public trips$: Observable<TripInterface[]> | null = null;

  ngOnInit(): void {
    this.trips$ = this.tripsService.getTrips();
  }
}
