import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { State, Store } from 'walts';

import { Thread } from './thread';
import { Threads } from './threads';
import { Messages } from './messages';
import { AppDispatcher } from './app.dispatcher';
import { AppStore } from './app.store';

function getAllChrono(threads: Threads): Thread[] {
  const orderedThreads = Object.keys(threads).map((id) => {
    return threads[id];
  }).filter((thread) => !!thread);

  return orderedThreads.sort((a, b) => {
    if (a.lastMessage.date < b.lastMessage.date) {
      return -1;
    } else if (a.lastMessage.date > b.lastMessage.date) {
      return 1;
    }
    return 0;
  });
}

@Injectable()
export class ThreadStore extends AppStore {

  constructor(protected dispatcher: AppDispatcher) {
    super(dispatcher);
  }

  getCurrent(observer?: (s: Thread) => void): Observable<Thread> {
    const subject = new Subject<Thread>();
    this.observable.subscribe((state) => {
      if (observer) {
        observer(state.threads[state.threadId]);
      }
      subject.next(state.threads[state.threadId]);
    });
    return subject;
  }

  getAllChrono(observer?: (s: Thread[]) => void): Observable<Thread[]> {
    const subject = new Subject<Thread[]>();
    this.observable.subscribe((state) => {
      if (observer) {
        observer(getAllChrono(state.threads));
      }
      subject.next(getAllChrono(state.threads));
    });
    return subject;
  }

}
