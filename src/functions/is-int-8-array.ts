/**
 * Checks if value is int 8 array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is int 8 array. False otherwise.
 */
export function isInt8Array(x: any): x is Int8Array
{
    return x instanceof Int8Array;
}
