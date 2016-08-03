import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';

@Injectable()
export class MultiplyBAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(v: number): Next<AppState> {
    return (state: AppState) => ({
      counterB: state.counterB * v
    });
  }

}
