import { Observable } from 'rxjs'
import { Dispatcher } from './dispatcher'

export declare abstract class State {}

export declare class Store<ST extends State> {
  constructor(initState: ST, dispatcher: Dispatcher<ST>)
  observable: Observable<ST>
}
