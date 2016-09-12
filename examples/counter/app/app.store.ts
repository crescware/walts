import { Injectable } from '@angular/core';
import { State, Store } from 'walts';

import { AppDispatcher } from './app.dispatcher';

export class AppState extends State {
  a: number;
  b: number;
  c: number;
}

const INIT_STATE: AppState = {
  a: 0,
  b: 0,
  c: 0
};

@Injectable()
export class AppStore extends Store<AppState> {

  constructor(protected dispatcher: AppDispatcher) {
    super(INIT_STATE, dispatcher);
  }

}
