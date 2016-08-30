import 'rxjs';
import * as assert from 'power-assert';
import { Actions, Action } from '../src/actions';
import { Dispatcher } from '../src/dispatcher';
import { Store } from '../src/store';

describe('Integration', () => {
  describe('Sync', () => {
    interface TestState {
      a: number;
      b: number;
    }

    class TestActions extends Actions<TestState> {
      addToA(n: number): Action<TestState> {
        return (st) => {
          return {
            a: st.a + n
          } as TestState;
        };
      }

      addToB(n: number): Action<TestState> {
        return (st) => {
          return {
            b: st.b + n
          } as TestState;
        };
      }
    }

    const actions = new TestActions();

    class TestDispatcher extends Dispatcher<TestState> {}

    const initState: TestState = {
      a: 1,
      b: 1
    };
    class TestStore extends Store<TestState> {
      constructor(dispatcher: TestDispatcher) {
        super(initState, dispatcher);
      }
    }

    it('correctly emit() to work', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      const value = 1;

      store.observable
        .map<{st: TestState; i: number}>((st, i) => {
          return {st, i};
        })
        .filter((data) => 1 === data.i)
        .subscribe((data) => {
          assert(data.st.a === initState.a + value);
          assert(data.st.b === initState.b);
          done();
        });
      dispatcher.emit(actions.addToA(value));
    });

    it('correctly emitAll() to work', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      store.observable
        .map<{st: TestState; i: number}>((st, i) => {
          return {st, i};
        })
        .filter((data) => 1 === data.i)
        .subscribe((data) => {
          assert(data.st.a === 5);
          assert(data.st.b === 4);
          done();
        });
      dispatcher.emitAll([
        actions.addToA(2),
        actions.addToB(3),
        actions.addToA(2),
      ]);
    });
  });
});