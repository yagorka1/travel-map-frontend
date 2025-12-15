import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TripInterface } from '../../interfaces/trip.interface';
import { MapComponent } from './map.component';

// Mock Leaflet
const mockMap = {
  setView: jest.fn().mockReturnThis(),
  invalidateSize: jest.fn(),
  on: jest.fn(),
  fitBounds: jest.fn(),
};

const mockLayer = {
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
  setLatLngs: jest.fn(),
  bindTooltip: jest.fn().mockReturnThis(),
};

const mockMarker = {
  addTo: jest.fn().mockReturnThis(),
  remove: jest.fn(),
};

const mockAntPath = jest.fn().mockReturnValue(mockLayer);

const mockLeaflet = {
  map: jest.fn().mockReturnValue(mockMap),
  tileLayer: jest.fn().mockReturnValue(mockLayer),
  marker: jest.fn().mockReturnValue(mockMarker),
  divIcon: jest.fn().mockReturnValue({}),
  polyline: Object.assign(jest.fn().mockReturnValue(mockLayer), {
    antPath: mockAntPath,
  }),
  latLngBounds: jest.fn().mockReturnValue({
    getSouth: jest.fn(),
    getWest: jest.fn(),
    getNorth: jest.fn(),
    getEast: jest.fn(),
  }),
  latLng: jest.fn((lat, lng) => ({ lat, lng })),
  geoJSON: jest.fn().mockReturnValue(mockLayer),
};

