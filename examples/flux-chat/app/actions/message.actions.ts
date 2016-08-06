import { Injectable } from '@angular/core';
import { Action, Next } from 'walts';

import { AppState } from '../app.store';
import { RawMessage, Message } from '../message';
import { Thread } from '../thread';
import { Messages } from '../messages';
import { Threads } from '../threads';

function convertRawMessage(message: RawMessage, currentThreadID: string | undefined): Message {
  return {
    id: message.id,
    threadID: message.threadID,
    authorName: message.authorName,
    date: new Date(message.timestamp),
    text: message.text,
    isRead: message.threadID === currentThreadID
  };
}

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
export class MessageActions extends Action<AppState> {

  private threads: Threads = {};

  constructor() {
    super();
  }

  getAllMessages(): Next<AppState> {
    return (state) => {
      const rawMessages = JSON.parse(localStorage.getItem('messages')) as RawMessage[];

      rawMessages.forEach((message) => {
        var threadID = message.threadID;
        var thread = this.threads && this.threads[threadID];
        if (thread && message.timestamp < Math.floor(thread.lastMessage.date.getTime() / 1000)) {
          return;
        }
        this.threads[threadID] = {
          id: threadID,
          name: message.threadName,
          lastMessage: convertRawMessage(message, state.threadId)
        };
      });

      if (!state.threadId) {
        const allChrono = getAllChrono(this.threads);
        state.threads = allChrono;
        state.threadId = allChrono[allChrono.length - 1].id;
      }

      this.threads[state.threadId].lastMessage.isRead = true;

      let messages = {} as Messages;
      rawMessages.forEach((m) => {
        if (messages[m.id]) {
          return;
        }
        messages[m.id] = convertRawMessage(m, state.threadId);
      });

      return {
        messages
      };
    };
  }

}
