/**
 * Checks if value is float 32 array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is float 32 array. False otherwise.
 */
export function isFloat32Array(x: any): x is Float32Array
{
    return x instanceof Float32Array;
}
