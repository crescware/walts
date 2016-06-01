import { State } from './store';

export type Reducer<ST extends State> = (state: ST) => Promise<ST>;
export type AsyncReducer<ST extends State> = (p: Promise<ST>) => Promise<ST>;

export class Action<ST extends State> {

  protected merge(curr: ST, next: ST): ST {
    return Object.assign({}, curr, next);
  }

}
