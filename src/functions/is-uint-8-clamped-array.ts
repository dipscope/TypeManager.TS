/**
 * Checks if value is uint 8 clamped array.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} True when value is uint 8 clamped array. False otherwise.
 */
export function isUint8ClampedArray(x: any): x is Uint8ClampedArray
{
    return x instanceof Uint8ClampedArray;
}
