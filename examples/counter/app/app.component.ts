import { Component } from '@angular/core';

import { AppActions } from './app.actions';
import { AppDispatcher } from './app.dispatcher';
import { AppStore, AppState } from './app.store';

@Component({
  selector: 'ex-app',
  directives: [],
  providers: [
    AppActions,
    AppDispatcher,
    AppStore
  ],
  template: `
    <h1>A: {{state?.counterA}} B: {{state?.counterB}}</h1>
    <button (click)="onClickIncrementA()">A +1</button>
    <button (click)="onClickIncrementB()">B +1</button>
    <button (click)="onClickIncrementBSequence()">B (+1*2+3)</button>
    <button (click)="onClickIncrementBSimul()">B +1*2+3</button>
    <button (click)="onClickMultiplyA()">A x3</button>
    <button (click)="onClickPlus1Times2A()">A +1 x2</button>
    <button (click)="onClickTimes2Plus1A()">A x2 +1</button>
    <button (click)="onClickPlus1Times2B()">B +1 x2</button>
    <button (click)="onClickTimes2Plus1B()">B x2 +1</button>
    <button (click)="onClickNested()">Nested</button>
    <button (click)="onClickReset()">Reset</button>
    <button (click)="onClickAsyncThrow()">Async Throw</button>
    <button (click)="onClickSyncThrow()">Sync Throw</button>
  `
})
export class AppComponent {

  private state: AppState;

  constructor(private dispatcher: AppDispatcher,
              private store: AppStore,
              private actions: AppActions) {
    this.store.observable.subscribe((state) => {
      console.log(state);
      this.state = state;
    }, (err) => {
      console.error('Caught the error.', err);
    });
  }

  onClickIncrementA() {
    this.dispatcher.emit(this.actions.incrementA(1));
  }

  onClickMultiplyA() {
    this.dispatcher.emit(this.actions.multiplyA(3));
  }

  onClickPlus1Times2A() {
    this.dispatcher.emitAll([
      this.actions.incrementA(1),
      this.actions.multiplyA(2)
    ]);
  }

  onClickTimes2Plus1A() {
    this.dispatcher.emitAll([
      this.actions.multiplyA(2),
      this.actions.incrementA(1)
    ]);
  }

  onClickIncrementB() {
    this.dispatcher.emit(this.actions.incrementB(1));
  }

  onClickIncrementBSequence() {
    this.dispatcher.emitAll([
      this.actions.incrementB(1),
      this.actions.multiplyB(2),
      this.actions.incrementB(3)
    ]);
  }

  onClickIncrementBSimul() {
    this.dispatcher.emit(this.actions.incrementB(1));
    this.dispatcher.emit(this.actions.multiplyB(2));
    this.dispatcher.emit(this.actions.incrementB(3));
  }

  onClickPlus1Times2B() {
    this.dispatcher.emit(this.actions.plus1Times2B());
  }

  onClickTimes2Plus1B() {
    this.dispatcher.emit(this.actions.times2Plus1B());
  }

  onClickNested() {
    this.dispatcher.emit(this.actions.nestedCombineAction());
  }

  onClickReset() {
    this.dispatcher.emit(this.actions.reset());
  }

  onClickAsyncThrow() {
    this.dispatcher.emit(this.actions.wait1secAndThrow());
  }

  onClickSyncThrow() {
    try {
      this.dispatcher.emit(this.actions.syncThrow());
    } catch(err) {
      console.error('Caught the error.', err);
    }
  }

}
