import { Subject } from 'rxjs/Subject';
import { isPromise as rxIsPromise } from 'rxjs/util/isPromise';

import { Action, SyncAction, AsyncAction, Processor } from './actions';
import { State } from './store';

function isActions<ST>(v: Action<ST> | Action<ST>[]): v is Action<ST>[] {
  return Array.isArray(v);
}

function isPromise<ST>(v: Action<ST>): v is AsyncAction<ST> {
  return rxIsPromise(v);
}

export class Dispatcher<ST extends State> {

  private subject = new Subject<Processor<ST>>();

  emit(action: Action<ST> | Action<ST>[]): void {
    if (isActions<ST>(action)) {
      this.emitAll(action);
      return;
    }
    this.emitAll([action as Action<ST>]);
  }

  emitAll(actions: Action<ST>[]): void {
    const processor = (st: Promise<ST>) => {
      return actions
        .reduce<Promise<ST>>((a, b) => {
          return new Promise((resolve, reject) => {
            a.then((aa) => {
              if (isPromise(b)) {
                b.then((bb) => {
                  resolve(Object.assign(aa, bb(aa)));
                }).catch((err) => {
                  reject(err);
                });
                return;
              }
              try {
                resolve(Object.assign(aa, (<SyncAction<ST>>b)(aa)));
              } catch(err) {
                reject(err);
              }
            }).catch((err) => {
              reject(err);
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
