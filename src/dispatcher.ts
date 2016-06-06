import { Subject } from 'rxjs/Subject';

import { Reducer, AsyncReducer } from './action';
import { State } from './store';

function isReducers<ST>(v: Reducer<ST> | Reducer<ST>[]): v is Reducer<ST>[] {
  return Array.isArray(v);
}

export class Dispatcher<ST extends State> {

  private subject = new Subject<AsyncReducer<ST>>();

  emit(reducer: Reducer<ST> | Reducer<ST>[]): void {
    if (isReducers<ST>(reducer)) {
      this.emitAll(reducer);
      return;
    }
    this.emitAll([reducer as Reducer<ST>]);
  }

  emitAll(reducers: Reducer<ST>[]): void {
    const asyncReducer = reducers
      .map((f: Reducer<ST>) => (p: Promise<ST>) => p.then(f))
      .reduce((f: AsyncReducer<ST>, g: AsyncReducer<ST>) => (p: Promise<ST>) => g(f(p)))
    ;
    this.subject.next(asyncReducer);
  }

  subscribe(observer: (asyncReducer: AsyncReducer<ST>) => void): void {
    this.subject.subscribe((asyncReducer) => {
      observer(asyncReducer);
    });
  }

}
