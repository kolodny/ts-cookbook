"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Infer which keys of T to pick. */
exports.inferPick = function() {
  return function(x) {
    return x;
  };
};
/** Create a shallow readonly T. */
function shallowReadonly(t) {
  return t;
}
exports.shallowReadonly = shallowReadonly;
/** Create a nested readonly T. */
function readonly(t) {
  return t;
}
exports.readonly = readonly;
