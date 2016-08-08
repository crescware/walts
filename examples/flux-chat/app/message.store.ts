import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { State, Store } from 'walts';

import { Message } from './message';
import { AppDispatcher } from './app.dispatcher';
import { AppStore, AppState } from './app.store';

function getAllForThread(state: AppState) {
  const threadMessages = Object.keys(state.messages).map((m) => {
    if (state.messages[m].threadId === state.threadId) {
      return state.messages[m];
    }
  });

  threadMessages.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else if (a.date > b.date) {
      return 1;
    }
    return 0;
  });

  return threadMessages;
}

@Injectable()
export class MessageStore extends AppStore {

  constructor(protected dispatcher: AppDispatcher) {
    super(dispatcher);
  }

  getAllForCurrentThread(observer?: (s: Message[]) => void): Observable<Message[]> {
    const subject = new Subject<Message[]>();
    this.observable.subscribe((state) => {
      if (observer) {
        observer(getAllForThread(state));
      }
      subject.next(getAllForThread(state));
    });
    return subject;
  }

}
