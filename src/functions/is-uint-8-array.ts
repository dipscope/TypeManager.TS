/**
 * Checks if value is uint 8 array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is uint 8 array. False otherwise.
 */
export function isUint8Array(x: any): x is Uint8Array
{
    return x instanceof Uint8Array;
}
