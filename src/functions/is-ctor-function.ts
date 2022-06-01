import isFunction from 'lodash/isFunction';

/**
 * Checks if value is a constructor function.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is a constructor function. False otherwise.
 */
export function isCtorFunction(x: any): x is new (...args: Array<any>) => any
{
    return isFunction(x) && x.prototype && x.prototype.constructor === x && x.name !== '';
}
