import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_KEY} from './map-tokens';
import {Observable, throwError} from 'rxjs';
import {publishReplay, refCount, map} from 'rxjs/operators';
import {GoogleMaps} from './map-types';

declare interface GoogleWindow extends Window {
  google?: {
    maps: GoogleMaps;
  };
}

function getMapsGlobal(): GoogleMaps {
  const googleWindow = window as GoogleWindow;
  if (googleWindow && googleWindow.google && googleWindow.google.maps) {
    return googleWindow.google.maps;
  }
  throw new Error('Missing Google Window');
}

@Injectable()
export class MapApiService {
  private readonly loaded$: Observable<GoogleMaps>;

  constructor(@Inject(API_KEY) apiKey: string, httpClient: HttpClient) {
    this.loaded$ = httpClient.jsonp(
      'https://maps.googleapis.com/maps/api/js?key=' + apiKey, 'callback')
      .pipe(map(getMapsGlobal), publishReplay(), refCount());
  }

  loadedApi(): Observable<GoogleMaps> {
    return this.loaded$;
  }
}
