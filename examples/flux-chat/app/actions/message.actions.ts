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
    threadId: message.threadId,
    authorName: message.authorName,
    date: new Date(message.timestamp),
    text: message.text,
    isRead: message.threadId === currentThreadID
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

function getCreatedMessageData(text: string, currentThreadId: string): Message {
  const timestamp = Date.now();

  return {
    id: 'm_' + timestamp,
    threadId: currentThreadId,
    authorName: 'Bill', // hard coded for the example
    date: new Date(timestamp),
    text: text,
    isRead: true
  };
}

@Injectable()
export class MessageActions extends Action<AppState> {

  constructor() {
    super();
  }

  getAllMessages(): Next<AppState> {
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
          lastMessage: convertRawMessage(message, state.threadId)
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
        messages[m.id] = convertRawMessage(m, state.threadId);
      });

      return {
        messages
      } as AppState;
    };
  }

  createMessage(text: string) {
    return this.combine([
      (state) => {
        const message = getCreatedMessageData(text, state.threadId);

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
