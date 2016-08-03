import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';

@Injectable()
export class ResetAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(): Next<AppState> {
    return (state: AppState) => ({
      counterA: 0,
      counterB: 0
    });
  }

}
