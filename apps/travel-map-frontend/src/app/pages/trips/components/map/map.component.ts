import { Component, AfterViewInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  public map: any;

  private routePoints: L.LatLng[] = [];

  private markers: L.Marker[] = [];

  private routeLine: L.Polyline | null = null;
  private tripLines: any[] = [];

  private colors = ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#FFFF00', '#00FFFF', '#FFA500', '#800080'];

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
    console.log('renderTrips called with:', this.trips);

    // Clear existing trip lines
    this.tripLines.forEach((line) => line.remove());
    this.tripLines = [];

    if (!this.trips || this.trips.length === 0) {
      return;
    }

    // Render each trip
    this.trips.forEach((trip, index) => {
      const coordinates = trip.geometry.coordinates;
      // Convert from [lng, lat] (GeoJSON format) to [lat, lng] (Leaflet format)
      const latLngs: L.LatLngExpression[] = coordinates.map((coord) => [coord[1], coord[0]]);

      const color = this.colors[index % this.colors.length];

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

    // Fit map bounds to show all trips
    if (this.trips.length > 0) {
      const allCoords: L.LatLngExpression[] = [];
      this.trips.forEach((trip) => {
        trip.geometry.coordinates.forEach((coord) => {
          allCoords.push([coord[1], coord[0]]);
        });
      });
      const bounds = L.latLngBounds(allCoords);
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
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
