import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import * as L from 'leaflet';
import 'leaflet-ant-path';
import { TripInterface } from '../../interfaces/trip.interface';

@Component({
  selector: 'app-map',
  imports: [CommonModule, TranslateModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnChanges {
  @Output() pointAdded = new EventEmitter<{ lat: number; lng: number }>();

  @Input() isCreateRoute = false;
  @Input() trips: TripInterface[] | null = null;
  @Input() routeColor = '#3B82F6';

  public map: any;

  private routePoints: L.LatLng[] = [];

  private markers: L.Marker[] = [];

  private routeLine: L.Polyline | null = null;
  private tripLines: any[] = [];
  private boundsFitted = false;

  private colors = ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#FFFF00', '#00FFFF', '#FFA500', '#800080'];

  public ngAfterViewInit(): void {
    const defaultCoords: [number, number] = [51.505, -0.09];

    this.map = L.map('map', {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
    }).setView(defaultCoords, 8);
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

    if (this.trips && this.trips.length > 0) {
      this.renderTrips();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['trips'] && !changes['trips'].firstChange && this.map) {
      this.renderTrips();
    }
  }

  private renderTrips(): void {
    this.tripLines.forEach((line) => line.remove());
    this.tripLines = [];

    if (!this.trips || this.trips.length === 0) {
      return;
    }

    this.trips.forEach((trip, index) => {
      const coordinates = trip.geometry.coordinates;
      const latLngs: L.LatLngExpression[] = coordinates.map((coord) => [coord[1], coord[0]]);

      const color = trip.color || this.colors[index % this.colors.length];

      const tripLine = (L.polyline as any)
        .antPath(latLngs, {
          color: color,
          weight: 4,
          opacity: 0.7,
          delay: 800,
        })
        .addTo(this.map);

      this.tripLines.push(tripLine);
    });

    if (this.trips.length > 0 && !this.boundsFitted) {
      const allCoords: L.LatLngExpression[] = [];
      this.trips.forEach((trip) => {
        trip.geometry.coordinates.forEach((coord) => {
          allCoords.push([coord[1], coord[0]]);
        });
      });
      const bounds = L.latLngBounds(allCoords);

      setTimeout(() => {
        this.map.fitBounds(bounds, {
          padding: [80, 80],
          maxZoom: 15,
        });
      }, 100);

      this.boundsFitted = true;
    }
  }

  public addRoutePoint(latlng: L.LatLng) {
    const marker = L.marker(latlng, {
      icon: L.divIcon({
        className: 'route-marker',
        html: `<div style="background-color: ${this.routeColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
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
          color: this.routeColor,
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
