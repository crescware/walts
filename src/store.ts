import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Dispatcher } from './dispatcher';

export abstract class State {}

export class Store<ST extends State> {

  private _observable: BehaviorSubject<ST>;
  private state: ST;

  constructor(initState: ST,
              protected dispatcher: Dispatcher<ST>) {
    this.state       = initState;
    this._observable = new BehaviorSubject<ST>(this.state);

    this.dispatcher.subscribe((reducer) => {
      const currentState = Promise.resolve(Object.assign({}, this.state) as ST);
      reducer(currentState).then((nextState: ST) => {
        this.state = nextState;
        this._observable.next(Object.assign({}, nextState) as ST);
      });
    });
  }

  get observable(): Observable<ST> {
    return this._observable;
  }

}
