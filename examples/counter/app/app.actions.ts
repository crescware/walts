import { Injectable } from '@angular/core';
import { Actions, Action, AsyncAction } from 'walts';

import { AppState } from './app.store';

@Injectable()
export class AppActions extends Actions<AppState> {

  constructor() {
    super();
  }

  incrementA(v: number): Action<AppState> {
    return (st) => ({
      a: st.a + v
    } as AppState);
  }

  incrementB(v: number): Action<AppState> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve((st: AppState) => {
          return {
            b: st.b + v
          } as AppState;
        });
      }, 1000);
    });
  }

  incrementC(v: number): Action<AppState> {
    return (st) => {
      return this.delayed((apply) => {
        setTimeout(() => {
          apply((st) => {
            return {
              c: st.c + v
            } as AppState;
          });
        }, 1000);
      });
    };
  }

  multiplyA(v: number): Action<AppState> {
    return (st) => ({
      a: st.a * v
    } as AppState);
  }

  multiplyB(v: number): AsyncAction<AppState> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve((st: AppState) => {
          return {
            b: st.b * v
          } as AppState;
        });
      }, 1000);
    });
  }

  nestedCombineAction(): Action<AppState>[] {
    return this.combine([
      this.incrementA(1),
      this.incrementB(1),
      this.incrementC(1)
    ]);
  }

  plus1Times2B(): Action<AppState>[] {
    return this.combine([
      (st) => ({
        b: st.b + 1
      } as AppState),
      this.multiplyB(2)
    ]);
  }

  reset(): Action<AppState> {
    return (st) => ({
      a: 0,
      b: 0,
      c: 0
    } as AppState);
  }

  syncThrow(): Action<AppState> {
    throw new Error('Sync thrown error');
  }

  times2Plus1B(): Action<AppState>[] {
    return this.combine([
      (st) => ({
        b: st.b * 2
      } as AppState),
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