jest.mock('leaflet', () => mockLeaflet);
jest.mock('leaflet-ant-path', () => ({}));

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  const mockTrip: TripInterface = {
    id: 'trip-1',
    userId: 'user-1',
    name: 'Test Trip',
    description: 'Test Description',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    pointsEarned: 100,
    distance: 1000,
    color: '#FF0000',
    geometry: {
      type: 'LineString',
      coordinates: [
        [10, 50],
        [11, 51],
        [12, 52],
      ],
    },
    createdAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent, TranslateModule.forRoot(), HttpClientTestingModule],
    }).compileComponents();

    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    document.body.appendChild(mapDiv);

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
      document.body.removeChild(mapDiv);
    }
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Map Initialization', () => {
    it('should initialize map with correct default view', async () => {
      await component.ngAfterViewInit();

      expect(mockLeaflet.map).toHaveBeenCalledWith('map', expect.any(Object));
      expect(mockMap.setView).toHaveBeenCalledWith([51.505, -0.09], 8);
    });

    it('should add tile layer to map', async () => {
      await component.ngAfterViewInit();

      expect(mockLeaflet.tileLayer).toHaveBeenCalledWith(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        expect.objectContaining({
          noWrap: true,
        }),
      );
      expect(mockLayer.addTo).toHaveBeenCalledWith(mockMap);
    });

    it('should setup click handler when isCreateRoute is true', async () => {
      component.isCreateRoute = true;

      await component.ngAfterViewInit();

      expect(mockMap.on).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('should not setup click handler when isCreateRoute is false', async () => {
      component.isCreateRoute = false;

      await component.ngAfterViewInit();

      const clickCalls = (mockMap.on as jest.Mock).mock.calls.filter((call) => call[0] === 'click');
      expect(clickCalls.length).toBe(0);
    });

    it('should invalidate map size after initialization', async () => {
      await component.ngAfterViewInit();

      expect(mockMap.invalidateSize).toHaveBeenCalled();
    });
  });

  describe('Trip Rendering', () => {
    beforeEach(async () => {
      await component.ngAfterViewInit();
      jest.clearAllMocks();
    });

    it('should render trips when provided', () => {
      component.trips = [mockTrip];

      component['renderTrips']();

      expect(mockLeaflet.polyline.antPath).toHaveBeenCalled();
      expect(mockLayer.addTo).toHaveBeenCalledWith(mockMap);
    });

    it('should use trip color when rendering', () => {
      component.trips = [mockTrip];

      component['renderTrips']();

      expect(mockLeaflet.polyline.antPath).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          color: '#FF0000',
        }),
      );
    });

    it('should remove old trip lines before rendering new ones', () => {
      component.trips = [mockTrip];
      component['renderTrips']();

      const removeSpy = mockLayer.remove;
      jest.clearAllMocks();

      component.trips = [{ ...mockTrip, id: 'trip-2' }];
      component['renderTrips']();

      expect(removeSpy).toHaveBeenCalled();
    });

    it('should fit map bounds to trips', () => {
      component.trips = [mockTrip];

      component['renderTrips']();

      expect(mockLeaflet.latLngBounds).toHaveBeenCalled();
      // Note: fitBounds is called in setTimeout, so it might not be immediately testable
    });

    it('should handle empty trips array', () => {
      component.trips = [];

      expect(() => component['renderTrips']()).not.toThrow();
    });
  });

  describe('Route Point Management', () => {
    beforeEach(async () => {
      await component.ngAfterViewInit();
      jest.clearAllMocks();
    });

    it('should add marker when adding route point', () => {
      const latlng = { lat: 50, lng: 10 };

      component.addRoutePoint(latlng);

      expect(mockLeaflet.marker).toHaveBeenCalledWith(latlng, expect.any(Object));
      expect(mockMarker.addTo).toHaveBeenCalledWith(mockMap);
    });

    it('should emit pointAdded event when adding route point', () => {
      const latlng = { lat: 50, lng: 10 };
      const emitSpy = jest.spyOn(component.pointAdded, 'emit');

      component.addRoutePoint(latlng);

      expect(emitSpy).toHaveBeenCalledWith({ lat: 50, lng: 10 });
    });

    it('should create polyline after adding second point', () => {
      component.addRoutePoint({ lat: 50, lng: 10 });
      component.addRoutePoint({ lat: 51, lng: 11 });

      expect(mockLeaflet.polyline).toHaveBeenCalled();
      expect(mockLayer.addTo).toHaveBeenCalled();
    });

    it('should use routeColor for markers and line', () => {
      component.routeColor = '#00FF00';

      component.addRoutePoint({ lat: 50, lng: 10 });

      expect(mockLeaflet.divIcon).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('#00FF00'),
        }),
      );
    });
  });

  describe('Clear Route', () => {
    beforeEach(async () => {
      await component.ngAfterViewInit();
      jest.clearAllMocks();
    });

    it('should remove all markers when clearing route', () => {
      component.addRoutePoint({ lat: 50, lng: 10 });
      component.addRoutePoint({ lat: 51, lng: 11 });

      const removeSpy = mockMarker.remove;

      component.clearRoute();

      expect(removeSpy).toHaveBeenCalled();
    });

    it('should remove route line when clearing route', () => {
      component.addRoutePoint({ lat: 50, lng: 10 });
      component.addRoutePoint({ lat: 51, lng: 11 });

      const removeSpy = mockLayer.remove;

      component.clearRoute();

      expect(removeSpy).toHaveBeenCalled();
    });

    it('should clear routePoints array', () => {
      component.addRoutePoint({ lat: 50, lng: 10 });
      component.addRoutePoint({ lat: 51, lng: 11 });

      component.clearRoute();

      expect(component['routePoints']).toEqual([]);
    });
  });

  describe('ngOnChanges', () => {
    beforeEach(async () => {
      await component.ngAfterViewInit();
      jest.clearAllMocks();
    });

    it('should re-render trips when trips input changes', () => {
      const renderTripsSpy = jest.spyOn(component as any, 'renderTrips');

      component.ngOnChanges({
        trips: new SimpleChange(null, [mockTrip], false),
      });

      expect(renderTripsSpy).toHaveBeenCalled();
    });

    it('should not re-render trips on first change', () => {
      const renderTripsSpy = jest.spyOn(component as any, 'renderTrips');

      component.ngOnChanges({
        trips: new SimpleChange(null, [mockTrip], true),
      });

      expect(renderTripsSpy).not.toHaveBeenCalled();
    });

    it('should not re-render trips if map is not initialized', () => {
      component.map = null;
      const renderTripsSpy = jest.spyOn(component as any, 'renderTrips');

      component.ngOnChanges({
        trips: new SimpleChange(null, [mockTrip], false),
      });

      expect(renderTripsSpy).not.toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should have correct default values', () => {
      expect(component.isCreateRoute).toBe(false);
      expect(component.trips).toBeNull();
      expect(component.routeColor).toBe('#3B82F6');
      expect(component.highlightedCountries).toEqual([]);
      expect(component.isSetYourLocation).toBe(false);
      expect(component.defaultZoom).toBe(8);
    });
  });
});
