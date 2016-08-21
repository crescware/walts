import { Component } from '@angular/core';

import { Thread } from './domain/thread';

import { MessageActions } from './actions/message.actions';
import { ThreadActions } from './actions/thread.actions';

import { AppDispatcher } from './app.dispatcher';
import { AppStore } from './app.store';
import { MessageStore } from './message.store';
import { ThreadStore } from './thread.store';
import {MessageVM} from "./ui/message.vm";
import {ThreadVM} from "./ui/thread.vm";

@Component({
  selector: 'fc-app',
  template: `
  <div class="chatapp">
    <div class="thread-section">
      <div class="thread-count"></div>
      <ul class="thread-list">
        <li
          *ngFor="let _thread of threads"
          class="thread-list-item"
          [class.active]="_thread?.id === threadId"
          (click)="onClickThread(_thread)"
        >
          <h5 class="thread-name">{{_thread?.name}}</h5>
          <div class="thread-time">
            {{_thread?.lastMessageDate}}
          </div>
          <div class="thread-last-message">
            {{_thread?.lastMessageText}}
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
          <div class="message-time">{{message?.date}}</div>
          <div class="message-text">{{message?.text}}</div>
        </li>
      </ul>
      <textarea
        name="message"
        id="message-composer"
        class="message-composer"
        (keydown)="onKeydown($event)"
        [(ngModel)]="message"
      ></textarea>
    </div>
  </div>
  `
})
export class AppComponent {

  private messages: MessageVM[];
  private thread: ThreadVM;
  private threadId: string;
  private threads: ThreadVM[];
  private message: string;

  constructor(private dispatcher: AppDispatcher,
              private appStore: AppStore,
              private messageActions: MessageActions,
              private messageStore: MessageStore,
              private threadActions: ThreadActions,
              private threadStore: ThreadStore) {
    this.appStore.observable.subscribe((state) => {
      console.log(state);
    });
    this.messageStore.getAllForCurrentThread().subscribe((s) => this.messages = s);
    this.threadStore .getCurrent()            .subscribe((s) => this.thread = s);
    this.threadStore .getId()                 .subscribe((s) => this.threadId = s);
    this.threadStore .getAllChrono()          .subscribe((s) => this.threads = s);
  }

  ngOnInit() {
    this.dispatcher.emitAll([
      this.messageActions.getAllMessages(),
      this.threadActions.getAllThreads(),
    ])
  }

  onClickThread(thread: Thread) {
    this.dispatcher.emit(this.threadActions.clickThread(thread.id));
  }

  onKeydown(event: KeyboardEvent) {
    if (event.keyCode === 13 /* ENTER */) {
      event.preventDefault();
      var text = this.message.trim();
      if (text) {
        this.dispatcher.emit(this.messageActions.createMessage(text));
      }
      this.message = '';
    }
  }

}
