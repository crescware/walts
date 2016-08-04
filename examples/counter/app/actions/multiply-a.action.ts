import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';

@Injectable()
export class MultiplyAAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(v: number): Next<AppState> {
    return (state: AppState) => ({
      counterA: state.counterA * v
    });
  }

}
