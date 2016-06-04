import { Reducer, AsyncReducer } from './action';
import { State } from './store';

export declare class Dispatcher<ST extends State> {
  emit(reducer: Reducer<ST>): void;
  emitAll(reducers: Reducer<ST>[]): void;
  subscribe(observer: (asyncReducer: AsyncReducer<ST>) => void): void;
}
