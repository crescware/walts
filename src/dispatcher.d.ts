import { Action } from './actions';
import { State } from './store';

export declare class Dispatcher<ST extends State> {
  emit(action: Action<ST> | Action<ST>[]): void;
  emitAll(actions: (Action<ST> | Action<ST>[])[]): void;
}
