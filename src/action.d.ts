import { State } from './store';

export declare type Next<ST extends State> = (state: ST) => Promise<ST>;
export declare type AsyncReducer<ST extends State> = (p: Promise<ST>) => Promise<ST>;

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export declare class Action<ST extends State> {
  protected combine(...reducers: Array<Next<ST> | RecursiveArray<Next<ST>>>): Next<ST>[];
}
