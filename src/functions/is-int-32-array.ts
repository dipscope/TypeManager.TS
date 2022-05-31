/**
 * Checks if value is int 32 array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is int 32 array. False otherwise.
 */
export function isInt32Array(x: any): x is Int32Array
{
    return x instanceof Int32Array;
}
