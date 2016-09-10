import 'rxjs';
import * as assert from 'power-assert';
import { Actions, SyncAction, DelayedAction, AsyncAction } from '../src/actions';
import { Dispatcher } from '../src/dispatcher';
import { Store } from '../src/store';

describe('Integration', () => {
  describe('Sync', () => {
    interface TestState {
      a: number;
      b: number;
    }

    class TestActions extends Actions<TestState> {
      addToA(n: number): SyncAction<TestState> {
        return (st) => {
          return {
            a: st.a + n
          } as TestState;
        };
      }

      addToB(n: number): SyncAction<TestState> {
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
        i++;
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
        i++;
      });

      dispatcher.emitAll([
        actions.addToA(2),
        actions.addToB(3),
        actions.addToA(2),
      ]);
    });

    it('correctly continuous emit() to work', (done) => {
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

    it('correctly continuous emitAll() to work', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      let i = 0;
      store.observable.subscribe((st) => {
        if (i === 0) { assert(st.a === 1); }
        if (i === 1) { assert(st.a === 4); }
        if (i === 2) { assert(st.a === 11); }
        if (i === 3) { assert(st.a === 22); done(); }
        i++;
      });

      setTimeout(() => dispatcher.emitAll([actions.addToA(1), actions.addToA(2)]), 1);
      setTimeout(() => dispatcher.emitAll([actions.addToA(3), actions.addToA(4)]), 2);
      setTimeout(() => dispatcher.emitAll([actions.addToA(5), actions.addToA(6)]), 3);
    });

    it('correctly continuous emit() and calculate to multiple properties to work', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      let i = 0;
      store.observable.subscribe((st) => {
        if (i === 0) { assert(st.a === 1); assert(st.b === 1); }
        if (i === 1) { assert(st.a === 2); assert(st.b === 1); }
        if (i === 2) { assert(st.a === 2); assert(st.b === 3); }
        if (i === 3) { assert(st.a === 5); assert(st.b === 3); done(); }
        i++;
      });

      setTimeout(() => dispatcher.emit(actions.addToA(1)), 1);
      setTimeout(() => dispatcher.emit(actions.addToB(2)), 2);
      setTimeout(() => dispatcher.emit(actions.addToA(3)), 3);
    });

    it('correctly continuous emitAll() and calculate to multiple properties to work', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      let i = 0;
      store.observable.subscribe((st) => {
        if (i === 0) { assert(st.a === 1);  assert(st.b === 1); }
        if (i === 1) { assert(st.a === 2);  assert(st.b === 3); }
        if (i === 2) { assert(st.a === 5);  assert(st.b === 7); }
        if (i === 3) { assert(st.a === 10); assert(st.b === 13); done(); }
        i++;
      });

      setTimeout(() => dispatcher.emitAll([actions.addToA(1), actions.addToB(2)]), 1);
      setTimeout(() => dispatcher.emitAll([actions.addToA(3), actions.addToB(4)]), 2);
      setTimeout(() => dispatcher.emitAll([actions.addToA(5), actions.addToB(6)]), 3);
    });
  });

  describe('Delayed', () => {
    interface TestState {
      a: number;
      b: number;
    }

    class TestActions extends Actions<TestState> {
      delayedAddToA(n: number): DelayedAction<TestState> {
        return (st: TestState) => {
          return this.delayed((apply) => {
            apply(this.addToA(n));
          });
        };
      }
      addToA(n: number): SyncAction<TestState> {
        return (st) => {
          return {
            a: st.a + n
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
        i++;
      });

      dispatcher.emit(actions.delayedAddToA(value));
    });
  });

  describe('Async', () => {
    interface TestState {
      a: number;
      b: number;
    }

    class TestActions extends Actions<TestState> {
      addToAAfter2Sec(n: number): AsyncAction<TestState> {
        return new Promise((resolve) => {
          resolve((st: TestState) => {
            return {
              a: st.a + n
            } as TestState;
          });
        });
      }
      addToA(n: number): SyncAction<TestState> {
        return (st) => {
          return {
            a: st.a + n
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
        i++;
      });

      dispatcher.emit(actions.addToAAfter2Sec(value));
    });

    it('correctly SyncAction -> AsyncAction to work', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      const value = 1;

      let i = 0;
      store.observable.subscribe((st) => {
        if (i === 1) {
          assert(st.a === initState.a + value + value);
          assert(st.b === initState.b);
          done();
        }
        i++;
      });

      dispatcher.emitAll([
        actions.addToA(value),
        actions.addToAAfter2Sec(value)
      ]);
    });

    it('correctly AsyncAction -> SyncAction to work', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      const value = 1;

      let i = 0;
      store.observable.subscribe((st) => {
        if (i === 1) {
          assert(st.a === initState.a + value + value);
          assert(st.b === initState.b);
          done();
        }
        i++;
      });

      dispatcher.emitAll([
        actions.addToAAfter2Sec(value),
        actions.addToA(value)
      ]);
    });

  });
});
