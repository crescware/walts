import { State } from './store';

export declare type SyncAction <ST extends State> = (state: ST) => ST

export declare class Actions<ST extends State> {}
