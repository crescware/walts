import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppActions } from './app.actions';
import { AppDispatcher } from './app.dispatcher';
import { AppStore } from './app.store';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent
  ],
  providers:  [
    AppActions,
    AppDispatcher,
    AppStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
