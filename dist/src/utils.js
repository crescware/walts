"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function flatten(array) {
    return array.reduce(function (p, c) {
        return Array.isArray(c)
            ? p.concat(flatten(c))
            : p.concat(c);
    }, []);
}
exports.flatten = flatten;
