import { Injectable } from '@angular/core';
import { Action, Reducer } from 'walts';

import { AppState } from '../app.store';

@Injectable()
export class IncrementAAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(v: number): Reducer<AppState> {
    return (state: AppState) => {
      state.counterA = state.counterA + v;
      return Promise.resolve(state);
    };
  }

}
