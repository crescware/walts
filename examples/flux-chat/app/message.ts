export class RawMessage {
  id: string;
  threadID: string;
  threadName: string;
  authorName: string;
  text: string;
  timestamp: number;
}

export class Message {
  id: string;
  threadID: string;
  authorName: string;
  text: string;
  date: Date;
  isRead: boolean;
}
