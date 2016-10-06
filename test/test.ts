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

      causeError(): SyncAction<TestState> {
        return (st) => {
          throw new Error('Dummy error');
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

    it('can catch an error', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      store.observable.subscribe(() => {}, (err) => {
        assert(err.message === 'Dummy error');
        done();
      });

      dispatcher.emit(actions.causeError());
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
      causeError(): DelayedAction<TestState> {
        return (st) => {
          return this.delayed((apply) => {
            throw new Error('Dummy error');
          });
        };
      }
      causeErrorAfterApply(): DelayedAction<TestState> {
        return (st) => {
          return this.delayed((apply) => {
            apply((st) => {
              throw new Error('Dummy error inner apply');
            })
          });
        };
      }
      causeErrorNested(): DelayedAction<TestState> {
        return (st) => {
          return this.delayed((apply) => {
            apply(this.causeError());
          });
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

    it('can catch an error', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      store.observable.subscribe(() => {}, (err) => {
        assert(err.message === 'Dummy error');
        done();
      });

      dispatcher.emit(actions.causeError());
    });

    it('can catch an error when caused from inner apply()', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      store.observable.subscribe(() => {}, (err) => {
        assert(err.message === 'Dummy error inner apply');
        done();
      });

      dispatcher.emit(actions.causeErrorAfterApply());
    });

    it('can catch an error when caused in nested actions', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      store.observable.subscribe(() => {}, (err) => {
        assert(err.message === 'Dummy error');
        done();
      });

      dispatcher.emit(actions.causeErrorNested());
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
      causeError(): AsyncAction<TestState> {
        return new Promise((resolve) => {
          resolve((st: TestState) => {
            throw new Error('Dummy error');
          });
        });
      }
      causeErrorWithReject(): AsyncAction<TestState> {
        return new Promise((resolve, reject) => {
          reject('reject');
        });
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

    it('can catch an error', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      store.observable.subscribe(() => {}, (err) => {
        assert(err.message === 'Dummy error');
        done();
      });

      dispatcher.emit(actions.causeError());
    });

    it('can catch an error when rejected inner a promise callback', (done) => {
      const dispatcher = new TestDispatcher();
      const store      = new TestStore(dispatcher);

      store.observable.subscribe(() => {}, (err) => {
        assert(err === 'reject');
        done();
      });

      dispatcher.emit(actions.causeErrorWithReject());
    });

  });
});

describe('Nested state', () => {
  interface TestState {
    a: {
      a1: number;
      a2: {
        a21: number;
        a22: number;
      }
    };
    b: number;
  }

  class TestActions extends Actions<TestState> {
    addToA21NotConsider(n: number): SyncAction<TestState> {
      return (st) => {
        return {
          a: {
            a2: {
              a21: st.a.a2.a21 + n
            }
          }
        } as TestState;
      };
    }

    addToA21(n: number): SyncAction<TestState> {
      return (st) => {
        st.a.a2.a21 = st.a.a2.a21 + n;
        return st;
      };
    }
  }

  const actions = new TestActions();

  class TestDispatcher extends Dispatcher<TestState> {}

  const initState: TestState = {
    a: {
      a1: 1,
      a2: {
        a21: 1,
        a22: 1
      }
    },
    b: 1
  };
  class TestStore extends Store<TestState> {
    constructor(dispatcher: TestDispatcher) {
      super(initState, dispatcher);
    }
  }

  it('all values are cleared when that does not consider the rewriting of nested objects', (done) => {
    const dispatcher = new TestDispatcher();
    const store      = new TestStore(dispatcher);

    const value = 1;

    let i = 0;
    store.observable.subscribe((st) => {
      if (i === 1) {
        assert(st.a.a2.a21 === initState.a.a2.a21 + value);
        assert(st.a.a2.a22 === void 0);
        assert(st.b === initState.b);
        done();
      }
      i++;
    });

    dispatcher.emit(actions.addToA21NotConsider(value));
  });

  it('is performed property rewriting of nested objects correctly, the value is maintained', (done) => {
    const dispatcher = new TestDispatcher();
    const store      = new TestStore(dispatcher);

    const value = 1;

    let i = 0;
    store.observable.subscribe((st) => {
      if (i === 1) {
        assert.deepEqual(st, initState);
        done();
      }
      i++;
    });

    dispatcher.emit(actions.addToA21(value));
  });
});