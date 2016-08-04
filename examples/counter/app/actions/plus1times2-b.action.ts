import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';
import { MultiplyBAction } from './multiply-b.action';

@Injectable()
export class Plus1Times2BAction extends Action<AppState> {

  constructor(private multiplyB: MultiplyBAction) {
    super();
  }

  create(): Next<AppState>[] {
    return this.combine([
      (state: AppState) => ({
        counterB: state.counterB + 1
      }),
      this.multiplyB.create(2)
    ]);
  }

}
