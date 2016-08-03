import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';

@Injectable()
export class IncrementBAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(v: number): Next<AppState> {
    return (state: AppState) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            counterB: state.counterB + v
          });
        }, 1000);
      });
    };
  }

}
