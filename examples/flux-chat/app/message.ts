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
}
