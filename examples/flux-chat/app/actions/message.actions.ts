import { Injectable } from '@angular/core';
import { Actions, Action } from 'walts';

import { AppState } from '../app.store';
import { RawMessage, Message } from '../message';
import { Thread } from '../thread';
import { Messages } from '../messages';
import { Threads } from '../threads';

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
export class MessageActions extends Actions<AppState> {

  constructor() {
    super();
  }

  getAllMessages(): Action<AppState> {
    return (state) => {
      const rawMessages = JSON.parse(localStorage.getItem('messages')) as RawMessage[];

      rawMessages.forEach((message) => {
        var threadId = message.threadId;
        var thread = state.threads && state.threads[threadId];
        if (thread && message.timestamp < Math.floor(thread.lastMessage.date.getTime() / 1000)) {
          return;
        }
        state.threads[threadId] = {
          id: threadId,
          name: message.threadName,
          lastMessage: Message.convertRawMessage(message, state.threadId)
        };
      });

      if (!state.threadId) {
        const allChrono = getAllChrono(state.threads);
        state.threadId = allChrono[allChrono.length - 1].id;
      }

      state.threads[state.threadId].lastMessage.isRead = true;

      let messages = {} as Messages;
      rawMessages.forEach((m) => {
        if (messages[m.id]) {
          return;
        }
        messages[m.id] = Message.convertRawMessage(m, state.threadId);
      });

      return {
        messages
      } as AppState;
    };
  }

  createMessage(text: string) {
    return this.combine([
      (state) => {
        const message = Message.getCreatedMessageData(text, state.threadId);

        // simulate writing to a database
        const rawMessages = JSON.parse(localStorage.getItem('messages'));
        const timestamp = Date.now();
        const id = 'm_' + timestamp;
        const threadId = message.threadId || ('t_' + Date.now());
        const createdMessage = {
          id: id,
          threadId: threadId,
          threadName: '',
          authorName: message.authorName,
          text: message.text,
          timestamp: timestamp
        };
        rawMessages.push(createdMessage);
        localStorage.setItem('messages', JSON.stringify(rawMessages));
        return state;
      },
      this.getAllMessages()
    ])
  }

}
