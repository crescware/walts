import { Injectable } from '@angular/core';
import { Actions, Action } from 'walts';

import { AppState } from '../app.store';
import { RawMessage, Message } from '../domain/message';
import { Thread } from '../domain/thread';
import { Messages } from '../domain/messages';
import { Threads } from '../domain/threads';
import {MessageRepository} from "../domain/message.repository";

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

  constructor(private repository: MessageRepository) {
    super();
  }

  getAllMessages(): Action<AppState> {
    return (state) => {
      return {
        messages: this.repository.getAll()
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
