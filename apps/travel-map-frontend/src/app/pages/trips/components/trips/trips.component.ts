import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-trips',
  imports: [CommonModule, RouterLink, TranslateModule, MapComponent],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
})
export class TripsComponent {}
