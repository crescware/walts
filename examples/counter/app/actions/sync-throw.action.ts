import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';

@Injectable()
export class SyncThrowAction extends Action<AppState> {

  constructor() {
    super();
  }

  create(): Next<AppState> {
    throw new Error('Sync thrown error');
  }

}
