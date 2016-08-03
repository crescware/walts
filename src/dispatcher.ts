import { Subject } from 'rxjs/Subject';
import { isPromise as rxIsPromise } from 'rxjs/util/isPromise';

import { Next, AsyncNext, Processor } from './action';
import { State } from './store';

function isNexts<ST>(v: Next<ST> | Next<ST>[]): v is Next<ST>[] {
  return Array.isArray(v);
}
function isPromise<ST>(v: Next<ST>): v is AsyncNext<ST> {
  return rxIsPromise(v);
}

export class Dispatcher<ST extends State> {

  private subject = new Subject<Processor<ST>>();

  emit(next: Next<ST> | Next<ST>[]): void {
    if (isNexts<ST>(next)) {
      this.emitAll(next);
      return;
    }
    this.emitAll([next as Next<ST>]);
  }

  emitAll(nexts: Next<ST>[]): void {
    const processor = (st: Promise<ST>) => {
      return nexts
        .reduce<Promise<ST>>((a, b) => {
          return new Promise((resolve) => {
            a.then((aa) => {
              return (isPromise(b))
                ? b.then((bb) => resolve(Object.assign(aa, bb(aa))))
                :                resolve(Object.assign(aa,  b(aa)));
            });
          });
        }, st);
    };
    this.subject.next(processor);
  }

  subscribe(observer: (processor: Processor<ST>) => void): void {
    this.subject.subscribe((processor) => {
      observer(processor);
    });
  }

}
