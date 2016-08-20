import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { State, Store } from 'walts';

import { AppDispatcher } from './app.dispatcher';
import { AppStore, AppState } from './app.store';
import {MessageVM} from "./ui/message.vm";
import {Message} from "./domain/message";


function getAllForThread(threadId: string, messages: Message[]): MessageVM[] {
  const threadMessages = messages.filter((m) => m.threadId === threadId);

  threadMessages.sort((a, b) => {
    if (a.date < b.date) {
      return -1;
    } else if (a.date > b.date) {
      return 1;
    }
    return 0;
  });

  return threadMessages.map((m) => {
    return new MessageVM(
      m.authorName,
      m.text,
      m.date.toLocaleDateString()
    );
  });
}

@Injectable()
export class MessageStore extends AppStore {

  constructor(protected dispatcher: AppDispatcher) {
    super(dispatcher);
  }

  getAllForCurrentThread(): Observable<MessageVM[]> {
    return this.observable.map((state) => {
      return getAllForThread(state.threadId, state.messages);
    });
  }

}
