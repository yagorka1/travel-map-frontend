import { Component, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
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
  @Output() pointAdded = new EventEmitter<{ lat: number; lng: number }>();

  @Input() isCreateRoute = false;

  public map: any;

  private routePoints: L.LatLng[] = [];

  private markers: L.Marker[] = [];

  private routeLine: L.Polyline | null = null;

  public ngAfterViewInit(): void {
    const defaultCoords: [number, number] = [51.505, -0.09];

    this.map = L.map('map').setView(defaultCoords, 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.invalidateSize();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords: [number, number] = [position.coords.latitude, position.coords.longitude];
          this.map.setView(userCoords, 13);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
        },
      );
    }

    if (this.isCreateRoute) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.addRoutePoint(e.latlng);
      });
    }

    // L.marker([0, 0]).bindPopup('<b>Hello!!</b>').addTo(this.map);

    // antPath(
    //   [
    //     [43.068661, 141.350755],
    //     [42.768651, 141.750955],
    //   ],
    //   { color: '#FF0000', weight: 5, opacity: 0.6 },
    // ).addTo(this.map);

    // antPath(
    //   [
    //     [43.668661, 140.250755],
    //     [42.368651, 141.150955],
    //   ],
    //   { color: '#0000FF', weight: 5, opacity: 0.6, reverse: true },
    // ).addTo(this.map);
  }

  public addRoutePoint(latlng: L.LatLng) {
    const marker = L.marker(latlng, {
      icon: L.divIcon({
        className: 'route-marker',
        html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6],
      }),
    }).addTo(this.map);

    this.markers.push(marker);
    this.routePoints.push(latlng);

    if (this.routePoints.length > 1) {
      if (this.routeLine) {
        this.routeLine.setLatLngs(this.routePoints);
      } else {
        this.routeLine = L.polyline(this.routePoints, {
          color: '#3b82f6',
          weight: 3,
          opacity: 0.7,
        }).addTo(this.map);
      }
    }

    this.pointAdded.emit({ lat: latlng.lat, lng: latlng.lng });
  }

  public clearRoute() {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    if (this.routeLine) {
      this.routeLine.remove();
      this.routeLine = null;
    }

    this.routePoints = [];
  }
}
