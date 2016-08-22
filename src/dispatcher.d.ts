import { Action, Processor } from './actions';
import { State } from './store';

export declare class Dispatcher<ST extends State> {
  emit(action: Action<ST> | Action<ST>[]): void;
  emitAll(actions: Action<ST>[]): void;
  subscribe(observer: (processor: Processor<ST>) => void): void;
}
