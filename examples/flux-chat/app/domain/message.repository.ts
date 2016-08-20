import {Injectable} from "@angular/core";
import {Message, RawMessage} from "./message";

@Injectable()
export class MessageRepository {

  getAll(): Message[] {
    const rawMessages = JSON.parse(localStorage.getItem('messages')) as RawMessage[];
    return rawMessages.map((m) => {
      const currentThreadID: string = void 0;
      return Message.convertRawMessage(m, currentThreadID);
    });
  }

}