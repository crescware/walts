declare var require: any;
const _cloneDeep = require('lodash.clonedeep');

export function cloneDeep<T>(obj: T): T {
  return _cloneDeep(obj);
}
