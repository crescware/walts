"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Actions = /** @class */ (function () {
    function Actions() {
    }
    Actions.prototype.combine = function (actions) {
        return utils_1.flatten(actions);
    };
    Actions.prototype.delayed = function (executor) {
        return new Promise(executor);
    };
    return Actions;
}());
exports.Actions = Actions;
