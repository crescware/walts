import { Subject } from 'rxjs';
import { isPromise as rxIsPromise } from 'rxjs/util/isPromise';

import { Action, SyncAction, DelayedAction, AsyncAction, Delayed } from './actions';
import { State } from './store';

interface SubjectLike<ST> {
  next: (st: ST) => void;
}

interface ResultChunk<ST> {
  result: ST;
  queue: SubjectLike<ST>;
}

function finish<ST>(resolve: (st: ST) => void, complete$?: Subject<ST>): SubjectLike<ST> {
  return {
    next: (st: ST) => {
    resolve(st);
      if (complete$) {
        complete$.next(st);
      }
    }
  };
}

function isAction<ST>(v: ST | Action<ST> | Action<ST>[]): v is Action<ST> {
  return typeof v === 'function';
}

function isActions<ST>(v: Action<ST> | Action<ST>[]): v is Action<ST>[] {
  return Array.isArray(v);
}

function isAsyncAction<ST>(v: Action<ST>): v is AsyncAction<ST> {
  return rxIsPromise(v);
}

function isDelayedAction<ST>(v: SyncAction<ST> | DelayedAction<ST>): v is DelayedAction<ST> {
  return rxIsPromise(v);
}

export class Dispatcher<ST extends State> {

  private begin$    = new Subject<Subject<ST>>();
  private continue$ = new Subject<ResultChunk<ST>>();
  private complete$ = new Subject<ST>();

  emit(action: Action<ST> | Action<ST>[]): void {
    this.emitImpl(action, this.complete$);
  }

  emitAll(actions: Action<ST>[]): void {
    this.emitAllImpl(actions, this.complete$);
  }

  subscribeBegin(observer: (queue: Subject<ST>) => void): void {
    this.begin$.subscribe((queue) => {
      observer(queue);
    });
  }

  subscribeContinue(observer: (chunk: ResultChunk<ST>) => void): void {
    this.continue$.subscribe((chunk) => {
      observer(chunk);
    });
  }

  subscribeComplete(observer: (result: ST) => void): void {
    this.complete$.subscribe((result) => {
      observer(result);
    });
  }

  private emitImpl(action: Action<ST> | Action<ST>[], complete$?: Subject<ST>): Promise<ST> {
    if (isActions<ST>(action)) {
      return this.emitAllImpl(action, complete$);
    }
    return this.emitAllImpl([action as Action<ST>], complete$);
  }

  private emitAllImpl(actions: Action<ST>[], complete$?: Subject<ST>): Promise<ST> {
    const promise = new Promise<ST>((resolve) => {
      const queues = actions.map((_) => new Subject<ST>());

      queues.forEach((queue, i) => {
        const action    = actions[i];
        const nextQueue = queues[i + 1]
          ? queues[i + 1] as SubjectLike<ST>
          : finish(resolve, complete$);

        queue.subscribe((state: ST) => {
          if (isAsyncAction<ST>(action)) {
            console.warn('Use of promise is deprecated. Please use the Actions#delayed() instead.');
            action.then((_action) => {
              const result = _action(state);
              this.continueNext(result, nextQueue);
            });
            return;
          }

          const syncOrDelayed = action as SyncAction<ST> | DelayedAction<ST>;
          if (isDelayedAction<ST>(syncOrDelayed)) {
            this.whenDelayed(syncOrDelayed(state as ST), nextQueue);
            return;
          }

          this.continueNext((syncOrDelayed as SyncAction<ST>)(state), nextQueue);
        });
      });

      this.begin$.next(queues[0]);
    });
    return promise;
  }

  private whenDelayed(result: Delayed<ST>, nextQueue: SubjectLike<ST>) {
    result.then((value) => {
      if (isAction<ST>(value)) {
        return this.emitImpl(value).then((v) => this.continueNext(v, nextQueue));
      }
      if (isActions<ST>(value)) {
        return this.emitAllImpl(value).then((v) => this.continueNext(v, nextQueue));
      }
    });
  }

  private continueNext(result: ST, queue: SubjectLike<ST>): void {
    this.continue$.next({result, queue});
  }

}
