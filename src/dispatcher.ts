import { Subject } from 'rxjs/Subject';
import { isPromise as rxIsPromise } from 'rxjs/util/isPromise';

import { Next, Reducer } from './action';
import { State } from './store';

function isNexts<ST>(v: Next<ST> | Next<ST>[]): v is Next<ST>[] {
  return Array.isArray(v);
}
function isPromise<ST>(v: ST | Promise<ST>): v is Promise<ST> {
  return rxIsPromise(v);
}

export class Dispatcher<ST extends State> {

  private subject = new Subject<Reducer<ST>>();

  emit(next: Next<ST> | Next<ST>[]): void {
    if (isNexts<ST>(next)) {
      this.emitAll(next);
      return;
    }
    this.emitAll([next as Next<ST>]);
  }

  emitAll(nexts: Next<ST>[]): void {
    const reducer = (st: Promise<ST>) => {
      return nexts
        .reduce((a, b) => {
          return new Promise((resolve) => {
            a.then((aa) => {
              const bb = b(aa);
              return (isPromise(bb))
                ? bb.then((bbb) => resolve(Object.assign({}, aa, bbb)))
                :                  resolve(Object.assign({}, aa, bb));
            });
          });
        }, st);
    };
    this.subject.next(reducer);
  }

  subscribe(observer: (reducer: Reducer<ST>) => void): void {
    this.subject.subscribe((reducer) => {
      observer(reducer);
    });
  }

}
