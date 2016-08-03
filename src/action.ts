import { State } from './store';

export type Reducer<ST extends State> = (state: ST) => Promise<ST>;
export type AsyncReducer<ST extends State> = (p: Promise<ST>) => Promise<ST>;

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export class Action<ST extends State> {

  protected combine(...reducers: Array<Reducer<ST> | RecursiveArray<Reducer<ST>>>): Reducer<ST>[] {
    let flatten = <T>(array: Array<T | RecursiveArray<T>>): Array<T | RecursiveArray<T>> => {
      return array.reduce<Array<T | RecursiveArray<T>>>((p: Array<T | RecursiveArray<T>>, c: T | RecursiveArray<T>) => {
        return Array.isArray(c)
          ? p.concat(flatten<T | RecursiveArray<T>>(c))
          : p.concat(c);
      }, []);
    };

    return flatten<Reducer<ST>>(reducers) as Reducer<ST>[];
  }

}
