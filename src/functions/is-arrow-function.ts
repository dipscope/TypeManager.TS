import { isFunction } from 'lodash';

/**
 * Checks if value is an arrow function.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is an arrow function. False otherwise.
 */
export function isArrowFunction(x: any): x is (...args: Array<any>) => any
{
    return isFunction(x) && x.prototype && x.prototype.constructor === x && x.name === '';
}
