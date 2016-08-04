import { Next, Processor } from './action';
import { State } from './store';

export declare class Dispatcher<ST extends State> {
  emit(next: Next<ST> | Next<ST>[]): void;
  emitAll(nexts: Next<ST>[]): void;
  subscribe(observer: (processor: Processor<ST>) => void): void;
}
