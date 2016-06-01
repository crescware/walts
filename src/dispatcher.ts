import { Subject } from 'rxjs/Subject';

import { Reducer, AsyncReducer } from './action';
import { State } from './store';

export class Dispatcher<ST extends State> {

  private subject = new Subject<AsyncReducer<ST>>();

  emit(reducer: Reducer<ST>): void {
    this.emitAll([reducer]);
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
