import { Subject, Observable } from 'rxjs';

import { SyncAction } from './actions';
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

function isActions<ST>(v: SyncAction<ST> | SyncAction<ST>[]): v is SyncAction<ST>[] {
  return Array.isArray(v);
}

export class Dispatcher<ST extends State> {

  private begin$    = new Subject<Subject<ST>>();
  private continue$ = new Subject<ResultChunk<ST>>();
  private complete$ = new Subject<ST>();

  emit(action: SyncAction<ST> | SyncAction<ST>[]): void {
    this.emitImpl(action, this.complete$);
  }

  emitAll(actions: SyncAction<ST>[]): void {
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

  private emitImpl(action: SyncAction<ST> | SyncAction<ST>[], complete$: Subject<ST>): Promise<ST> {
    if (isActions<ST>(action)) {
      return this.emitAllImpl(action, complete$);
    }
    return this.emitAllImpl([action as SyncAction<ST>], complete$);
  }

  private emitAllImpl(actions: SyncAction<ST>[], complete$: Subject<ST>): Promise<ST> {
    const promise = new Promise<ST>((resolve) => {
      const queues = actions.map((_) => new Subject<ST>());

      queues.forEach((queue, i) => {
        const action    = actions[i];
        const nextQueue = queues[i + 1]
          ? queues[i + 1] as SubjectLike<ST>
          : finish(resolve, complete$);

        queue.subscribe((state: ST) => {
          this.continueNext(action(state), nextQueue);
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
