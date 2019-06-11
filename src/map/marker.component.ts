import {Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy} from '@angular/core';
import { MapApiService } from './map-api.service';
import {BehaviorSubject, Subject, ReplaySubject, combineLatest} from 'rxjs';
import {takeUntil } from 'rxjs/operators';
import {GoogleMap, GoogleMapsMarker, MarkerOptions} from './map-types';

/** Google Maps Marker component */
@Component({
  selector: 'marker',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkerComponent implements OnInit, OnDestroy {
  @Input() set options(options: MarkerOptions) {
    this.options$.next(options);
  }

  private readonly destroy$ = new Subject<void>();
  private readonly options$ = new BehaviorSubject<MarkerOptions>({});
  private readonly map$ = new ReplaySubject<GoogleMap>(1);
  private marker?: GoogleMapsMarker;

  constructor(private readonly mapApiService: MapApiService) {}

  ngOnInit() {
    const mapsApi$ = this.mapApiService.loadedApi();
    combineLatest(mapsApi$, this.options$, this.map$).pipe(takeUntil(this.destroy$))
    .subscribe(([mapsApi, options, map]) => {
      if (!this.marker) {
        this.marker = new mapsApi.Marker(options);
        this.marker.setMap(map);
      } else {
        this.marker.setOptions(options);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  setMap(map: GoogleMap) {
    this.map$.next(map);
  }
}
