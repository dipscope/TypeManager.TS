/**
 * Checks if value is uint 16 array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is uint 16 array. False otherwise.
 */
export function isUint16Array(x: any): x is Uint16Array
{
    return x instanceof Uint16Array;
}
