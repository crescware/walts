import { Component } from '@angular/core';

import { AppDispatcher } from './app.dispatcher';
import { AppStore, AppState } from './app.store';

@Component({
  selector: 'fc-app',
  directives: [],
  providers: [
    AppDispatcher,
    AppStore
  ],
  template: `hello`
})
export class AppComponent {

  private state: AppState;

  constructor(private dispatcher: AppDispatcher,
              private store: AppStore) {
    this.store.observable.subscribe((state) => {
      console.log(state);
      this.state = state;
    });
  }

}
