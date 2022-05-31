/**
 * Checks if value is int 16 array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is int 16 array. False otherwise.
 */
export function isInt16Array(x: any): x is Int16Array
{
    return x instanceof Int16Array;
}
