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

      let i = 0;
      store.observable.subscribe((st) => {
        if (i === 1) {
          assert(st.a === initState.a + value);
          assert(st.b === initState.b);
          done();
        }
      });

      dispatcher.emit(actions.addToA(value));
    });

    it('correctly emitAll() to work', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      let i = 0;
      store.observable.subscribe((st) => {
        if (i === 1) {
          assert(st.a === 5);
          assert(st.b === 4);
          done();
        }
      });

      dispatcher.emitAll([
        actions.addToA(2),
        actions.addToB(3),
        actions.addToA(2),
      ]);
    });

    it.only('correctly continuous emit() to work', function(done) {
      this.timeout(5000);

      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      let i = 0;
      store.observable.subscribe((st) => {
        if (i === 0) { assert(st.a === 1); }
        if (i === 1) { assert(st.a === 2); }
        if (i === 2) { assert(st.a === 4); }
        if (i === 3) { assert(st.a === 7); done(); }
        i++;
      });

      setTimeout(() => dispatcher.emit(actions.addToA(1)), 1);
      setTimeout(() => dispatcher.emit(actions.addToA(2)), 2);
      setTimeout(() => dispatcher.emit(actions.addToA(3)), 3);
    });
  });
});