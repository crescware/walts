import {Message, RawMessage} from './message';

export class Thread {

  constructor(public id: string,
              public name: string,
              public lastMessage: Message) {
  }

  static convertFromRawMessage(message: RawMessage, lastMessage: Message): Thread {
    return new Thread(
      message.threadId,
      message.threadName,
      lastMessage
    );
  }

}
