import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { State, Store } from 'walts';

import { Thread } from './domain/thread';
import { AppDispatcher } from './app.dispatcher';
import { AppStore } from './app.store';
import {ThreadVM} from "./ui/thread.vm";

function getAllChrono(threads: Thread[]): ThreadVM[] {
  const orderedThreads = threads.filter((t) => !!t);

  return orderedThreads.sort((a, b) => {
    if (a.lastMessage.date < b.lastMessage.date) {
      return -1;
    } else if (a.lastMessage.date > b.lastMessage.date) {
      return 1;
    }
    return 0;
  }).map((t) => {
    return new ThreadVM(
      t.id,
      t.name,
      t.lastMessage.date.toLocaleDateString(),
      t.lastMessage.text
    );
  });
}

@Injectable()
export class ThreadStore extends AppStore {

  constructor(protected dispatcher: AppDispatcher) {
    super(dispatcher);
  }

  getId(): Observable<string> {
    const subject = new Subject<string>();
    this.observable.subscribe((state) => {
      subject.next(state.threadId);
    });
    return subject;
  }

  getCurrent(): Observable<ThreadVM> {
    return this.observable.map((state) => {
      if (!state.threads || state.threads.length < 1) {
        return {} as ThreadVM;
      }

      const thread = state.threads.find((t) => t.id === state.threadId);
      if (!thread) {
        return {} as ThreadVM;
      }

      return new ThreadVM(
        thread.id,
        thread.name,
        thread.lastMessage.date.toLocaleDateString(),
        thread.lastMessage.text
      );
    });
  }

  getAllChrono(): Observable<ThreadVM[]> {
    return this.observable.map((state) => {
      if (!state.threads || state.threads.length < 1) {
        return [{}] as ThreadVM[];
      }

      return getAllChrono(state.threads);
    });
  }

}
