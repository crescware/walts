import {Injectable} from "@angular/core";
import {RawMessage, Message} from "./message";
import {Thread} from "./thread";

@Injectable()
export class ThreadRepository {

  getAll(): Thread[] {
    const rawMessages = JSON.parse(localStorage.getItem('messages')) as RawMessage[];
    const threads = rawMessages.map((m) => {
      const threadId = m.threadId;
      const orderedRawMessages = rawMessages
        .filter((_m) => _m.threadId === threadId)
        .sort((a, b) => {
          if (a.timestamp < b.timestamp) {
            return -1;
          } else if (a.timestamp > b.timestamp) {
            return 1;
          }
          return 0;
        });

      const lastMessage = Message.convertRawMessage(
        orderedRawMessages[orderedRawMessages.length - 1],
        threadId
      );

      return Thread.convertFromRawMessage(m, lastMessage);
    });

    return threads.reduce((prev, curr) => {
      if (prev.some((thread) => thread.id === curr.id)) {
        return prev;
      }
      return prev.concat([curr]);
    }, [] as Thread[]);
  }

}