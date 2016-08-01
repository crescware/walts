import { Injectable } from '@angular/core';
import { Action, Reducer } from 'walts';

import { AppState } from '../app.store';
import { MultiplyBAction } from './multiply-b.action';

@Injectable()
export class Plus1Times2BAction extends Action<AppState> {

  constructor(private multiplyB: MultiplyBAction) {
    super();
  }

  create(): Reducer<AppState>[] {
    return this.combine([
      (state: AppState) => {
        state.counterB = state.counterB + 1;
        return Promise.resolve(state);
      },
      this.multiplyB.create(2)
    ]);
  }

}
