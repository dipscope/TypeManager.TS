/**
 * Defines name for any value.
 * 
 * @param {any} x Input value.
 * 
 * @returns {boolean} Name when present. Unknown otherwise.
 */
export function nameOf(x: any): string
{
    return typeof x === 'function' ? x.name : 'Unknown';
}
