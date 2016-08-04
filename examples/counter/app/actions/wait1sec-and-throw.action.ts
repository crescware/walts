import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';

@Injectable()
export class Wait1SecAndThrowAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(): Next<AppState> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Example error!'));
      }, 1000);
    });
  }

}
