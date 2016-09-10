import { State } from './store';

export type SyncAction <ST extends State> = (state: ST) => ST
export type AsyncAction<ST extends State> = Promise<(state: ST) => ST>;
export type Action     <ST extends State> = SyncAction<ST> | AsyncAction<ST>;
export type Processor  <ST extends State> = (p: Promise<ST>) => Promise<ST>;

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export class Actions<ST extends State> {

  protected combine(...nexts: Array<Action<ST> | RecursiveArray<Action<ST>>>): Action<ST>[] {
    let flatten = <T>(array: Array<T | RecursiveArray<T>>): Array<T | RecursiveArray<T>> => {
      return array.reduce<Array<T | RecursiveArray<T>>>((p: Array<T | RecursiveArray<T>>, c: T | RecursiveArray<T>) => {
        return Array.isArray(c)
          ? p.concat(flatten<T | RecursiveArray<T>>(c))
          : p.concat(c);
      }, []);
    };

    return flatten<Action<ST>>(nexts) as Action<ST>[];
  }

}
