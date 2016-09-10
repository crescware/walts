import { RecursiveArray } from './actions';

declare var require: any;
const _cloneDeep = require('lodash.clonedeep');

export function cloneDeep<T>(obj: T): T {
  return _cloneDeep(obj);
}

export function flatten<T>(array: Array<T | RecursiveArray<T>>): Array<T | RecursiveArray<T>> {
  return array.reduce<Array<T | RecursiveArray<T>>>((p: Array<T | RecursiveArray<T>>, c: T | RecursiveArray<T>) => {
    return Array.isArray(c)
      ? p.concat(flatten<T | RecursiveArray<T>>(c))
      : p.concat(c);
  }, []);
}
