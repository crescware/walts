import { MixedAction, Processor } from './actions';
import { State } from './store';

export declare class Dispatcher<ST extends State> {
  emit(action: MixedAction<ST> | MixedAction<ST>[]): void;
  emitAll(actions: MixedAction<ST>[]): void;
  subscribe(observer: (processor: Processor<ST>) => void): void;
}
