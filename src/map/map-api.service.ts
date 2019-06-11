import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_KEY} from './map-tokens';
import {Observable} from 'rxjs';
import {publishReplay, refCount, map} from 'rxjs/operators';
import {GoogleMaps} from './map-types';

@Injectable()
export class MapApiService {
  private readonly loaded$: Observable<GoogleMaps>;

  constructor(@Inject(API_KEY) apiKey: string, httpClient: HttpClient) {
    this.loaded$ = httpClient.jsonp(
      'https://maps.googleapis.com/maps/api/js?key=' + apiKey, 'callback')
      .pipe(map(() => window['google'].maps as GoogleMaps), publishReplay(), refCount());
  }

  loadedApi(): Observable<GoogleMaps> {
    return this.loaded$;
  }
}
