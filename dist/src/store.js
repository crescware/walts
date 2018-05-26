"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var State = /** @class */ (function () {
    function State() {
    }
    return State;
}());
exports.State = State;
var Store = /** @class */ (function () {
    function Store(initState, dispatcher) {
        var _this = this;
        this.dispatcher = dispatcher;
        this.stateRef = Object.assign({}, initState);
        this._observable = new rxjs_1.BehaviorSubject(this.stateRef);
        this.dispatcher.subscribeBegin(function (queue) {
            queue.next(_this.stateRef);
        });
        this.dispatcher.subscribeContinue(function (chunk) {
            _this.stateRef = Object.assign({}, _this.stateRef, chunk.result);
            chunk.queue.next(_this.stateRef);
        });
        this.dispatcher.subscribeComplete(function (result) {
            _this.stateRef = Object.assign({}, _this.stateRef, result);
            _this._observable.next(_this.stateRef);
        }, function (err) {
            _this._observable.error(err);
        });
    }
    Object.defineProperty(Store.prototype, "observable", {
        get: function () {
            return this._observable;
        },
        enumerable: true,
        configurable: true
    });
    return Store;
}());
exports.Store = Store;
