import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MapOptions, MarkerOptions, InfoWindowOptions, MouseEvent } from 'src/map/map-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly mapOptions = new BehaviorSubject<MapOptions>({center: {lat: 34, lng: 117}, zoom: 4});
  readonly markersOptions: MarkerOptions[] = [
    {position: {lat: 34, lng: 117}},
    { position: { lat: 34.1, lng: 117.1 }},
    { position: { lat: 34.2, lng: 117.2 }},
  ];
  readonly infoWindowOptions: InfoWindowOptions = {
    position: {lat: 34, lng: 117},
  };
  infoWindowOpen = false;

  addMarker(event: MouseEvent) {
    this.markersOptions.push({position: event.latLng});
  }

  removeMarker() {
    this.markersOptions.pop();
  }

  openInfoWindow() {
    this.infoWindowOpen = true;
  }
}
