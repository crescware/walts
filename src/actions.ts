import { State } from './store';
import { flatten } from './utils';

export type SyncAction <ST extends State> = (state: ST) => ST
export type AsyncAction<ST extends State> = Promise<(state: ST) => ST>;
export type Action     <ST extends State> = SyncAction<ST> | AsyncAction<ST>;
export type Processor  <ST extends State> = (p: Promise<ST>) => Promise<ST>;

export interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export class Actions<ST extends State> {

  protected combine(...nexts: Array<Action<ST> | RecursiveArray<Action<ST>>>): Action<ST>[] {
    return flatten<Action<ST>>(nexts) as Action<ST>[];
  }

}
