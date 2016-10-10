import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Dispatcher } from './dispatcher';

export abstract class State {}

export class Store<ST extends State> {

  private _observable: BehaviorSubject<ST>;
  private stateRef: ST;

  constructor(initState: ST,
              protected dispatcher: Dispatcher<ST>) {
    this.stateRef    = Object.assign({}, initState) as ST;
    this._observable = new BehaviorSubject<ST>(this.stateRef);

    this.dispatcher.subscribeBegin((queue) => {
      queue.next(this.stateRef);
    });
    this.dispatcher.subscribeContinue((chunk) => {
      this.stateRef = Object.assign({}, this.stateRef, chunk.result);
      chunk.queue.next(this.stateRef);
    });
    this.dispatcher.subscribeComplete((result) => {
      this.stateRef = Object.assign({}, this.stateRef, result);
      this._observable.next(this.stateRef);
    }, (err) => {
      this._observable.error(err);
    });
  }

  get observable(): Observable<ST> {
    return this._observable;
  }

}
