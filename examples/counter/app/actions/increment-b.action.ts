import { Injectable } from '@angular/core';
import { Action, Reducer } from 'walts';

import {AppState} from '../app.store';

@Injectable()
export class IncrementBAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(v: number): Reducer<AppState> {
    return (state: AppState) => {
      state.counterB = state.counterB + v;
      return Promise.resolve(state);
    };
  }

}
