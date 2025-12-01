import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
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
  @Input() highlightedCountries: string[] = [];
  @Input() isSetYourLocation = false;
  @Input() defaultZoom = 8;

  private http: HttpClient = inject(HttpClient);

  public map: any;
  private L: any;

  private routePoints: any[] = [];

  private markers: any[] = [];

  private routeLine: any | null = null;
  private tripLines: any[] = [];
  private boundsFitted = false;

  private colors = ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#FFFF00', '#00FFFF', '#FFA500', '#800080'];

  public async ngAfterViewInit(): Promise<void> {
    // Dynamic import of Leaflet libraries
    await this.loadLeaflet();
    const defaultCoords: [number, number] = [51.505, -0.09];

    // Define world bounds to prevent map repetition
    const worldBounds = this.L.latLngBounds(
      this.L.latLng(-90, -180), // Southwest corner
      this.L.latLng(90, 180), // Northeast corner
    );

    this.map = this.L.map('map', {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      touchZoom: true,
      maxBounds: worldBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 2,
    }).setView(defaultCoords, this.defaultZoom);
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      noWrap: true,
    }).addTo(this.map);

    this.map.invalidateSize();

    if (this.isSetYourLocation && navigator.geolocation) {
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
      this.map.on('click', (e: any) => {
        this.addRoutePoint(e.latlng);
      });
    }

    if (this.trips && this.trips.length > 0) {
      this.renderTrips();
    }

    if (this.highlightedCountries && this.highlightedCountries.length > 0) {
      this.renderCountries();
    }
  }

  private async loadLeaflet(): Promise<void> {
    const [leaflet] = await Promise.all([import('leaflet'), import('leaflet-ant-path')]);
    this.L = leaflet.default || leaflet;
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
      const latLngs: any[] = coordinates.map((coord) => [coord[1], coord[0]]);

      const color = trip.color || this.colors[index % this.colors.length];

      const tripLine = (this.L.polyline as any)
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
      const allCoords: any[] = [];
      this.trips.forEach((trip) => {
        trip.geometry.coordinates.forEach((coord) => {
          allCoords.push([coord[1], coord[0]]);
        });
      });
      const bounds = this.L.latLngBounds(allCoords);

      setTimeout(() => {
        this.map.fitBounds(bounds, {
          padding: [80, 80],
          maxZoom: 15,
        });
      }, 100);

      this.boundsFitted = true;
    }
  }

  public addRoutePoint(latlng: any) {
    const marker = this.L.marker(latlng, {
      icon: this.L.divIcon({
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
        this.routeLine = this.L.polyline(this.routePoints, {
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

  private renderCountries() {
    this.http.get('assets/geo/countries.geo.json').subscribe((data: any) => {
      this.L.geoJSON(data, {
        style: (feature: any) => {
          const countryName = feature.properties.name;
          console.log(countryName);

          return {
            fillColor: this.highlightedCountries.includes(countryName) ? '#3478f6' : '#cccccc',
            fillOpacity: this.highlightedCountries.includes(countryName) ? 0.7 : 0.2,
            color: '#444',
            weight: 1,
          };
        },
        onEachFeature: (feature: any, layer: any) => {
          layer.bindTooltip(feature.properties.name, { permanent: false, direction: 'top' });
        },
      }).addTo(this.map);
    });
  }
}
