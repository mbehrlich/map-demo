export interface GoogleMaps {
  Map: {new (mapDiv: Element, options?: MapOptions): GoogleMap};
  Marker: {new (options?: MarkerOptions): GoogleMapsMarker};
  InfoWindow: {new (options?: InfoWindowOptions): GoogleMapsInfoWindow};
  LatLng: {new (lat: number, lng: number, noWrap?: boolean): GoogleMapsLatLng};
  event: {addListener(instance: MVCObject, eventName: string, handler: Function)};
}

export interface GoogleMap extends MVCObject {
  setOptions(options: MapOptions): void;
}

export interface GoogleMapsMarker extends MVCObject {
  setOptions(options: MarkerOptions): void;
  setMap(map: GoogleMap|null): void;
}

export interface GoogleMapsInfoWindow extends MVCObject {
  open(map?: GoogleMap, anchor?: MVCObject): void;
  close(): void;
  setOptions(options: InfoWindowOptions): void;
  setContent(content: string|Node): void;
}

export interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}

export interface MVCObject {
  addListener(eventName: string, handler: Function): MapsEventListener;
}

/** MapOptions */
export interface MapOptions {
  center?: LatLngLiteral;
  zoom?: number;
}

export interface MarkerOptions {
  position?: GoogleMapsLatLng|LatLngLiteral;
}

export interface InfoWindowOptions {
  content?: string|Node;
  position?: LatLngLiteral;
}

export interface MapsEventListener {
  remove(): void;
}

/** LatLng Literal interface */
export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface MouseEvent {
  latLng: GoogleMapsLatLng;
}
