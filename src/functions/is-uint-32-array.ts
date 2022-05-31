/**
 * Checks if value is uint 32 array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is uint 32 array. False otherwise.
 */
export function isUint32Array(x: any): x is Uint32Array
{
    return x instanceof Uint32Array;
}
