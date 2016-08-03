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

    this.dispatcher.subscribe((processor) => {
      const before = Promise.resolve(this.stateRef);
      processor(before).then((after: ST) => {
        this.stateRef = after;
        this._observable.next(Object.assign({}, this.stateRef) as ST);
      });
    });
  }

  get observable(): Observable<ST> {
    return this._observable;
  }

}
