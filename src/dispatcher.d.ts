import { Next, Reducer } from './action';
import { State } from './store';

export declare class Dispatcher<ST extends State> {
  emit(reducer: Next<ST> | Next<ST>[]): void;
  emitAll(reducers: Next<ST>[]): void;
  subscribe(observer: (asyncReducer: Reducer<ST>) => void): void;
}
