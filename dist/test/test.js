"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs");
var assert = require("power-assert");
var actions_1 = require("../src/actions");
var dispatcher_1 = require("../src/dispatcher");
var store_1 = require("../src/store");
describe('Integration', function () {
    describe('Sync', function () {
        var TestActions = /** @class */ (function (_super) {
            __extends(TestActions, _super);
            function TestActions() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TestActions.prototype.addToA = function (n) {
                return function (st) {
                    return {
                        a: st.a + n
                    };
                };
            };
            TestActions.prototype.addToB = function (n) {
                return function (st) {
                    return {
                        b: st.b + n
                    };
                };
            };
            TestActions.prototype.causeError = function () {
                return function (st) {
                    throw new Error('Dummy error');
                };
            };
            return TestActions;
        }(actions_1.Actions));
        var actions = new TestActions();
        var TestDispatcher = /** @class */ (function (_super) {
            __extends(TestDispatcher, _super);
            function TestDispatcher() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return TestDispatcher;
        }(dispatcher_1.Dispatcher));
        var initState = {
            a: 1,
            b: 1
        };
        var TestStore = /** @class */ (function (_super) {
            __extends(TestStore, _super);
            function TestStore(dispatcher) {
                return _super.call(this, initState, dispatcher) || this;
            }
            return TestStore;
        }(store_1.Store));
        it('correctly emit() to work', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            var value = 1;
            var i = 0;
            store.observable.subscribe(function (st) {
                if (i === 1) {
                    assert(st.a === initState.a + value);
                    assert(st.b === initState.b);
                    done();
                }
                i++;
            });
            dispatcher.emit(actions.addToA(value));
        });
        it('correctly emitAll() to work', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            var i = 0;
            store.observable.subscribe(function (st) {
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
        it('correctly continuous emit() to work', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            var i = 0;
            store.observable.subscribe(function (st) {
                if (i === 0) {
                    assert(st.a === 1);
                }
                if (i === 1) {
                    assert(st.a === 2);
                }
                if (i === 2) {
                    assert(st.a === 4);
                }
                if (i === 3) {
                    assert(st.a === 7);
                    done();
                }
                i++;
            });
            setTimeout(function () { return dispatcher.emit(actions.addToA(1)); }, 1);
            setTimeout(function () { return dispatcher.emit(actions.addToA(2)); }, 2);
            setTimeout(function () { return dispatcher.emit(actions.addToA(3)); }, 3);
        });
        it('correctly continuous emitAll() to work', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            var i = 0;
            store.observable.subscribe(function (st) {
                if (i === 0) {
                    assert(st.a === 1);
                }
                if (i === 1) {
                    assert(st.a === 4);
                }
                if (i === 2) {
                    assert(st.a === 11);
                }
                if (i === 3) {
                    assert(st.a === 22);
                    done();
                }
                i++;
            });
            setTimeout(function () { return dispatcher.emitAll([actions.addToA(1), actions.addToA(2)]); }, 1);
            setTimeout(function () { return dispatcher.emitAll([actions.addToA(3), actions.addToA(4)]); }, 2);
            setTimeout(function () { return dispatcher.emitAll([actions.addToA(5), actions.addToA(6)]); }, 3);
        });
        it('correctly continuous emit() and calculate to multiple properties to work', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            var i = 0;
            store.observable.subscribe(function (st) {
                if (i === 0) {
                    assert(st.a === 1);
                    assert(st.b === 1);
                }
                if (i === 1) {
                    assert(st.a === 2);
                    assert(st.b === 1);
                }
                if (i === 2) {
                    assert(st.a === 2);
                    assert(st.b === 3);
                }
                if (i === 3) {
                    assert(st.a === 5);
                    assert(st.b === 3);
                    done();
                }
                i++;
            });
            setTimeout(function () { return dispatcher.emit(actions.addToA(1)); }, 1);
            setTimeout(function () { return dispatcher.emit(actions.addToB(2)); }, 2);
            setTimeout(function () { return dispatcher.emit(actions.addToA(3)); }, 3);
        });
        it('correctly continuous emitAll() and calculate to multiple properties to work', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            var i = 0;
            store.observable.subscribe(function (st) {
                if (i === 0) {
                    assert(st.a === 1);
                    assert(st.b === 1);
                }
                if (i === 1) {
                    assert(st.a === 2);
                    assert(st.b === 3);
                }
                if (i === 2) {
                    assert(st.a === 5);
                    assert(st.b === 7);
                }
                if (i === 3) {
                    assert(st.a === 10);
                    assert(st.b === 13);
                    done();
                }
                i++;
            });
            setTimeout(function () { return dispatcher.emitAll([actions.addToA(1), actions.addToB(2)]); }, 1);
            setTimeout(function () { return dispatcher.emitAll([actions.addToA(3), actions.addToB(4)]); }, 2);
            setTimeout(function () { return dispatcher.emitAll([actions.addToA(5), actions.addToB(6)]); }, 3);
        });
        it('can catch an error', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            store.observable.subscribe(function () { }, function (err) {
                assert(err.message === 'Dummy error');
                done();
            });
            dispatcher.emit(actions.causeError());
        });
    });
    describe('Delayed', function () {
        var TestActions = /** @class */ (function (_super) {
            __extends(TestActions, _super);
            function TestActions() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            TestActions.prototype.delayedAddToA = function (n) {
                var _this = this;
                return function (st) {
                    return _this.delayed(function (apply) {
                        apply(_this.addToA(n));
                    });
                };
            };
            TestActions.prototype.addToA = function (n) {
                return function (st) {
                    return {
                        a: st.a + n
                    };
                };
            };
            TestActions.prototype.causeError = function () {
                var _this = this;
                return function (st) {
                    return _this.delayed(function (apply) {
                        throw new Error('Dummy error');
                    });
                };
            };
            TestActions.prototype.causeErrorAfterApply = function () {
                var _this = this;
                return function (st) {
                    return _this.delayed(function (apply) {
                        apply(function (st) {
                            throw new Error('Dummy error inner apply');
                        });
                    });
                };
            };
            TestActions.prototype.causeErrorNested = function () {
                var _this = this;
                return function (st) {
                    return _this.delayed(function (apply) {
                        apply(_this.causeError());
                    });
                };
            };
            return TestActions;
        }(actions_1.Actions));
        var actions = new TestActions();
        var TestDispatcher = /** @class */ (function (_super) {
            __extends(TestDispatcher, _super);
            function TestDispatcher() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return TestDispatcher;
        }(dispatcher_1.Dispatcher));
        var initState = {
            a: 1,
            b: 1
        };
        var TestStore = /** @class */ (function (_super) {
            __extends(TestStore, _super);
            function TestStore(dispatcher) {
                return _super.call(this, initState, dispatcher) || this;
            }
            return TestStore;
        }(store_1.Store));
        it('correctly emit() to work', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            var value = 1;
            var i = 0;
            store.observable.subscribe(function (st) {
                if (i === 1) {
                    assert(st.a === initState.a + value);
                    assert(st.b === initState.b);
                    done();
                }
                i++;
            });
            dispatcher.emit(actions.delayedAddToA(value));
        });
        it('can catch an error', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            store.observable.subscribe(function () { }, function (err) {
                assert(err.message === 'Dummy error');
                done();
            });
            dispatcher.emit(actions.causeError());
        });
        it('can catch an error when caused from inner apply()', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            store.observable.subscribe(function () { }, function (err) {
                assert(err.message === 'Dummy error inner apply');
                done();
            });
            dispatcher.emit(actions.causeErrorAfterApply());
        });
        it('can catch an error when caused in nested actions', function (done) {
            var dispatcher = new TestDispatcher();
            var store = new TestStore(dispatcher);
            store.observable.subscribe(function () { }, function (err) {
                assert(err.message === 'Dummy error');
                done();
            });
            dispatcher.emit(actions.causeErrorNested());
        });
    });
});
describe('Nested emitAll', function () {
    var TestActions = /** @class */ (function (_super) {
        __extends(TestActions, _super);
        function TestActions() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestActions.prototype.addToA = function (n) {
            return function (st) {
                return {
                    a: st.a + n
                };
            };
        };
        TestActions.prototype.addToB = function (n) {
            return function (st) {
                return {
                    b: st.b + n
                };
            };
        };
        TestActions.prototype.useCombine = function (n) {
            return this.combine([
                function (st) {
                    return {
                        a: st.a + n
                    };
                },
                function (st) {
                    return {
                        b: st.b + n
                    };
                },
                this.addToA(n * 2),
                this.addToB(n * 2)
            ]);
        };
        TestActions.prototype.useCombineNested = function (n) {
            return this.combine([
                function (st) {
                    return {
                        a: st.a + n
                    };
                },
                this.addToA(1),
                this.useCombine(1)
            ]);
        };
        return TestActions;
    }(actions_1.Actions));
    var actions = new TestActions();
    var TestDispatcher = /** @class */ (function (_super) {
        __extends(TestDispatcher, _super);
        function TestDispatcher() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TestDispatcher;
    }(dispatcher_1.Dispatcher));
    var initState = {
        a: 1,
        b: 1
    };
    var TestStore = /** @class */ (function (_super) {
        __extends(TestStore, _super);
        function TestStore(dispatcher) {
            return _super.call(this, initState, dispatcher) || this;
        }
        return TestStore;
    }(store_1.Store));
    it('correctly emitAll() to work with combine', function (done) {
        var dispatcher = new TestDispatcher();
        var store = new TestStore(dispatcher);
        var i = 0;
        store.observable.subscribe(function (st) {
            if (i === 1) {
                assert(st.a === 8);
                assert(st.b === 7);
                done();
            }
            i++;
        });
        dispatcher.emitAll([
            actions.addToA(1),
            actions.useCombine(2)
        ]);
    });
    it('correctly emitAll() to work with nested combine', function (done) {
        var dispatcher = new TestDispatcher();
        var store = new TestStore(dispatcher);
        var i = 0;
        store.observable.subscribe(function (st) {
            if (i === 1) {
                assert(st.a === 10);
                assert(st.b === 7);
                done();
            }
            i++;
        });
        dispatcher.emitAll([
            actions.useCombine(1),
            actions.useCombineNested(2),
        ]);
    });
});
describe('Nested state', function () {
    var TestActions = /** @class */ (function (_super) {
        __extends(TestActions, _super);
        function TestActions() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestActions.prototype.addToA21NotConsider = function (n) {
            return function (st) {
                return {
                    a: {
                        a2: {
                            a21: st.a.a2.a21 + n
                        }
                    }
                };
            };
        };
        TestActions.prototype.addToA21 = function (n) {
            return function (st) {
                st.a.a2.a21 = st.a.a2.a21 + n;
                return st;
            };
        };
        return TestActions;
    }(actions_1.Actions));
    var actions = new TestActions();
    var TestDispatcher = /** @class */ (function (_super) {
        __extends(TestDispatcher, _super);
        function TestDispatcher() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TestDispatcher;
    }(dispatcher_1.Dispatcher));
    var initState = {
        a: {
            a1: 1,
            a2: {
                a21: 1,
                a22: 1
            }
        },
        b: 1
    };
    var TestStore = /** @class */ (function (_super) {
        __extends(TestStore, _super);
        function TestStore(dispatcher) {
            return _super.call(this, initState, dispatcher) || this;
        }
        return TestStore;
    }(store_1.Store));
    it('all values are cleared when that does not consider the rewriting of nested objects', function (done) {
        var dispatcher = new TestDispatcher();
        var store = new TestStore(dispatcher);
        var value = 1;
        var i = 0;
        store.observable.subscribe(function (st) {
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
    it('is performed property rewriting of nested objects correctly, the value is maintained', function (done) {
        var dispatcher = new TestDispatcher();
        var store = new TestStore(dispatcher);
        var value = 1;
        var i = 0;
        store.observable.subscribe(function (st) {
            if (i === 1) {
                assert.deepEqual(st, initState);
                done();
            }
            i++;
        });
        dispatcher.emit(actions.addToA21(value));
    });
});
