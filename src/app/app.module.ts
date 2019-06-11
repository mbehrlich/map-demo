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
    MapModule.forRoot('Your API Key here'),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
