import { Component } from '@angular/core';

import { actions } from "./actions/index";
import { MessageActions } from "./actions/message.actions";

import { AppDispatcher } from './app.dispatcher';
import { AppStore, AppState } from './app.store';

@Component({
  selector: 'fc-app',
  directives: [],
  providers: [
    actions,
    AppDispatcher,
    AppStore
  ],
  template: `
  <div class="chatapp">
    <div class="thread-section">
      <div class="thread-count"></div>
      <ul class="thread-list">
        <li
          *ngFor="let thread of state.threads"
          class="thread-list-item"
        >
          <h5 class="thread-name">{{thread.name}}</h5>
          <div class="thread-time">
            {{thread.lastMessage.date.toLocaleTimeString()}}
          </div>
          <div class="thread-last-message">
            {{thread.lastMessage.text}}
          </div>
        </li>
      </ul>
    </div>
    <div class="message-section">
      <h3 class="message-thread-heading"></h3>
      <ul class="message-list">
        <li class="message-list-item">
          <h5 class="message-author-name"></h5>
          <div class="message-time"></div>
          <div class="message-text"></div>
        </li>
      </ul>
      <textarea name="message" id="message-composer" class="message-composer"></textarea>
    </div>
  </div>
  `
})
export class AppComponent {

  private state: AppState;

  constructor(private dispatcher: AppDispatcher,
              private store: AppStore,
              private messageActions: MessageActions) {
    this.store.observable.subscribe((state) => {
      console.log(state);
      this.state = state;
    });
  }

  ngOnInit() {
    this.dispatcher.emit(this.messageActions.getAllMessages())
  }

}
