import { Injectable } from '@angular/core';
import { State, Store } from 'walts';

import { AppDispatcher } from './app.dispatcher';

export class AppState extends State {
  counterA: number;
  counterB: number;
}

const INIT_STATE: AppState = {
  counterA: 0,
  counterB: 0
};

@Injectable()
export class AppStore extends Store<AppState> {

  constructor(protected dispatcher: AppDispatcher) {
    super(INIT_STATE, dispatcher);
  }

}
