"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var internal_compatibility_1 = require("rxjs/internal-compatibility");
var utils_1 = require("./utils");
function finish(resolve, complete$) {
    return {
        next: function (st) {
            resolve(st);
            if (complete$) {
                complete$.next(st);
            }
        }
    };
}
function isAction(v) {
    return typeof v === 'function';
}
function isActions(v) {
    return Array.isArray(v);
}
function isDelayed(v) {
    return internal_compatibility_1.isPromise(v);
}
var Dispatcher = /** @class */ (function () {
    function Dispatcher() {
        this.begin$ = new rxjs_1.Subject();
        this.continue$ = new rxjs_1.Subject();
        this.complete$ = new rxjs_1.Subject();
    }
    Dispatcher.prototype.emit = function (action) {
        this._emit(action, this.complete$);
    };
    Dispatcher.prototype.emitAll = function (actions) {
        this._emitAll(actions, this.complete$);
    };
    Dispatcher.prototype.subscribeBegin = function (observer) {
        this.begin$.subscribe(function (queue) { return observer(queue); });
    };
    Dispatcher.prototype.subscribeContinue = function (observer) {
        this.continue$.subscribe(function (chunk) { return observer(chunk); });
    };
    Dispatcher.prototype.subscribeComplete = function (observer, errorHandler) {
        this.complete$.subscribe(function (result) { return observer(result); }, function (err) { return errorHandler(err); });
    };
    Dispatcher.prototype._emit = function (action, complete$) {
        if (isActions(action)) {
            return this._emitAll(action, complete$);
        }
        return this._emitAll([action], complete$);
    };
    Dispatcher.prototype._emitAll = function (_actions, complete$) {
        var _this = this;
        var actions = utils_1.flatten(_actions);
        var promise = new Promise(function (resolve) {
            var queues = actions.map(function (_) { return new rxjs_1.Subject(); });
            queues.forEach(function (queue, i) {
                var action = actions[i];
                var nextQueue = queues[i + 1]
                    ? queues[i + 1]
                    : finish(resolve, complete$);
                queue.subscribe(function (state) {
                    var syncOrDelayedAction = action;
                    var stateOrDelayed;
                    try {
                        stateOrDelayed = syncOrDelayedAction(state);
                    }
                    catch (e) {
                        _this.complete$.error(e);
                    }
                    if (isDelayed(stateOrDelayed)) {
                        _this.whenDelayed(stateOrDelayed, nextQueue, function (err) { return _this.complete$.error(err); });
                        return;
                    }
                    _this.continueNext(stateOrDelayed, nextQueue);
                });
            });
            _this.begin$.next(queues[0]);
        });
        return promise;
    };
    Dispatcher.prototype.whenDelayed = function (result, nextQueue, errorHandler) {
        var _this = this;
        result
            .then(function (value) {
            if (isAction(value)) {
                return _this._emit(value)
                    .then(function (v) { return _this.continueNext(v, nextQueue); });
            }
            if (isActions(value)) {
                return _this._emitAll(value)
                    .then(function (v) { return _this.continueNext(v, nextQueue); });
            }
        })
            .catch(function (err) { return errorHandler(err); });
    };
    Dispatcher.prototype.continueNext = function (result, queue) {
        this.continue$.next({ result: result, queue: queue });
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
