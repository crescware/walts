import { Injectable } from '@angular/core';
import { Action, Reducer } from 'walts';

import { AppState } from '../app.store';

@Injectable()
export class ResetAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(): Reducer<AppState> {
    return (state: AppState) => {
      state.counterA = 0;
      state.counterB = 0;
      return Promise.resolve(state);
    };
  }

}
