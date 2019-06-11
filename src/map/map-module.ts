import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClientModule, HttpClientJsonpModule} from '@angular/common/http';
import {MapComponent} from './map.component';
import {API_KEY} from './map-tokens';
import {MapApiService} from './map-api.service';
import { MarkerComponent } from './marker.component';
import {InfoWindowComponent} from './info-window.component';

/** Map Module */
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule
  ],
  declarations: [
    InfoWindowComponent,
    MapComponent,
    MarkerComponent,
  ],
  exports: [
    InfoWindowComponent,
    MapComponent,
    MarkerComponent,
  ],
  providers: [MapApiService],
})
export class MapModule {
  static forRoot(apiKey: string): ModuleWithProviders {
    return {
      ngModule: MapModule,
      providers: [{provide: API_KEY, useValue: apiKey}],
    };
  }
}
