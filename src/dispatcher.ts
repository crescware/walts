import { Subject } from 'rxjs';
import { isPromise as rxIsPromise } from 'rxjs/util/isPromise';

import { SyncAction, AsyncAction } from './actions';
import { State } from './store';

interface SubjectLike<ST> {
  next: (st: ST) => void;
}

interface ResultChunk<ST> {
  result: ST;
  queue: SubjectLike<ST>;
}

function finish<ST>(resolve: (st: ST) => void, complete$: Subject<ST>): SubjectLike<ST> {
  return {
    next: (st: ST) => {
      resolve(st);
      if (complete$) {
        complete$.next(st);
      }
    }
  };
}

function isActions<ST>(v: SyncAction<ST> | AsyncAction<ST> | Array<SyncAction<ST> | AsyncAction<ST>>): v is Array<SyncAction<ST> | AsyncAction<ST>> {
  return Array.isArray(v);
}

function isAsyncAction<ST>(v: SyncAction<ST> | AsyncAction<ST>): v is AsyncAction<ST> {
  return rxIsPromise(v);
}

export class Dispatcher<ST extends State> {

  private begin$    = new Subject<Subject<ST>>();
  private continue$ = new Subject<ResultChunk<ST>>();
  private complete$ = new Subject<ST>();

  emit(action: SyncAction<ST> | AsyncAction<ST> | Array<SyncAction<ST> | AsyncAction<ST>>): void {
    this.emitImpl(action, this.complete$);
  }

  emitAll(actions: Array<SyncAction<ST> | AsyncAction<ST>>): void {
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

  private emitImpl(action: SyncAction<ST> | AsyncAction<ST> | Array<SyncAction<ST> | AsyncAction<ST>>, complete$: Subject<ST>): Promise<ST> {
    if (isActions<ST>(action)) {
      return this.emitAllImpl(action, complete$);
    }
    return this.emitAllImpl([action as SyncAction<ST> | AsyncAction<ST>], complete$);
  }

  private emitAllImpl(actions: Array<SyncAction<ST> | AsyncAction<ST>>, complete$: Subject<ST>): Promise<ST> {
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

          this.continueNext((action as SyncAction<ST>)(state), nextQueue);
        });
      });

      this.begin$.next(queues[0]);
    });
    return promise;
  }

  private continueNext(result: ST, queue: SubjectLike<ST>): void {
    this.continue$.next({result, queue});
  }

}
