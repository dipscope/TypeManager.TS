/**
 * Checks if value is float 64 array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is float 64 array. False otherwise.
 */
export function isFloat64Array(x: any): x is Float64Array
{
    return x instanceof Float64Array;
}
