import { Injectable } from '@angular/core';
import { Actions, Action } from 'walts';

import { AppState } from '../app.store';
import {Message} from "../domain/message";
import {ThreadRepository} from "../domain/thread.repository";


function _markAllInThreadRead(state: AppState) {
  state.messages.forEach((m) => {
    if (m.threadId === state.threadId) {
      m.isRead = true;
    }
  });
}

@Injectable()
export class ThreadActions extends Actions<AppState> {

  constructor(private repository: ThreadRepository) {
    super();
  }

  getAllThreads(): Action<AppState> {
    return (state) => {
      return {
        threads: this.repository.getAll()
      } as AppState;
    };
  }

  clickThread(threadId: string): Action<AppState> {
    return (state) => {
      state.threadId = threadId;
      const thread = state.threads.find((t) => t.id === state.threadId);
      thread.lastMessage.isRead = true;

      _markAllInThreadRead(state);
      return state;
    };
  }

}
