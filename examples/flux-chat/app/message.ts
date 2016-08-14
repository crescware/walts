export class RawMessage {
  id: string;
  threadId: string;
  threadName: string;
  authorName: string;
  text: string;
  timestamp: number;
}

export class Message {
  id: string;
  threadId: string;
  authorName: string;
  text: string;
  date: Date;
  isRead: boolean;

  static convertRawMessage(message: RawMessage, currentThreadID: string | undefined): Message {
    return {
      id: message.id,
      threadId: message.threadId,
      authorName: message.authorName,
      date: new Date(message.timestamp),
      text: message.text,
      isRead: message.threadId === currentThreadID
    };
  }

  static getCreatedMessageData(text: string, currentThreadId: string): Message {
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
}
