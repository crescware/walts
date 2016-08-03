import { State } from './store';

export type SyncNext<ST extends State> = (state: ST) => ST
export type AsyncNext<ST extends State> =  Promise<(state: ST) => ST>;
export type Next<ST extends State> = SyncNext<ST> | AsyncNext<ST>;
export type Reducer<ST extends State> = (p: Promise<ST>) => Promise<ST>;

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export class Action<ST extends State> {

  protected combine(...reducers: Array<Next<ST> | RecursiveArray<Next<ST>>>): Next<ST>[] {
    let flatten = <T>(array: Array<T | RecursiveArray<T>>): Array<T | RecursiveArray<T>> => {
      return array.reduce<Array<T | RecursiveArray<T>>>((p: Array<T | RecursiveArray<T>>, c: T | RecursiveArray<T>) => {
        return Array.isArray(c)
          ? p.concat(flatten<T | RecursiveArray<T>>(c))
          : p.concat(c);
      }, []);
    };

    return flatten<Next<ST>>(reducers) as Next<ST>[];
  }

}
