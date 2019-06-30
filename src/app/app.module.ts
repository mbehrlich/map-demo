import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {MapModule} from '../map/map-module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    // Your API key goes here. Leave empty to see development-only version of
    // maps.
    MapModule.forRoot(''),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
