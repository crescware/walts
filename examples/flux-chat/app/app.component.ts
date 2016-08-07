import { Component } from '@angular/core';

import { actions } from "./actions/index";
import { MessageActions } from "./actions/message.actions";

import { AppDispatcher } from './app.dispatcher';
import { AppStore, AppState } from './app.store';
import { ThreadStore } from './thread.store';
import { MessageStore } from './message.store';
import { Thread } from './thread';
import { Message } from './message';

@Component({
  selector: 'fc-app',
  directives: [],
  providers: [
    actions,
    AppDispatcher,
    AppStore,
    ThreadStore,
    MessageStore
  ],
  template: `
  <div class="chatapp">
    <div class="thread-section">
      <div class="thread-count"></div>
      <ul class="thread-list">
        <li
          *ngFor="let _thread of threads"
          class="thread-list-item"
        >
          <h5 class="thread-name">{{_thread?.name}}</h5>
          <div class="thread-time">
            {{_thread?.lastMessage?.date?.toLocaleTimeString()}}
          </div>
          <div class="thread-last-message">
            {{_thread?.lastMessage?.text}}
          </div>
        </li>
      </ul>
    </div>
    <div class="message-section">
      <h3 class="message-thread-heading">{{thread?.name}}</h3>
      <ul class="message-list">
        <li
          *ngFor="let message of messages"
          class="message-list-item"
        >
          <h5 class="message-author-name">{{message?.authorName}}</h5>
          <div class="message-time">{{message?.date?.toLocaleTimeString()}}</div>
          <div class="message-text">{{message?.text}}</div>
        </li>
      </ul>
      <textarea name="message" id="message-composer" class="message-composer"></textarea>
    </div>
  </div>
  `
})
export class AppComponent {

  private threads: Thread[];
  private thread: Thread;
  private messages: Message[];

  constructor(private dispatcher: AppDispatcher,
              private threadStore: ThreadStore,
              private messageStore: MessageStore,
              private messageActions: MessageActions) {
    this.threadStore.getAllChrono((s) => this.threads = s);
    this.threadStore.getCurrent((s) => this.thread = s);
    this.messageStore.getAllForCurrentThread((s) => this.messages = s);
  }

  ngOnInit() {
    this.dispatcher.emit(this.messageActions.getAllMessages())
  }

}
