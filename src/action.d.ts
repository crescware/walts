import { State } from './store';

export declare type Reducer<ST extends State> = (state: ST) => Promise<ST>;
export declare type AsyncReducer<ST extends State> = (p: Promise<ST>) => Promise<ST>;

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export declare class Action<ST extends State> {
  protected merge(curr: ST, next: ST): ST;
  protected combine(...reducers: Array<Reducer<ST> | RecursiveArray<Reducer<ST>>>): Reducer<ST>[];
}
