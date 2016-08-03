import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';
import { IncrementBAction } from './increment-b.action';

@Injectable()
export class Times2Plus1BAction extends Action<AppState> {

  constructor(private incrementB: IncrementBAction) {
    super();
  }

  create(): Next<AppState>[] {
    return this.combine([
      (state: AppState) => ({
        counterB: state.counterB * 2
      }),
      this.incrementB.create(1)
    ]);
  }

}
