import { State } from './store';

declare type SyncNext<ST extends State> = (state: ST) => ST
declare type AsyncNext<ST extends State> =  Promise<(state: ST) => ST>;
export declare type Next<ST extends State> = SyncNext<ST> | AsyncNext<ST>;
export declare type Processor<ST extends State> = (p: Promise<ST>) => Promise<ST>;

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export declare class Action<ST extends State> {
  protected combine(...nexts: Array<Next<ST> | RecursiveArray<Next<ST>>>): Next<ST>[];
}
