import {Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, ViewChild, ElementRef, ContentChildren, QueryList, Output, EventEmitter} from '@angular/core';
import {Subject, combineLatest, ReplaySubject, BehaviorSubject} from 'rxjs';
import {takeUntil, take} from 'rxjs/operators';

import {MapApiService} from './map-api.service';
import {MapOptions, GoogleMaps, GoogleMap, MouseEvent} from './map-types';
import { MarkerComponent } from './marker.component';
import {InfoWindowComponent} from './info-window.component';

/** Google Maps component */
@Component({
  selector: 'map',
  template: '<div #map></div><ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() height!: string;
  @Input() width!: string;
  @Input() set options(options: MapOptions) {
    this.options$.next(options);
  }

  @Output() click = new EventEmitter<MouseEvent>();

  @ViewChild('map', {static: true}) set _mapEl(mapEl:  ElementRef) {
    this.mapEl$.next(mapEl);
  }

  @ContentChildren(MarkerComponent) set _mapMarkers(markers: QueryList<MarkerComponent>) {
    this.markers$.next(markers.toArray());
  }

  @ContentChildren(InfoWindowComponent) set _infoWindows(infoWindows: QueryList<InfoWindowComponent>) {
    this.infoWindows$.next(infoWindows.toArray());
  }

  private readonly destroy$ = new Subject<void>();
  private readonly mapEl$ = new ReplaySubject<ElementRef>(1);
  private readonly options$ = new BehaviorSubject<MapOptions>({});
  private readonly markers$ = new ReplaySubject<MarkerComponent[]>(1);
  private readonly infoWindows$ = new ReplaySubject<InfoWindowComponent[]>(1);
  private readonly map$ = new ReplaySubject<GoogleMap>(1);

  constructor(private readonly mapApiService: MapApiService) {}

  ngOnInit() {
    const mapsApi$ = this.mapApiService.loadedApi();
    combineLatest(mapsApi$, this.mapEl$, this.options$)
    .pipe(take(1))
    .subscribe(([mapsApi, mapElRef, options]) => {
        const mapEl = mapElRef.nativeElement;
        mapEl.style.height = this.height;
        mapEl.style.width = this.width;
        const map = new mapsApi.Map(mapEl, options);
        this.map$.next(map);
        map.addListener('click', (event: MouseEvent) => {
          this.click.emit(event);
        });
    });
    combineLatest(this.map$, this.options$).pipe(takeUntil(this.destroy$)).subscribe(([map, options]) => {
      map.setOptions(options);
    });
    combineLatest(this.map$, this.markers$).pipe(takeUntil(this.destroy$)).subscribe(([map, markers]) => {
      for (let marker of markers) {
        marker.setMap(map);
      }
    });
    combineLatest(this.map$, this.infoWindows$).pipe(takeUntil(this.destroy$)).subscribe(([map, infoWindows]) => {
      for (let infoWindow of infoWindows) {
        infoWindow.setMap(map);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
