import { Injectable } from '@angular/core';
import { Actions, Action, AsyncAction } from 'walts';

import { AppState } from './app.store';

@Injectable()
export class AppActions extends Actions<AppState> {

  constructor() {
    super();
  }

  incrementA(v: number): Action<AppState> {
    return (state: AppState) => ({
      counterA: state.counterA + v
    });
  }

  incrementB(v: number): Action<AppState> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve((state: AppState) => {
          return {
            counterB: state.counterB + v
          };
        });
      }, 1000);
    });
  }

  multiplyA(v: number): Action<AppState> {
    return (state: AppState) => ({
      counterA: state.counterA * v
    });
  }

  multiplyB(v: number): AsyncAction<AppState> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve((state: AppState) => {
          return {
            counterB: state.counterB * v
          };
        });
      }, 1000);
    });
  }

  nestedCombineAction(): Action<AppState>[] {
    return this.combine([
      this.times2Plus1B(),
      this.times2Plus1B(),
      this.times2Plus1B()
    ]);
  }

  plus1Times2B(): Action<AppState>[] {
    return this.combine([
      (state: AppState) => ({
        counterB: state.counterB + 1
      }),
      this.multiplyB(2)
    ]);
  }

  reset(): Action<AppState> {
    return (state: AppState) => ({
      counterA: 0,
      counterB: 0
    });
  }

  syncThrow(): Action<AppState> {
    throw new Error('Sync thrown error');
  }

  times2Plus1B(): Action<AppState>[] {
    return this.combine([
      (state: AppState) => ({
        counterB: state.counterB * 2
      }),
      this.incrementB(1)
    ]);
  }

  wait1secAndThrow(): AsyncAction<AppState> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Example error!'));
      }, 1000);
    });
  }

}
