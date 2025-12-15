declare module 'leaflet-ant-path' {
  import * as L from 'leaflet';

  export function antPath(latlngs: L.LatLngExpression[] | L.LatLngExpression[][], options?: AntPathOptions): L.Polyline;

  export interface AntPathOptions extends L.PolylineOptions {
    delay?: number;
    dashArray?: number[];
    weight?: number;
    color?: string;
    pulseColor?: string;
    paused?: boolean;
    reverse?: boolean;
    hardwareAccelerated?: boolean;
  }
}
