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

@Injectable()
export class MapApiService {
  private readonly loaded$: Observable<GoogleMaps>;

  constructor(@Inject(API_KEY) apiKey: string, httpClient: HttpClient) {
    const googleWindow = window as GoogleWindow;

    if (googleWindow.google && googleWindow.google.maps) {
      const maps = googleWindow.google.maps;
      this.loaded$ = httpClient.jsonp(
        'https://maps.googleapis.com/maps/api/js?key=' + apiKey, 'callback')
        .pipe(map(() => maps), publishReplay(), refCount());
    } else {
      this.loaded$ = throwError(new Error('Failed to load Google Maps window'))
    }
  }

  loadedApi(): Observable<GoogleMaps> {
    return this.loaded$;
  }
}
