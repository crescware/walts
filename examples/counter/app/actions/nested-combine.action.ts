import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';
import { Times2Plus1BAction } from './times2plus1-b.action';

@Injectable()
export class NestedCombileAction extends Action<AppState> {

  constructor(private times2Plus1B: Times2Plus1BAction) {
    super();
  }

  create(): Next<AppState>[] {
    return this.combine([
      this.times2Plus1B.create(),
      this.times2Plus1B.create(),
      this.times2Plus1B.create()
    ]);
  }

}
