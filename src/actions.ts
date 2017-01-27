import { State } from './store'
import { flatten } from './utils'

export type Delayed<ST extends State> = Promise<Action<ST> | Action<ST>[]>

export type SyncAction   <ST extends State> = (state: ST) => ST
export type DelayedAction<ST extends State> = (state: ST) => Delayed<ST>
export type Action       <ST extends State> = SyncAction<ST> | DelayedAction<ST>

type Executor<ST extends State> = (
  apply: (actionOrActions: Action<ST> | Action<ST>[] | PromiseLike<Action<ST> | Action<ST>[]>) => void,
  reject: (reason?: any) => void
) => void

export class Actions<ST extends State> {

  protected combine(actions: (Action<ST> | Action<ST>[])[]): Action<ST>[] {
    return flatten<Action<ST>>(actions as Action<ST>[]) as Action<ST>[]
  }

  protected delayed(executor: Executor<ST>): Delayed<ST> {
    return new Promise(executor)
  }

}
