import { Subject } from 'rxjs';
import { isPromise as rxIsPromise } from 'rxjs/internal-compatibility'
import { Action, Delayed, DelayedAction, SyncAction } from './actions';
import { State } from './store';
import { flatten } from './utils';

interface SubjectLike<ST> {
  next: (st: ST) => void
}

interface ResultChunk<ST> {
  result: ST
  queue: SubjectLike<ST>
}

function finish<ST>(resolve: (st: ST) => void, complete$?: Subject<ST>): SubjectLike<ST> {
  return {
    next: (st: ST) => {
      resolve(st)
      if (complete$) {
        complete$.next(st)
      }
    }
  }
}

function isAction<ST>(v: ST | Action<ST> | Action<ST>[]): v is Action<ST> {
  return typeof v === 'function'
}

function isActions<ST>(v: Action<ST> | Action<ST>[]): v is Action<ST>[] {
  return Array.isArray(v)
}

function isDelayed<ST>(v: ST | Delayed<ST>): v is Delayed<ST> {
  return rxIsPromise(v)
}

export class Dispatcher<ST extends State> {

  private begin$    = new Subject<Subject<ST>>()
  private continue$ = new Subject<ResultChunk<ST>>()
  private complete$ = new Subject<ST>()

  emit(action: Action<ST> | Action<ST>[]) {
    this._emit(action, this.complete$)
  }

  emitAll(actions: (Action<ST> | Action<ST>[])[]) {
    this._emitAll(actions, this.complete$)
  }

  subscribeBegin(observer: (queue: Subject<ST>) => void) {
    this.begin$.subscribe(queue => observer(queue))
  }

  subscribeContinue(observer: (chunk: ResultChunk<ST>) => void) {
    this.continue$.subscribe(chunk => observer(chunk))
  }

  subscribeComplete(observer: (result: ST) => void, errorHandler: (error: any) => void) {
    this.complete$.subscribe(
      result => observer(result),
      err    => errorHandler(err)
    )
  }

  private _emit(action: Action<ST> | Action<ST>[], complete$?: Subject<ST>): Promise<ST> {
    if (isActions<ST>(action)) {
      return this._emitAll(action, complete$)
    }
    return this._emitAll([action as Action<ST>], complete$)
  }

  private _emitAll(_actions: (Action<ST> | Action<ST>[])[], complete$?: Subject<ST>): Promise<ST> {
    const actions = flatten(_actions) as Action<ST>[]

    const promise = new Promise<ST>(resolve => {
      const queues = actions.map(_ => new Subject<ST>())

      queues.forEach((queue, i) => {
        const action    = actions[i]
        const nextQueue = queues[i + 1]
          ? queues[i + 1] as SubjectLike<ST>
          : finish(resolve, complete$)

        queue.subscribe((state: ST) => {
          const syncOrDelayedAction = action as SyncAction<ST> | DelayedAction<ST>
          let stateOrDelayed: ST | Delayed<ST>
          try {
            stateOrDelayed = syncOrDelayedAction(state)
          } catch (e) {
            this.complete$.error(e)
          }
          if (isDelayed<ST>(stateOrDelayed)) {
            this.whenDelayed(
              stateOrDelayed,
              nextQueue,
              err => this.complete$.error(err)
            )
            return
          }

          this.continueNext(stateOrDelayed as ST, nextQueue)
        })
      })

      this.begin$.next(queues[0])
    })
    return promise
  }

  private whenDelayed(result: Delayed<ST>, nextQueue: SubjectLike<ST>, errorHandler: (error: any) => void) {
    result
      .then(value => {
        if (isAction<ST>(value)) {
          return this._emit(value)
            .then(v => this.continueNext(v, nextQueue))
        }
        if (isActions<ST>(value)) {
          return this._emitAll(value)
            .then(v => this.continueNext(v, nextQueue))
        }
      })
      .catch(err => errorHandler(err))
  }

  private continueNext(result: ST, queue: SubjectLike<ST>) {
    this.continue$.next({result, queue})
  }

}
