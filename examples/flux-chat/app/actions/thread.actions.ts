import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';

function _markAllInThreadRead(state: AppState) {
  Object.keys(state.messages).forEach((m) => {
    if (state.messages[m].threadId === state.threadId) {
      state.messages[m].isRead = true;
    }
  });
}

@Injectable()
export class ThreadActions extends Action<AppState> {

  constructor() {
    super();
  }

  clickThread(threadId: string): Next<AppState> {
    return (state) => {
      state.threadId = threadId;
      state.threads[state.threadId].lastMessage.isRead = true;

      _markAllInThreadRead(state);
      return state;
    };
  }

}
