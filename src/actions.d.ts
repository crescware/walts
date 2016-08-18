import { State } from './store';

export declare type SyncAction<ST extends State> = (state: ST) => ST
export declare type AsyncAction<ST extends State> =  Promise<(state: ST) => ST>;
export declare type Action<ST extends State> = SyncAction<ST> | AsyncAction<ST>;
export declare type Processor<ST extends State> = (p: Promise<ST>) => Promise<ST>;

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {}

export declare class Actions<ST extends State> {
  protected combine(...nexts: Array<Action<ST> | RecursiveArray<Action<ST>>>): Action<ST>[];
}
