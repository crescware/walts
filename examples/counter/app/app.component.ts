import { Component } from '@angular/core';

import { actions } from './actions/index';
import { IncrementAAction } from './actions/increment-a.action';
import { IncrementBAction } from './actions/increment-b.action';
import { MultiplyAAction } from './actions/multiply-a.action';
import { AppDispatcher } from './app.dispatcher';
import { AppStore, AppState } from './app.store';
import {Plus1Times2BAction} from "./actions/plus1times2-b.action";
import {Times2Plus1BAction} from "./actions/times2plus1-b.action";

@Component({
  selector: 'ex-app',
  directives: [],
  providers: [
    actions,
    AppDispatcher,
    AppStore
  ],
  template: `
    <h1>A: {{state?.counterA}} B: {{state?.counterB}}</h1>
    <button (click)="onClickIncrementA()">A +1</button>
    <button (click)="onClickIncrementB()">B +1</button>
    <button (click)="onClickMultiplyA()">A x3</button>
    <button (click)="onClickPlus1Times2A()">A +1 x2</button>
    <button (click)="onClickTimes2Plus1A()">A x2 +1</button>
    <button (click)="onClickPlus1Times2B()">B +1 x2</button>
    <button (click)="onClickTimes2Plus1B()">B x2 +1</button>
  `
})
export class AppComponent {

  private state: AppState;

  constructor(private dispatcher: AppDispatcher,
              private store: AppStore,
              private incrementA: IncrementAAction,
              private incrementB: IncrementBAction,
              private multiplyA: MultiplyAAction,
              private plus1Times2B: Plus1Times2BAction,
              private times2Plus1B: Times2Plus1BAction) {
    this.store.observable.subscribe((state) => {
      this.state = state;
    });
  }

  onClickIncrementA() {
    this.dispatcher.emit(this.incrementA.create(1));
  }

  onClickMultiplyA() {
    this.dispatcher.emit(this.multiplyA.create(3));
  }

  onClickPlus1Times2A() {
    this.dispatcher.emitAll([
      this.incrementA.create(1),
      this.multiplyA.create(2)
    ]);
  }

  onClickTimes2Plus1A() {
    this.dispatcher.emitAll([
      this.multiplyA.create(2),
      this.incrementA.create(1)
    ]);
  }

  onClickIncrementB() {
    this.dispatcher.emit(this.incrementB.create(1));
  }

  onClickPlus1Times2B() {
    this.dispatcher.emit(this.plus1Times2B.create());
  }

  onClickTimes2Plus1B() {
    this.dispatcher.emit(this.times2Plus1B.create());
  }

}
