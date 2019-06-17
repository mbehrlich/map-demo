import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { InfoWindowOptions, GoogleMapsInfoWindow, GoogleMap, MVCObject, MapsEventListener } from './map-types';
import {Subject, BehaviorSubject, ReplaySubject, combineLatest} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MapApiService} from './map-api.service';

/** Google Maps Info Window component */
@Component({
  selector: 'info-window',
  template: `<div #infoWindowContent [ngStyle]="(open$ | async) ? {} : {'display': 'none'}">
               <ng-content></ng-content>
             </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoWindowComponent implements OnInit, OnDestroy {
  @Input() set options(options: InfoWindowOptions) {
    this.options$.next(options);
  }

  @Input() set open(open: boolean) {
    this.open$.next(open);
  }

  @Output() openChange = new EventEmitter<boolean>();

  @Input() set anchor(anchor: MVCObject) {
    this.anchor$.next(anchor);
  }

  @ViewChild('infoWindowContent', {static: false}) set _content(content: ElementRef) {
    this.content$.next(content.nativeElement);
  }

  private readonly destroy$ = new Subject<void>();
  private readonly options$ = new BehaviorSubject<InfoWindowOptions>({});
  private readonly open$ = new BehaviorSubject<boolean>(false);
  private readonly anchor$ = new BehaviorSubject<MVCObject|null>(null);
  private readonly content$ = new ReplaySubject<Node>(1);
  private readonly map$ = new ReplaySubject<GoogleMap>(1);
  private infoWindow?: GoogleMapsInfoWindow;
  private map?: GoogleMap;
  private closeClickListener: MapsEventListener;

  constructor(private readonly mapApiService: MapApiService) {}

  ngOnInit() {
    const mapsApi$ = this.mapApiService.loadedApi();
    combineLatest(mapsApi$, this.options$, this.content$, this.map$, this.open$, this.anchor$)
    .pipe(takeUntil(this.destroy$))
    .subscribe(([mapsApi, options, content, map, open, anchor]) => {
      if (!this.infoWindow) {
        this.infoWindow = new mapsApi.InfoWindow(options);
        this.closeClickListener = this.infoWindow.addListener('closeclick', () => {
          this.open$.next(false);
          this.openChange.emit(false);
        });
      } else {
        this.infoWindow.setOptions(options);
      }
      this.infoWindow.setContent(content);
      if (!open) {
        this.infoWindow.close();
      } else if (map) {
        this.infoWindow.open(map, anchor);
      }
    });


  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.infoWindow) {
      this.infoWindow.close();
    }
    this.closeClickListener.remove();
  }

  setMap(map: GoogleMap) {
    this.map$.next(map);
  }
}
