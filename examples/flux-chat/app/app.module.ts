import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppDispatcher } from './app.dispatcher';
import { AppStore } from './app.store';
import { actions } from './actions/index';
import { ThreadStore } from './thread.store';
import { MessageStore } from './message.store';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent
  ],
  providers:  [
    actions,
    AppDispatcher,
    AppStore,
    ThreadStore,
    MessageStore
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
