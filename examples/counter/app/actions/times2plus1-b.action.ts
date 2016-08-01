import { Injectable } from '@angular/core';
import { Action, Reducer } from 'walts';

import { AppState } from '../app.store';
import { IncrementBAction } from './increment-b.action';

@Injectable()
export class Times2Plus1BAction extends Action<AppState> {

  constructor(private incrementB: IncrementBAction) {
    super();
  }

  create(): Reducer<AppState>[] {
    return this.combine([
      (state: AppState) => {
        state.counterB = state.counterB * 2;
        return Promise.resolve(state);
      },
      this.incrementB.create(1)
    ]);
  }

}
