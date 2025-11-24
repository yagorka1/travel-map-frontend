import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import * as L from 'leaflet';
import { antPath } from 'leaflet-ant-path';

@Component({
  selector: 'app-map',
  imports: [CommonModule, TranslateModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
  map: any;

  ngAfterViewInit() {
    this.map = L.map('map').setView([43.068661, 141.350755], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.invalidateSize();

    L.marker([0, 0]).bindPopup('<b>Hello!!</b>').addTo(this.map);

    antPath(
      [
        [43.068661, 141.350755],
        [42.768651, 141.750955],
      ],
      { color: '#FF0000', weight: 5, opacity: 0.6 },
    ).addTo(this.map);

    antPath(
      [
        [43.668661, 140.250755],
        [42.368651, 141.150955],
      ],
      { color: '#0000FF', weight: 5, opacity: 0.6, reverse: true },
    ).addTo(this.map);
  }
}
