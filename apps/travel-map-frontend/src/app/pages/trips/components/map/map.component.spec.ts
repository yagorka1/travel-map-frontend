import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { TranslateModule } from '@ngx-translate/core';

jest.mock('leaflet', () => ({
  map: jest.fn().mockReturnValue({
    setView: jest.fn().mockReturnThis(),
    invalidateSize: jest.fn(),
  }),
  tileLayer: jest.fn().mockReturnValue({
    addTo: jest.fn(),
  }),
  marker: jest.fn().mockReturnValue({
    bindPopup: jest.fn().mockReturnThis(),
    addTo: jest.fn(),
  }),
}));

jest.mock('leaflet-ant-path', () => ({
  antPath: jest.fn().mockReturnValue({
    addTo: jest.fn(),
  }),
}));

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapComponent, TranslateModule.forRoot()],
    }).compileComponents();

    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    document.body.appendChild(mapDiv);

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
      document.body.removeChild(mapDiv);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
